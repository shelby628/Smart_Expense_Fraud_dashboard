import os
import django
import pandas as pd
import random
from datetime import date, timedelta

# -------------------------
# Setup Django environment
# -------------------------
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # adjust if needed
django.setup()

from django.contrib.auth.models import User
from transactions.models import Transaction
from transactions.services.fraud_rules import evaluate_fraud_rules

# -------------------------
# Simulation parameters
# -------------------------
NUM_TRANSACTIONS = 100
EMPLOYEES = list(User.objects.all())  # all users in the system
START_DATE = date(2025, 1, 1)
END_DATE = date(2025, 1, 31)

# -------------------------
# Generate transactions
# -------------------------
transactions_data = []
txn_counter = 1

for _ in range(NUM_TRANSACTIONS):
    # Pick a random employee
    employee = random.choice(EMPLOYEES)

    # Random transaction date
    transaction_date = START_DATE + timedelta(days=random.randint(0, (END_DATE - START_DATE).days))

    # Random transaction amount
    amount = random.randint(100, 6000)  # some below, some above threshold

    # Random currency and type
    currency = random.choice(["KES", "USD"])
    transaction_type = random.choice(["expense", "sale", "refund"])

    # Random description and merchant
    description = f"Simulated {transaction_type} transaction"
    merchant = random.choice(["Naivas", "Tech World", "Office Depot", "Cafe Express", "Local Shop"])

    # Generate transaction ID, with occasional duplicates
    if random.random() < 0.1 and transactions_data:  # 10% duplicates
        transaction_id = random.choice(transactions_data)["transaction_id"]
    else:
        transaction_id = f"TXN-{txn_counter:04d}"

    # Create the Transaction object in DB
    transaction = Transaction.objects.create(
        transaction_id=transaction_id,
        employee=employee,
        amount=amount,
        currency=currency,
        transaction_type=transaction_type,
        description=description,
        merchant=merchant,
        transaction_date=transaction_date,
        source="simulated",
        is_flagged=False,  # default, will update with rules
        risk_score=0,
        flag_reason=""
    )

    # Apply fraud rules immediately
    fraud_result = evaluate_fraud_rules(transaction)
    transaction.is_flagged = fraud_result["is_flagged"]
    transaction.risk_score = fraud_result["risk_score"]
    transaction.flag_reason = fraud_result["flag_reason"]
    transaction.save()

    # Append to export list
    transactions_data.append({
        "transaction_id": transaction.transaction_id,
        "employee": transaction.employee.username,
        "amount": transaction.amount,
        "currency": transaction.currency,
        "transaction_type": transaction.transaction_type,
        "description": transaction.description,
        "merchant": transaction.merchant,
        "transaction_date": transaction.transaction_date,
        "uploaded_at": transaction.uploaded_at,
        "is_flagged": transaction.is_flagged,
        "risk_score": transaction.risk_score,
        "flag_reason": transaction.flag_reason,
        "source": transaction.source
    })

    txn_counter += 1

# -------------------------
# Convert to pandas DataFrame
# -------------------------
df = pd.DataFrame(transactions_data)

# -------------------------
# Save to CSV
# -------------------------
current_folder = os.path.dirname(os.path.abspath(__file__))
output_folder = os.path.join(current_folder, "exported_csvs")
os.makedirs(output_folder, exist_ok=True)

csv_path = os.path.join(output_folder, "transactions.csv")
df.to_csv(csv_path, index=False)

print(f"✅ Simulated transactions created and exported successfully: {csv_path}")
