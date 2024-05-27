# utils.py
import secrets
from .models import CustomToken

# def generate_token(user):
#     key = secrets.token_urlsafe(40)  # Generate a random token
#     return CustomToken.objects.create(key=key, user=user)

from datetime import timedelta
from django.utils import timezone

def generate_token(user):
    """
    Function to generate a new token for the given user.
    """
    current_time = timezone.now()
    expiration_time = current_time + timedelta(days=1)  # Set expiration time (e.g., 1 day)
    token = CustomToken.objects.create(
        key=secrets.token_urlsafe(40),  # You need to implement generate_random_token() function
        user=user,
        created_at=current_time,
        expiration_time=expiration_time
    )
    token.disable_other_tokens()  # Disable other tokens for the same user
    return token