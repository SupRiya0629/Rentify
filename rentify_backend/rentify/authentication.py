# authentication/authentication.py
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomToken

class CustomTokenAuthentication(TokenAuthentication):
    keyword = 'Bearer'

    def authenticate_credentials(self, key):
        try:
            token = CustomToken.objects.select_related('user').get(key=key)
        except CustomToken.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

        if not token.user.is_active:
            raise AuthenticationFailed('User inactive or deleted')

        return (token.user, token)
