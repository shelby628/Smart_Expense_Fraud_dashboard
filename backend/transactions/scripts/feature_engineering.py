import random
import os
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

# -------------------------
# Configuration
# -------------------------
NUM_TRANSACTIONS = 600
NUM_EMPLOYEES = 8

employees = [f"employee_{i}" for i in range(1, NUM_EMPLOYEES + 1)]

transaction_types = ["expense", "sale", "refund"]
merchants = [
    "Office Depot", "Tech World", "Fuel Station", "Cafe Express",
    "Online Store", "Local Supplier", "Client A", "Client B"
]

descriptions = [
    "Office supplies purchase",
    "Client payment",
    "Refund processed",
    "Fuel reimbursement",
    "Urgent procurement",
    "Monthly operational cost",
    "Ad-hoc expense"
]

start_date = datetime(2025, 1, 1)
end_date = datetime(2025, 3, 31)

# Employees have different spending behavior (important)
employee_amount_profiles = {
    emp: {
        "mean": random.randint(300, 1500),
        "std": random.randint(100, 600)
    }
    for emp in employees
}

# -------------------------
# Helper functions
# -------------------------
def random_datetime():
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    random_hours = random.choice(
        list(range(8, 19)) +  # business hours
        list(range(0, 6))     # odd hours (risk signal)
    )
    return start_date + timedelta(days=random_days, hours=random_hours)

def generate_amount(emp):
    profile = employee_amount_profiles[emp]
    amount = abs(np.random.normal(profile["mean"], profile["std"]))

    # Inject rare high-risk amounts
    if random.random() < 0.04:  # ~4% very high amounts
        amount *= random.randint(4, 10)

    return round(amount, 2)

# -------------------------
# Generate transactions
# -------------------------
data = []

for i in range(NUM_TRANSACTIONS):
    employee = random.choices(
        employees,
        weights=[random.randint(1, 5) for _ in employees]  # uneven workload
    )[0]

    txn_type = random.choice(transaction_types)
    merchant = random.choice(merchants)
    description = random.choice(descriptions)

    amount = generate_amount(employee)
    txn_date = random_datetime()

    # -------------------------
    # Fraud rules (for labels)
    # -------------------------
    risk_score = 0
    is_flagged = 0

    # Rule 1: High amount
    if amount > 4000:
        risk_score += 40

    # Rule 2: Odd hour transaction
    if txn_date.hour < 6:
        risk_score += 20

    # Rule 3: Random burst / anomaly
    if random.random() < 0.05:
        risk_score += 30

    # Rule 4: Refunds slightly riskier
    if txn_type == "refund" and amount > 2000:
        risk_score += 20

    # Final flag decision
    if risk_score >= 40:
        is_flagged = 1

    data.append({
        "transaction_id": f"TXN-{i+1:05d}",
        "employee": employee,
        "amount": amount,
        "currency": "KES",
        "transaction_type": txn_type,
        "merchant": merchant,
        "description": description,
        "transaction_date": txn_date,
        "uploaded_at": datetime.now(),
        "risk_score": risk_score,
        "is_flagged": is_flagged,
        "source": "simulated"
    })

# -------------------------
# Save to CSV
# -------------------------
df = pd.DataFrame(data)

output_dir = "exported_csvs"
os.makedirs(output_dir, exist_ok=True)

output_path = os.path.join(output_dir, "simulated_transactions_realistic.csv")
df.to_csv(output_path, index=False)

print(f"✅ Created realistic simulated dataset with {len(df)} rows")
print(f"📁 Saved to: {output_path}")
