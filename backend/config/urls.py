from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    # ✅ Health check for Render
    path("", health_check),

    path('admin/', admin.site.urls),
    path('api/core/', include('core.urls')),
    path('api/transactions/', include('transactions.urls')),

    # JWT endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]