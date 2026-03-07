from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import json

@csrf_exempt
@require_POST
def cookie_login(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    if not user.is_active:
        return JsonResponse({"error": "Account is disabled"}, status=403)

    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    response = JsonResponse({"success": True})
    response.set_cookie(
        "access", access,
        httponly=True, secure=True,
        samesite="None", max_age=60 * 60,
    )
    response.set_cookie(
        "refresh", str(refresh),
        httponly=True, secure=True,
        samesite="None", max_age=60 * 60 * 24 * 7,
    )
    return response


@csrf_exempt
@require_POST
def cookie_logout(request):
    response = JsonResponse({"success": True})
    response.delete_cookie("access", samesite="None")
    response.delete_cookie("refresh", samesite="None")
    return response


@csrf_exempt
@require_POST
def cookie_refresh(request):
    refresh_token = request.COOKIES.get("refresh")
    if not refresh_token:
        return JsonResponse({"error": "No refresh token"}, status=401)
    try:
        refresh = RefreshToken(refresh_token)
        access = str(refresh.access_token)
        response = JsonResponse({"success": True})
        response.set_cookie(
            "access", access,
            httponly=True, secure=True,
            samesite="None", max_age=60 * 60,
        )
        return response
    except Exception:
        return JsonResponse({"error": "Invalid refresh token"}, status=401)