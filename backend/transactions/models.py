from django.db import models
from django.contrib.auth.models import User


class Transaction(models.Model):
    # ───────────────
    # IDENTITY & TRACEABILITY
    # ───────────────
    transaction_id = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        help_text="Unique reference from source system or CSV"
    )

    employee = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="logged_transactions",
        help_text="Employee who logged or uploaded this transaction"
    )

    # ───────────────
    # FINANCIAL CORE
    # ───────────────
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    currency = models.CharField(
        max_length=10,
        default="KES"
    )

    transaction_type = models.CharField(
        max_length=20,
        choices=[
            ("expense", "Expense"),
            ("sale", "Sale"),
            ("refund", "Refund"),
        ]
    )

    # ───────────────
    # CONTEXT (WHERE FRAUD HIDES)
    # ───────────────
    description = models.TextField()

    merchant = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    # ───────────────
    # TIME & BEHAVIOR
    # ───────────────
    transaction_date = models.DateTimeField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # ───────────────
    # SYSTEM FLAGS
    # ───────────────
    is_flagged = models.BooleanField(default=False)
    risk_score = models.IntegerField(default=0)
    fraud_probability = models.FloatField(null=True, blank=True)
    ml_flag = models.IntegerField(default=0)
    final_risk_score = models.FloatField(null=True, blank=True)
    final_flag = models.IntegerField(default=0)


    flag_reason = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Why this transaction was flagged"
    )
    admin_review_status = models.CharField(
    max_length=20,
    choices=[
        ("pending", "Pending Review"),
        ("approved", "Approved"),
        ("blocked", "Blocked"),
    ],
    default="pending",
)

    admin_review_reason = models.TextField(
    blank=True,
    null=True,
    help_text="Reason provided by admin when blocking"
)

    # ───────────────
    # AUDITABILITY
    # ───────────────
    source = models.CharField(
        max_length=50,
        choices=[
            ("csv", "CSV Upload"),
            ("api", "API"),
            ("manual", "Manual Entry"),
        ],
        default="csv"
    )

    class Meta:
        ordering = ["-uploaded_at"]
        indexes = [
            models.Index(fields=["employee", "transaction_date"]),
        ]

    def __str__(self):
        return f"{self.transaction_id} - {self.amount} {self.currency}"


class Prediction(models.Model):
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.CASCADE,
        related_name="prediction"
    )

    fraud_probability = models.FloatField(
        help_text="Value between 0 and 1"
    )

    final_decision = models.CharField(
        max_length=20,
        choices=[
            ("approve", "Approve"),
            ("review", "Needs Review"),
            ("block", "Block"),
        ]
    )

    model_version = models.IntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prediction for {self.transaction.transaction_id}"


class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('ML_SCORE', 'ML Scoring'),
        ('RULE_APPLY', 'Rule Apply'),
    ]

    transaction = models.ForeignKey(
        'Transaction', on_delete=models.CASCADE, null=True, blank=True
    )
    performed_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, related_name='transactions_auditlogs'
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)  # optional JSON/details

    def __str__(self):
        return f"{self.action} by {self.performed_by} on {self.timestamp}"
