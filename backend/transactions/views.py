from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
import csv
import io
from datetime import datetime
from rest_framework import status
from .serializers import TransactionSerializer
from .models import Transaction
from .services.fraud_rules import evaluate_fraud_rules
from .services.ml_service import score_transactions, score_single_transaction
from transactions.services.audit_service import log_action
from transactions.models import AuditLog
from django.contrib.auth.models import User
from django.db import models
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import uuid
from django.core.paginator import Paginator
from django.db import transaction as db_transaction


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manual_transaction(request):
    data = request.data
    raw_data = dict(data)

    transaction_id = str(uuid.uuid4())
    amount_str = str(data.get('amount', '')).strip()
    currency = data.get('currency', 'KES').strip().upper()
    transaction_type = data.get('transaction_type', 'expense').strip()
    description = data.get('description', '')[:255].strip()
    merchant = data.get('merchant', '')[:100].strip()
    transaction_date_str = data.get('transaction_date', '').strip()

    allowed_currencies = ['KES', 'USD']
    allowed_types = ['expense', 'sale', 'refund']

    if not transaction_id or not amount_str or not transaction_date_str:
        return Response({"error": "Missing required fields", "data": raw_data}, status=400)

    try:
        amount = float(amount_str)
        if amount < 0:
            raise ValueError()
    except ValueError:
        return Response({"error": f"Invalid amount '{amount_str}'", "data": raw_data}, status=400)

    if currency not in allowed_currencies:
        return Response({"error": f"Invalid currency '{currency}'", "data": raw_data}, status=400)

    if transaction_type not in allowed_types:
        return Response({"error": f"Invalid transaction type '{transaction_type}'", "data": raw_data}, status=400)

    if Transaction.objects.filter(transaction_id=transaction_id).exists():
        return Response({"error": f"Duplicate transaction_id '{transaction_id}'", "data": raw_data}, status=400)

    transaction_date = None
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%d %H:%M:%S"):
        try:
            transaction_date = datetime.strptime(transaction_date_str, fmt)
            break
        except ValueError:
            continue

    if transaction_date is None:
        return Response({"error": f"Invalid date format '{transaction_date_str}'", "data": raw_data}, status=400)

    with db_transaction.atomic():
        transaction = Transaction.objects.create(
            transaction_id=transaction_id,
            amount=amount,
            currency=currency,
            transaction_type=transaction_type,
            description=description,
            merchant=merchant,
            transaction_date=transaction_date,
            employee=request.user,
            source='manual'
        )

        # Step 1: Fraud rules
        fraud_result = evaluate_fraud_rules(transaction)
        transaction.risk_score = fraud_result["risk_score"]
        transaction.flag_reason = fraud_result["flag_reason"]

        # Step 2: ML scoring
        try:
            ml_result = score_single_transaction(transaction)
            transaction.fraud_probability = ml_result["fraud_probability"]
            transaction.ml_flag = ml_result["ml_flag"]
        except Exception as e:
            print(f"[ML DEBUG] Single scoring failed: {str(e)}")
            transaction.fraud_probability = 0.0
            transaction.ml_flag = 0

        # Step 3: Combine into final score (ML weighted 70%, rules 30%)
        rule_score = transaction.risk_score or 0
        ml_score = (transaction.fraud_probability or 0) * 100
        transaction.final_risk_score = round((rule_score * 0.3) + (ml_score * 0.7), 2)
        transaction.final_flag = 1 if transaction.final_risk_score >= 40 else 0

        # Step 4: Set is_flagged based on final score
        transaction.is_flagged = transaction.final_flag == 1

        # Step 5: Single save
        transaction.save()

        log_action(
            transaction=transaction,
            user=request.user,
            action="CREATE",
            details=f"Manual input: {transaction.transaction_id}"
        )

    return Response({
        "message": "Transaction created successfully",
        "transaction_id": transaction.transaction_id,
        "is_flagged": transaction.is_flagged,
        "ml_flag": transaction.ml_flag,
        "risk_score": transaction.risk_score,
        "final_risk_score": transaction.final_risk_score,
        "fraud_probability": transaction.fraud_probability,
        "flag_reason": transaction.flag_reason
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_audit_logs(request):
    logs = AuditLog.objects.all().order_by('-timestamp')[:100]
    data = [
        {
            "transaction_id": log.transaction.transaction_id if log.transaction else None,
            "user": log.performed_by.username if log.performed_by else "SYSTEM",
            "action": log.action,
            "details": log.details,
            "timestamp": log.timestamp,
        }
        for log in logs
    ]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_employees(request):
    users = User.objects.filter(is_staff=False)
    data = [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_active": u.is_active,
        }
        for u in users
    ]
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_employee(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"message": f"Employee {username} created", "id": user.id})


@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def update_employee(request, user_id):
    try:
        user = User.objects.get(id=user_id)

        email = request.data.get("email")
        username = request.data.get("username")

        if email is not None:
            user.email = email
        if username is not None:
            user.username = username

        user.save()

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_transactions(request):
    user = request.user
    limit = request.query_params.get('limit')

    if user.is_staff:
        transactions = Transaction.objects.all().order_by('-transaction_date')
    else:
        transactions = Transaction.objects.filter(employee=user).order_by('-transaction_date')

    if limit:
        transactions = transactions[:int(limit)]

    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_employees(request):
    users = User.objects.filter(is_staff=False)
    data = [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_active": u.is_active
        }
        for u in users
    ]
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def toggle_user_status(request, user_id):
    user = User.objects.get(id=user_id)
    user.is_active = not user.is_active
    user.save()
    return Response({"is_active": user.is_active})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_transactions(request):
    file = request.FILES.get('file')
    if not file:
        return Response({"error": "No file uploaded"}, status=400)
    if not file.name.lower().endswith('.csv'):
        return Response({"error": "Only CSV allowed"}, status=400)

    try:
        decoded_file = file.read().decode('utf-8-sig')
    except UnicodeDecodeError:
        return Response({"error": "Invalid file encoding. Please use UTF-8."}, status=400)

    io_string = io.StringIO(decoded_file)
    csv_reader = csv.DictReader(io_string)
    csv_reader.fieldnames = [field.strip().lower().replace(" ", "_") for field in csv_reader.fieldnames]

    created = 0
    errors = []
    new_transactions = []

    allowed_currencies = ['KES', 'USD']
    allowed_types = ['expense', 'sale', 'refund']

    for index, row in enumerate(csv_reader, start=1):
        row = {key: (value.strip() if value else "") for key, value in row.items()}
        raw_data = dict(row)

        try:
            transaction_id = row.get('transaction_id')
            amount_str = row.get('amount')
            transaction_type = row.get('transaction_type', 'expense').lower()
            description = row.get('description', '')[:255]
            merchant = row.get('merchant', '')[:100]
            transaction_date_str = row.get('transaction_date')
            currency = row.get('currency', 'KES').upper()

            if not amount_str or not transaction_date_str:
                errors.append({"row": index, "data": raw_data, "error": "Missing required fields"})
                continue

            if not transaction_id:
                transaction_id = f"TX{uuid.uuid4().hex[:8].upper()}"

            try:
                amount = float(amount_str)
                if amount < 0:
                    raise ValueError()
            except ValueError:
                errors.append({"row": index, "data": raw_data, "error": f"Invalid amount '{amount_str}'"})
                continue

            if currency not in allowed_currencies or transaction_type not in allowed_types:
                errors.append({"row": index, "data": raw_data, "error": "Invalid currency or transaction type"})
                continue

            if Transaction.objects.filter(transaction_id=transaction_id).exists():
                errors.append({"row": index, "data": raw_data, "error": f"Duplicate transaction_id '{transaction_id}'"})
                continue

            transaction_date = None
            for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%d %H:%M:%S"):
                try:
                    transaction_date = datetime.strptime(transaction_date_str, fmt)
                    break
                except ValueError:
                    continue

            if transaction_date is None:
                errors.append({"row": index, "data": raw_data, "error": f"Invalid date format '{transaction_date_str}'"})
                continue

            with db_transaction.atomic():
                transaction = Transaction.objects.create(
                    transaction_id=transaction_id,
                    amount=amount,
                    currency=currency,
                    transaction_type=transaction_type,
                    description=description,
                    merchant=merchant,
                    transaction_date=transaction_date,
                    employee=request.user,
                    source='csv'
                )

                # Step 1: Fraud rules
                fraud_result = evaluate_fraud_rules(transaction)
                transaction.risk_score = fraud_result["risk_score"]
                transaction.flag_reason = fraud_result["flag_reason"]

                # Step 2: ML scoring
                try:
                    ml_result = score_single_transaction(transaction)
                    transaction.fraud_probability = ml_result["fraud_probability"]
                    transaction.ml_flag = ml_result["ml_flag"]
                except Exception as e:
                    print(f"[ML DEBUG] scoring failed: {str(e)}")
                    transaction.fraud_probability = 0.0
                    transaction.ml_flag = 0

                # Step 3: Combine into final score (ML weighted 70%, rules 30%)
                rule_score = transaction.risk_score or 0
                ml_score = (transaction.fraud_probability or 0) * 100
                transaction.final_risk_score = round((rule_score * 0.3) + (ml_score * 0.7), 2)
                transaction.final_flag = 1 if transaction.final_risk_score >= 40 else 0

                # Step 4: Set is_flagged based on final score
                transaction.is_flagged = transaction.final_flag == 1

                # Step 5: Single save
                transaction.save()

                log_action(
                    transaction=transaction,
                    user=request.user,
                    action="CREATE",
                    details=f"CSV upload: {transaction.transaction_id}"
                )

                new_transactions.append(transaction)
                created += 1

        except Exception as e:
            errors.append({"row": index, "data": raw_data, "error": str(e)})

    total_flagged = Transaction.objects.filter(
        id__in=[t.id for t in new_transactions],
        is_flagged=True
    ).count()

    return Response({
        "created": created,
        "flagged": total_flagged,
        "errors": errors
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_stats(request):
    employee = request.user
    total = Transaction.objects.filter(employee=employee).count()
    flagged = Transaction.objects.filter(employee=employee, is_flagged=True).count()
    normal = total - flagged
    return Response({
        "total_transactions": total,
        "flagged_transactions": flagged,
        "normal_transactions": normal
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    total = Transaction.objects.count()
    flagged = Transaction.objects.filter(is_flagged=True).count()
    normal = Transaction.objects.filter(is_flagged=False).count()
    return Response({
        "total_transactions": total,
        "flagged_transactions": flagged,
        "normal_transactions": normal
    })


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_transactions(request):
    transactions = Transaction.objects.all().order_by("-uploaded_at")

    employee_id = request.GET.get("employee_id")
    flagged = request.GET.get("flagged")

    if employee_id:
        transactions = transactions.filter(employee_id=employee_id)
    if flagged == "true":
        transactions = transactions.filter(is_flagged=True)

    page = int(request.GET.get("page", 1))
    limit = int(request.GET.get("limit", 50))
    paginator = Paginator(transactions, limit)
    page_obj = paginator.get_page(page)

    serializer = TransactionSerializer(page_obj, many=True)
    return Response({
        "results": serializer.data,
        "total_pages": paginator.num_pages,
        "total_items": paginator.count
    })


@api_view(['POST'])
@permission_classes([IsAdminUser])
def review_transaction(request, transaction_id):
    try:
        transaction = Transaction.objects.get(id=transaction_id)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction not found"}, status=404)

    action = request.data.get("action")
    if action not in ["approve", "block"]:
        return Response({"error": "Invalid action"}, status=400)

    transaction.admin_review_status = "approved" if action == "approve" else "blocked"
    transaction.is_flagged = False if action == "approve" else True
    transaction.save()

    log_action(
        transaction=transaction,
        user=request.user,
        action=action.upper(),
        details=f"Admin {action}d transaction {transaction.transaction_id}"
    )

    return Response({"message": f"Transaction {action}d successfully."}, status=200)


class FlaggedTransactionsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        flagged = Transaction.objects.filter(is_flagged=True).select_related("employee")
        serializer = TransactionSerializer(flagged, many=True)
        return Response(serializer.data)