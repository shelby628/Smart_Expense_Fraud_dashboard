import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-expense-fraud-dashboard.onrender.com/api/",
  withCredentials: true, // ✅ sends cookies automatically
});

export default API;