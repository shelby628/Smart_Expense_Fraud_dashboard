from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views
from .views import get_current_user
from django.contrib import admin
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', views.test_protected, name='protected'),
    path('admin-only/', views.admin_only_view, name='admin_only'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('user/me/', get_current_user),
]
