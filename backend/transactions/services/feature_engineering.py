import pandas as pd
import numpy as np


def build_features(transactions, encoder, feature_columns):
    """
    Recreates the exact feature engineering steps
    used during model training.
    """

    # ----------------------------------------
    # Convert QuerySet to DataFrame
    # ----------------------------------------
    df = pd.DataFrame(list(transactions.values()))

    if df.empty:
        return None, None

    # ----------------------------------------
    # Convert transaction_date to datetime
    # ----------------------------------------
    df["transaction_date"] = pd.to_datetime(df["transaction_date"])

    # Sort by employee + date (important for time diff)
    df = df.sort_values(["employee", "transaction_date"])

    # ----------------------------------------
    # Feature Engineering
    # ----------------------------------------

    # Days since last transaction
    df["days_since_last_txn"] = (
        df.groupby("employee")["transaction_date"]
        .diff()
        .dt.total_seconds() / (60 * 60 * 24)
    )

    df["days_since_last_txn"] = df["days_since_last_txn"].fillna(999)

    # Hour of transaction
    df["hour"] = df["transaction_date"].dt.hour

    # Day of week
    df["day_of_week"] = df["transaction_date"].dt.dayofweek

    # ----------------------------------------
    # Employee-level features
    # IMPORTANT: In production we approximate
    # using current batch data
    # ----------------------------------------

    employee_avg = df.groupby("employee")["amount"].transform("mean")
    employee_count = df.groupby("employee")["amount"].transform("count")

    df["employee_avg_amount"] = employee_avg
    df["employee_txn_count"] = employee_count

    df["amount_deviation"] = df["amount"] - df["employee_avg_amount"]

    # ----------------------------------------
    # Select Columns
    # ----------------------------------------

    categorical_cols = ["employee", "transaction_type"]

    numeric_cols = [
        "amount",
        "days_since_last_txn",
        "day_of_week",
        "hour",
        "employee_avg_amount",
        "employee_txn_count",
        "amount_deviation"
    ]

    # ----------------------------------------
    # One-hot encode categorical features
    # ----------------------------------------

    encoded = encoder.transform(df[categorical_cols])

    encoded_df = pd.DataFrame(
        encoded,
        columns=encoder.get_feature_names_out(categorical_cols),
        index=df.index
    )

    # ----------------------------------------
    # Combine numeric + encoded
    # ----------------------------------------

    final_df = pd.concat([df[numeric_cols], encoded_df], axis=1)

    # Ensure same column order as training
    final_df = final_df.reindex(columns=feature_columns, fill_value=0)

    return final_df, df
