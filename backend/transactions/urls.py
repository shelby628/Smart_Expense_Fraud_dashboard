from django.urls import path
from . import views
from .user_views import MeView
from .views import admin_transactions

urlpatterns = [
    path('upload/', views.upload_transactions, name='upload_transactions'),
    path('manual/', views.manual_transaction, name='manual_transaction'),
    path('', views.list_transactions),
    path('list/', views.list_transactions),
    path('audit-logs/', views.get_audit_logs),
    path("flagged/", views.FlaggedTransactionsView.as_view()),
    path('employees/', views.list_employees, name='list_employees'),
    path("employees/<int:user_id>/update/", views.update_employee),
    path("users/me/", MeView.as_view(), name="me"),
    path('stats/', views.employee_stats, name='employee_stats'),
    path("admin/stats/", views.admin_stats, name="admin_stats"),
    path("admin/employees/", views.get_employees),
    path("admin/employees/<int:user_id>/toggle/", views.toggle_user_status),
    path("admin/", admin_transactions, name='admin-transactions'),
    path("<int:transaction_id>/review/", views.review_transaction, name="review_transaction"), 
]