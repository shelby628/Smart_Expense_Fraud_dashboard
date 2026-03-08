# SmartExpense — Fraud Detection System

SmartExpense is a full-stack web application that allows employees to submit transactions and automatically flags suspicious activity using machine learning and rule-based risk scoring.
<br>
🔗 **Live Demo:** [smart-expense-fraud-dashboard.vercel.app](https://smart-expense-fraud-dashboard.vercel.app/)


---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Django + Django REST Framework |
| Authentication | Djoser + Token Auth |
| ML / Fraud Detection | Scikit-learn (custom model) |
| Database | SQLite (dev) / PostgreSQL (prod) |

---
<img width="893" height="425" alt="image" src="https://github.com/user-attachments/assets/4da9451b-7d62-420c-aed0-47184710610e" />

<img width="876" height="432" alt="image" src="https://github.com/user-attachments/assets/05bfc67e-eb64-490b-b0df-0cde011c786b" />

<img width="908" height="397" alt="image" src="https://github.com/user-attachments/assets/996822c8-ba7f-4744-b7e1-266d5c771f0b" />




## Project Overview

SmartExpense provides two separate portals — one for employees and one for admins — to manage, review, and monitor financial transactions within an organisation.

When a transaction is submitted (manually or via CSV), the system runs it through a machine learning model and a set of rule-based checks to compute a **risk score**. Transactions that exceed the risk threshold are automatically flagged for admin review.

---

## Features

- **Employee Portal** — Submit transactions manually or upload a CSV file in bulk
- **Admin Portal** — View all transactions, manage employee accounts, and review audit logs
- **Manual Transaction Entry** — Enter amount, currency, type, merchant, and date
- **CSV Bulk Upload** — Upload multiple transactions at once via a structured CSV file
- **ML-Based Fraud Flagging** — Each transaction is scored by a trained machine learning model
- **Risk Scoring** — Every transaction receives a final risk score used to determine its status
- **Audit Logs** — Track all system actions for accountability and review
- **Role-Based Access** — Employees and admins have separate dashboards and permissions

---

## Project Structure

```
smartexpense/
├── frontend/          # React app
│   ├── src/
│   │   ├── pages/     # Manual.jsx, Upload.jsx, EmployeeDashboard.jsx, AdminDashboard.jsx
│   │   ├── api.js     # Axios instance
│   │   └── App.jsx    # Routes
├── backend/           # Django project
│   ├── transactions/  # Models, views, serializers, ML logic
│   ├── token/         # Auth endpoints
│   └── settings.py
└── README.md
```

---

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Roles

| Role | Access |
|------|--------|
| Employee | Submit transactions, view own history and stats |
| Admin | View all transactions, manage employees, view audit logs |

---

## Author

Built by me as a solo developer as a full-stack fraud detection project combining React, Django, and machine learning.
