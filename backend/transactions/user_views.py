# transactions/user_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return info about the logged-in user
        """
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "is_admin": request.user.is_staff,
        })