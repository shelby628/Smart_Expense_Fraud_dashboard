# transactions/pipeline/rules.py

from django.utils import timezone
from django.db.models import Count
from datetime import timedelta
from transactions.models import Transaction

# Business thresholds (you can move to settings.py later)
HIGH_AMOUNT_THRESHOLD = 10000
FREQUENCY_WINDOW_HOURS = 24
FREQUENCY_LIMIT = 5
RULE_THRESHOLD = 50


def check_high_amount(transaction):
    if transaction.amount >= HIGH_AMOUNT_THRESHOLD:
        return 60, "High transaction amount"
    return 0, None


def check_duplicate(transaction):
    duplicates = Transaction.objects.filter(
        employee=transaction.employee,
        amount=transaction.amount,
        transaction_date=transaction.transaction_date
    ).exclude(id=transaction.id)

    if duplicates.exists():
        return 70, "Duplicate transaction detected"
    return 0, None


def check_frequency_spike(transaction):
    time_window_start = transaction.transaction_date - timedelta(hours=FREQUENCY_WINDOW_HOURS)

    count = Transaction.objects.filter(
        employee=transaction.employee,
        transaction_date__gte=time_window_start,
        transaction_date__lte=transaction.transaction_date
    ).count()

    if count >= FREQUENCY_LIMIT:
        return 50, "High transaction frequency"
    return 0, None


def apply_rules(transaction):
    """
    Applies all rule checks and updates the transaction.
    """

    total_risk = 0
    reasons = []

    # Run individual checks
    for check in [check_high_amount, check_duplicate, check_frequency_spike]:
        risk, reason = check(transaction)
        total_risk += risk
        if reason:
            reasons.append(reason)

    # Cap risk score at 100
    total_risk = min(total_risk, 100)

    transaction.rule_risk_score = total_risk
    transaction.rule_flag = 1 if total_risk >= RULE_THRESHOLD else 0
    transaction.flag_reason = ", ".join(reasons) if reasons else "No rule triggered"

    transaction.save()
