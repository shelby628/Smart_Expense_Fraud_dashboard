from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from config.views import cookie_login, cookie_logout, cookie_refresh

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("", health_check),
    path('admin/', admin.site.urls),
    path('api/core/', include('core.urls')),
    path('api/transactions/', include('transactions.urls')),

    # ✅ Cookie-based auth
    path('api/token/', cookie_login, name='token_obtain_pair'),
    path('api/token/refresh/', cookie_refresh, name='token_refresh'),
    path('api/token/logout/', cookie_logout, name='token_logout'),
]