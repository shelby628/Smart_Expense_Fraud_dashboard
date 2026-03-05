from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from transactions.models import Transaction
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = "Generate simulated transactions for ML training"

    def handle(self, *args, **kwargs):
        users = User.objects.all()

        if not users.exists():
            self.stdout.write(self.style.ERROR("❌ No users found. Create users first."))
            return

        txn_counter = Transaction.objects.count() + 1
        start_date = date(2025, 1, 1)

        for user in users:
            for _ in range(50):  # 50 transactions per user
                txn_date = start_date + timedelta(days=random.randint(0, 60))
                amount = random.randint(100, 5000)
                txn_type = random.choice(["expense", "sale", "refund"])

                txn = Transaction.objects.create(
                    transaction_id=f"TXN-{txn_counter:05d}",
                    employee=user,
                    amount=amount,
                    currency="KES",
                    transaction_type=txn_type,
                    description=f"Simulated {txn_type} transaction",
                    merchant=f"Merchant-{random.randint(1, 20)}",
                    transaction_date=txn_date,
                    source="manual",
                )

                # Set fraud fields AFTER creation (safe)
                txn.is_flagged = False
                txn.risk_score = 0
                txn.flag_reason = ""
                txn.save()

                txn_counter += 1

        self.stdout.write(self.style.SUCCESS("✅ Simulated transactions created successfully"))
