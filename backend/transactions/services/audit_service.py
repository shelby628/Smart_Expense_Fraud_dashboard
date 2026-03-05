from transactions.models import AuditLog

def log_action(transaction=None, user=None, action="", details=""):
    """
    Create an audit log entry.
    """
    AuditLog.objects.create(
        transaction=transaction,
        performed_by=user,
        action=action,
        details=details
    )
