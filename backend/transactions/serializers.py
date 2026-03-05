from rest_framework import serializers
from transactions.models import Transaction
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class TransactionSerializer(serializers.ModelSerializer):
    employee = UserSerializer(read_only=True)
    status = serializers.SerializerMethodField()
    fraud_probability_percent = serializers.SerializerMethodField()  # ✅ human readable

    class Meta:
        model = Transaction
        fields = [
            'id',
            'transaction_id',
            'employee',
            'amount',
            'currency',
            'transaction_type',
            'description',
            'merchant',
            'transaction_date',
            'risk_score',           # rule-based score (0-100)
            'fraud_probability',    # ML score (0-1)
            'fraud_probability_percent',  # ML score as % for display
            'final_risk_score',     # combined score (0-100)
            'ml_flag',
            'flag_reason',
            'status',
            'admin_review_status',
        ]

    def get_status(self, obj):
        if obj.admin_review_status == "approved":
            return "Approved"
        elif obj.admin_review_status == "blocked":
            return "Blocked"
        elif obj.is_flagged:
            return "Flagged"
        return "Normal"

    def get_fraud_probability_percent(self, obj):
        # Converts 0.82 → "82%" for easy frontend display
        if obj.fraud_probability is None:
            return "N/A"
        return f"{round(obj.fraud_probability * 100, 1)}%"

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["employee"] = request.user
        return super().create(validated_data)