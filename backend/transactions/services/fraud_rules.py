from ..models import Transaction
from datetime import timedelta

# ---------- Duplicate detection ----------
def check_duplicate(transaction_id):
    """
    Flags transactions with the same transaction_id.
    """
    is_flagged = False
    risk_score = 0
    flag_reason = ""

    if Transaction.objects.filter(transaction_id=transaction_id).exists():
        is_flagged = True
        risk_score = 40
        flag_reason = f"Duplicate transaction_id '{transaction_id}' detected"

    return {
        "is_flagged": is_flagged,
        "risk_score": risk_score,
        "flag_reason": flag_reason
    }

BLACKLIST_VENDORS = ["BadVendor Inc", "Fraudulent Co", "Suspicious Shop"]

def check_time_based_duplicate(transaction):
    """Flags transactions with same amount/merchant within 5 mins."""
    five_mins_ago = transaction.uploaded_at - timedelta(minutes=5)
    duplicates = Transaction.objects.filter(
        employee=transaction.employee,
        merchant=transaction.merchant,
        amount=transaction.amount,
        uploaded_at__gte=five_mins_ago
    ).exclude(id=transaction.id)
    
    if duplicates.exists():
        return {"is_flagged": True, "risk_score": 50, "flag_reason": "Duplicate transaction within 5 minutes"}
    return {"is_flagged": False, "risk_score": 0, "flag_reason": ""}

def check_blacklist(merchant):
    """Flags merchants in the blacklist."""
    if merchant in BLACKLIST_VENDORS:
        return {"is_flagged": True, "risk_score": 100, "flag_reason": f"Vendor '{merchant}' is in blacklist"}
    return {"is_flagged": False, "risk_score": 0, "flag_reason": ""}

def check_amount_threshold(amount, threshold=10000):
    """Flags transactions above 10,000."""
    if amount > threshold:
        return {"is_flagged": True, "risk_score": 30, "flag_reason": f"Amount {amount} exceeds threshold {threshold}"}
    return {"is_flagged": False, "risk_score": 0, "flag_reason": ""}

def evaluate_fraud_rules(transaction):
    total_risk = 0
    reasons = []

    # 1. Amount threshold (> 10,000)
    amount_res = check_amount_threshold(transaction.amount)
    if amount_res["is_flagged"]:
        total_risk += amount_res["risk_score"]
        reasons.append(amount_res["flag_reason"])

    # 2. Blacklist check
    blacklist_res = check_blacklist(transaction.merchant)
    if blacklist_res["is_flagged"]:
        total_risk += blacklist_res["risk_score"]
        reasons.append(blacklist_res["flag_reason"])

    # 3. Time-based duplicate (within 5 mins)
    dup_res = check_time_based_duplicate(transaction)
    if dup_res["is_flagged"]:
        total_risk += dup_res["risk_score"]
        reasons.append(dup_res["flag_reason"])

    is_flagged = total_risk > 0
    flag_reason = "; ".join(reasons) if reasons else ""

    return {
        "is_flagged": is_flagged,
        "risk_score": min(total_risk, 100),
        "flag_reason": flag_reason
    }
