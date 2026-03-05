from rest_framework import serializers
from django.contrib.auth.models import User
from transactions.models import Transaction

# Serializer for employee/user info
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

# Serializer for transactions
class TransactionSerializer(serializers.ModelSerializer):
    # Include employee info in output but user cannot modify it
    employee = UserSerializer(read_only=True)

    # System-calculated / read-only fields
    is_flagged = serializers.BooleanField(read_only=True)
    ml_flag = serializers.BooleanField(read_only=True)
    risk_score = serializers.IntegerField(read_only=True)
    fraud_probability = serializers.FloatField(read_only=True)

    # Normalize date output for frontend
    transaction_date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Transaction
        # Fields that will appear in API output
        # Frontend should only allow input for writable fields
        fields = [
            'transaction_id',      # User fills
            'amount',              # User fills
            'currency',            # User fills
            'transaction_type',    # User fills
            'description',         # User fills
            'merchant',            # User fills
            'transaction_date',    # User fills
            'employee',            # System-populated
            'is_flagged',          # System-calculated
            'ml_flag',             # System-calculated
            'risk_score',          # System-calculated
            'fraud_probability',   # System-calculated
        ]

    # Auto-set employee when creating via API
    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["employee"] = request.user
        return super().create(validated_data)