from django.contrib import admin
from .models import Transaction, Prediction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'amount', 'currency', 'transaction_date', 'is_flagged')
    list_filter = ('transaction_type', 'is_flagged', 'currency')
    search_fields = ('transaction_id', 'merchant', 'description')


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ('transaction', 'fraud_probability', 'final_decision', 'created_at')
    list_filter = ('final_decision',)

from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('transaction', 'performed_by', 'action', 'timestamp')
    list_filter = ('action', 'timestamp')
    search_fields = ('details', 'transaction__transaction_id')
