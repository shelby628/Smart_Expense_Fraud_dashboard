from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class AuthTests(APITestCase):
    def setUp(self):
        # Create a standard user
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com'
        }
        self.user = User.objects.create_user(**self.user_data)
        
        # Create an admin user
        self.admin_data = {
            'username': 'adminuser',
            'password': 'adminpassword123',
            'email': 'admin@example.com'
        }
        self.admin_user = User.objects.create_superuser(**self.admin_data)

    def test_registration(self):
        """Test user registration"""
        url = reverse('register')
        data = {
            'username': 'newuser',
            'password': 'newpassword123',
            'email': 'new@example.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_login(self):
        """Test JWT token obtain pair (Login)"""
        url = reverse('token_obtain_pair')
        data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        return response.data['access']

    def test_protected_view(self):
        """Test access to protected view with valid token"""
        # Get token first
        token = self.test_login()
        
        url = reverse('protected')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Hello testuser", response.data['message'])

    def test_protected_view_no_token(self):
        """Test access to protected view without token fails"""
        url = reverse('protected')
        self.client.credentials() # Ensure no credentials
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_only_view_as_admin(self):
        """Test admin-only view access as admin"""
        # Login as admin
        url = reverse('token_obtain_pair')
        data = {
            'username': 'adminuser',
            'password': 'adminpassword123'
        }
        response = self.client.post(url, data, format='json')
        token = response.data['access']
        
        url = reverse('admin_only')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_only_view_as_normal_user(self):
        """Test admin-only view access as normal user fails"""
        # Login as normal user
        token = self.test_login()
        
        url = reverse('admin_only')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
