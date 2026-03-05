import { useEffect, useState } from "react";
import axios from "axios";

export default function FlaggedTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchFlagged = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await axios.get(
          "http://127.0.0.1:8000/api/transactions/flagged/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching flagged transactions", error);
      }
    };

    fetchFlagged();
  }, []);

  return (
    <div>
      <h2>Flagged Transactions</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Amount</th>
            <th>Merchant</th>
            <th>Date</th>
            <th>Flag Type</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.transaction_id}</td>
              <td>{tx.employee}</td>
              <td>{tx.amount}</td>
              <td>{tx.merchant}</td>
              <td>{tx.transaction_date}</td>
              <td>
                {tx.is_flagged && "Rule Flag"}
                {tx.ml_flag && " ML Flag"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}