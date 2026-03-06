import joblib
import numpy as np
from transactions.models import Transaction
from django.db.models import Avg, Count
from django.utils import timezone
import pandas as pd
from transactions.services.audit_service import log_action

# -------------------------------
# Model paths
# -------------------------------
MODEL_PATH = "transactions/ml/model.pkl"
ENCODER_PATH = "transactions/ml/encoder.pkl"
FEATURE_COLUMNS_PATH = "transactions/ml/feature_columns.pkl"

# -------------------------------
# Lazy loading — models start as None
# and only load when first needed
# -------------------------------
MODEL = None
ENCODER = None
FEATURE_COLUMNS = None

def load_models():
    global MODEL, ENCODER, FEATURE_COLUMNS
    if MODEL is None:
        MODEL = joblib.load(MODEL_PATH)
        ENCODER = joblib.load(ENCODER_PATH)
        FEATURE_COLUMNS = joblib.load(FEATURE_COLUMNS_PATH)


# -------------------------------
# Build features dynamically
# -------------------------------
def build_features(transactions):
    load_models()  # ✅ load only when needed
    rows = []
    for txn in transactions:
        txn_dt = txn.transaction_date
        if not isinstance(txn_dt, pd.Timestamp):
            txn_dt = pd.to_datetime(txn_dt)
        if timezone.is_aware(txn_dt):
            txn_dt = timezone.make_naive(txn_dt)

        hour = txn_dt.hour if hasattr(txn_dt, "hour") else 0
        day_of_week = txn_dt.weekday() if hasattr(txn_dt, "weekday") else 0

        employee_qs = Transaction.objects.filter(employee=txn.employee)

        previous_txn = employee_qs.filter(
            transaction_date__lt=txn.transaction_date
        ).order_by("-transaction_date").first()

        if previous_txn:
            prev_dt = previous_txn.transaction_date
            if not isinstance(prev_dt, pd.Timestamp):
                prev_dt = pd.to_datetime(prev_dt)
            if timezone.is_aware(prev_dt):
                prev_dt = timezone.make_naive(prev_dt)
            days_since = (txn_dt - prev_dt).total_seconds() / (24 * 3600)
        else:
            days_since = 999

        stats = employee_qs.aggregate(avg_amount=Avg("amount"), count=Count("id"))
        employee_avg_amount = float(stats['avg_amount'] or 0)
        employee_txn_count = stats['count'] or 0
        current_amount = float(txn.amount)
        amount_deviation = current_amount - employee_avg_amount

        rows.append({
            "amount": current_amount,
            "days_since_last_txn": float(days_since),
            "hour": hour,
            "day_of_week": day_of_week,
            "employee_avg_amount": employee_avg_amount,
            "employee_txn_count": employee_txn_count,
            "amount_deviation": amount_deviation,
            "employee": f"employee_{txn.employee.id}",
            "transaction_type": str(txn.transaction_type),
        })

    df = pd.DataFrame(rows)
    categorical_cols = ["employee", "transaction_type"]
    X_encoded = pd.DataFrame(
        ENCODER.transform(df[categorical_cols]),
        columns=ENCODER.get_feature_names_out(categorical_cols),
        index=df.index
    )
    numeric_cols = [
        "amount", "days_since_last_txn", "hour", "day_of_week",
        "employee_avg_amount", "employee_txn_count", "amount_deviation"
    ]
    X = pd.concat([df[numeric_cols], X_encoded], axis=1)
    X = X[FEATURE_COLUMNS]
    return X, df


# -------------------------------
# Score multiple transactions
# -------------------------------
def score_transactions(transactions):
    load_models()  # ✅ load only when needed
    if not transactions.exists():
        return
    X, _ = build_features(transactions)
    predictions = MODEL.predict(X)
    threshold = np.percentile(predictions, 90)
    for txn, score in zip(transactions, predictions):
        txn.fraud_probability = min(float(score) / 100.0, 1.0)
        txn.ml_flag = 1 if txn.fraud_probability >= 0.5 else 0
        txn.save()


# -------------------------------
# Score a single transaction
# -------------------------------
def score_single_transaction(transaction):
    load_models()  # ✅ load only when needed
    X, _ = build_features([transaction])
    raw_score = MODEL.predict(X)[0]

    fraud_probability = min(float(raw_score) / 100.0, 1.0)
    ml_flag = 1 if fraud_probability >= 0.5 else 0

    log_action(
        transaction=transaction,
        user=None,
        action="ML_SCORE",
        details=f"fraud_probability={fraud_probability}, ml_flag={ml_flag}"
    )

    return {
        "fraud_probability": fraud_probability,
        "ml_flag": ml_flag
    }