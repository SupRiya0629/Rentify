import json
from urllib import request
from django.db import transaction
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserManagementSerializer, UserDetailsSerializer, UserRatingsSerializer, UserSkillsSerializer
from django.http import JsonResponse
from django.views import View
from .models import PasswordReset, UserManagement
from .models import Token
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
class UserRegistrationView(APIView):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                # Step 1: Create UserManagement
                
                user_management_serializer = UserManagementSerializer(data=request.data['userManagement'])
                user_management_serializer.is_valid(raise_exception=True)
                user_management_instance = user_management_serializer.save()
  
                # Step 2: Use the obtained userManagementId to create UserDetails
                userDetailsData = {
                    "name": request.data['userDetails']['name'],
                    "gender": request.data['userDetails']['gender'],
                    "phone": request.data['userDetails']['phone'],
                    "email": request.data['userDetails']['email'],
                    "address": request.data['userDetails']['address'],
                    "user_management": user_management_instance.user_id,
                }
                user_details_serializer = UserDetailsSerializer(data=userDetailsData)
                user_details_serializer.is_valid(raise_exception=True)
                user_details_serializer.save()

                # Step 3: Use the obtained userManagementId to create UserSkills
                userSkillsData = {
                    "skill_category": request.data['userSkills']['skill_category'],
                    "job_details": request.data['userSkills']['job_details'],
                    "has_work_experience": request.data['userSkills']['has_work_experience'],
                    "workplace": request.data['userSkills']['workplace'],
                    "position": request.data['userSkills']['position'],
                    "duration": request.data['userSkills']['duration'],
                    "user_management": user_management_instance.user_id,
                }
                user_skills_serializer = UserSkillsSerializer(data=userSkillsData)
                user_skills_serializer.is_valid(raise_exception=True)
                user_skills_serializer.save()

            return Response({"message": "Data sent successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle the exception and return an appropriate response
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class CheckUsernameAvailabilityView(View):
    def get(self, request, *args, **kwargs):
        username = self.request.GET.get('username', '')
        if not username:
            return JsonResponse({'error': 'Username parameter is missing'}, status=400)

        try:
            user = UserManagement.objects.get(username=username)
            return JsonResponse({'available': False})
        except UserManagement.DoesNotExist:
            return JsonResponse({'available': True})

class UserManagementBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = UserManagement.objects.get(username=username)
            if user.check_password(password):
                return user
        except UserManagement.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return UserManagement.objects.get(pk=user_id)
        except UserManagement.DoesNotExist:
            return None
            
# class LoginView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         user = authenticate(request, username=username, password=password)

#         if user is not None:
#             # Valid credentials, create or retrieve token
#             token, created = Token.objects.get_or_create(user_management=user)
#             print(token)
#             return Response({'token': token.key}, status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        

from django.utils import timezone
from rest_framework.authtoken.models import Token

# class LoginView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')

#         # Perform authentication
#         user = UserManagement.objects.get(username=username)
#         if user.check_password(password):
#             # Update last_login manually
#             user.last_login = timezone.now()
#             user.save()

#             # Generate or retrieve authentication token
#             token, created = Token.objects.get_or_create(user=user)

#             # Return success response with token
#             return Response({'token': token.key, 'user_id': user.pk}, status=status.HTTP_200_OK)
#         else:
#             # Return error response
#             return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomToken
from .utils import generate_token
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = UserManagement.objects.get(username=username)
            if check_password(password,user.password):
                token = generate_token(user)
                return Response({'token': token.key, 'user_id': user.pk}, status=200)
            else:
                return Response({'error': 'Invalid username or password'}, status=401)
        except UserManagement.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=404)

# views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .authentication import CustomTokenAuthentication

class MyProtectedView(APIView):
    authentication_classes = [CustomTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'You are authenticated'}, status=200)


from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CustomToken

# class ValidateTokenView(APIView):
#     def post(self, request):
#         token = request.data.get('token')
#         user_id = request.data.get('user_id')

#         try:
#             custom_token = CustomToken.objects.get(key=token, user_id=user_id)
#             # Token and user ID match, token is valid
#             return Response({'message': 'Token validated successfully'}, status=200)
#         except CustomToken.DoesNotExist:
#             # Token not found or user ID doesn't match, token is invalid
#             return Response({'error': 'Invalid token'}, status=401)

from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomToken

class ValidateTokenView(APIView):
    def post(self, request):
        token = request.data.get('token')
        user_id = request.data.get('user_id')

        try:
            custom_token = CustomToken.objects.get(key=token, user_id=user_id)
            
            # Check if the token has expired
            if custom_token.expiration_time < timezone.now():
                # Token is expired
                return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Token and user ID match, and token is not expired, token is valid
            return Response({'message': 'Token validated successfully'}, status=status.HTTP_200_OK)
        
        except CustomToken.DoesNotExist:
            # Token not found, token is invalid
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

# from django.contrib.auth import logout
# from django.shortcuts import redirect
# def logout_view(request):
#     # Logout the user (invalidate the session)
#     logout(request)
#     # Redirect the user to the login page or any other desired destination
#     return redirect('login')

# from django.views.decorators.csrf import ensure_csrf_cookie
# from django.http import JsonResponse
# from django.middleware.csrf import get_token

# @ensure_csrf_cookie
# def get_csrf_token(request):
#     """
#     View function to return the CSRF token.
#     """
#     csrf_token = get_token(request)
#     return JsonResponse({'csrfToken': csrf_token})

from django.http import JsonResponse
from .models import UserManagement, UserDetails
import random
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.template.loader import render_to_string
from datetime import datetime, timedelta
from django.utils import timezone
from .models import PasswordReset

@csrf_exempt
def forgot_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        try:
            user = UserManagement.objects.get(username=username)
            user_details = UserDetails.objects.get(user_management_id=user.user_id)
            email = user_details.email
            
            # Generate OTP
            otp = ''.join(random.choices('0123456789', k=6))
            
            # Get or create PasswordReset object
            password_reset, created = PasswordReset.objects.get_or_create(user=user)
            
            # Update the existing PasswordReset object
            password_reset.otp = otp
            password_reset.expiration_time = timezone.now() + timezone.timedelta(minutes=15)
            password_reset.save()

            # Send OTP to email
            subject = 'OTP for Password Reset in SkillMarket'
            message = "Hi, "+username+"\nYour One Time Password is : " + otp
            from_email = 'harikairuvuru123@gmail.com' 
            to_email = [email]
            send_mail(subject, message, from_email, to_email)

            return JsonResponse({'success': True, 'message': 'OTP sent to your email'})
        except UserManagement.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Username does not exist'})
        except UserDetails.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'No user details found'})

    return JsonResponse({'success': False, 'error': 'Invalid method'})

from django.contrib.auth.models import User
from django.utils import timezone
from django.http import JsonResponse
from .models import UserManagement
from .models import PasswordReset
import json

@csrf_exempt
def verify_otp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        otp = data.get('otp')

        try:
            # Retrieve the User object based on username
            user = UserManagement.objects.get(username=username)
            # Fetch the PasswordReset object for the user_id
            password_reset = PasswordReset.objects.get(user_id=user.user_id)

            # Check if OTP is valid and not expired
            if password_reset.otp == otp and password_reset.expiration_time > timezone.now():
                return JsonResponse({'success': True, 'message': 'OTP verification successful'})
            else:
                return JsonResponse({'success': False, 'error': 'Invalid OTP or OTP expired'})
            
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Username does not exist'})
        except PasswordReset.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'No password reset request found for the user'})

    return JsonResponse({'success': False, 'error': 'Invalid method'})

from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from .models import UserManagement
import json

@csrf_exempt
def change_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        new_password = data.get('newPassword')

        try:
            user = UserManagement.objects.get(username=username)

            # Check if the new password is the same as the current password
            if user.check_password(new_password):
                return JsonResponse({'success': False, 'error': 'New password cannot be the same as the previous password'})

            # Hash the new password using PBKDF2 and Update user's password
            user.password = make_password(new_password)
            user.save()

            return JsonResponse({'success': True, 'message': 'Password changed successfully'})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Username does not exist'})

    return JsonResponse({'success': False, 'error': 'Invalid method'})


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserDetails, UserSkills1
from .serializers import UserDetailsSerializer, UserSkillsSerializer1

class UserProfileAPIView(APIView):
    def get(self, request, user_id):
        try:
            user_details = UserDetails.objects.get(user_management_id=user_id)
            user_skills = UserSkills1.objects.filter(user_management_id=user_id)

            # Serialize user details and skills
            user_details_serializer = UserDetailsSerializer(user_details)
            user_skills_serializer = UserSkillsSerializer1(user_skills, many=True)

            # Combine user details and skills data into a single JSON response
            profile_data = {
                'user_details': user_details_serializer.data,
                'user_skills': user_skills_serializer.data
            }

            return Response(profile_data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({'error': 'User details not found'}, status=status.HTTP_404_NOT_FOUND)
        except UserSkills1.DoesNotExist:
            return Response({'error': 'User skills not found'}, status=status.HTTP_404_NOT_FOUND)


import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from .serializers import JobPostForm  # Assuming JobPostSerializer is your serializer
from django.conf import settings


@csrf_exempt
def create_job(request):
    print("MEDIA_ROOT:", settings.MEDIA_ROOT)

    if request.method == 'POST':
        data = json.loads(request.body)  # Parse JSON data from request body
        data['user_management'] = data.pop('user_id')  # Rename user_id to user_management
        serializer = JobPostForm(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)


# from django.http import JsonResponse
# from .models import Job
# from .serializers import JobSerializer

# def show_all_jobs(request):
#     # Retrieve all jobs from the database
#     jobs = Job.objects.all()

#     # Serialize the queryset
#     serializer = JobSerializer(jobs, many=True)

#     # Return the serialized data as JSON response
#     return JsonResponse(serializer.data, safe=False)

from django.http import JsonResponse
from django.utils import timezone
from .models import Job
from .serializers import JobSerializer

def show_all_jobs(request):
    # Retrieve all jobs with deadlines greater than the current date
    current_date = timezone.now().date()
    jobs = Job.objects.filter(due_date__gt=current_date)

    # Serialize the queryset
    serializer = JobSerializer(jobs, many=True)

    # Return the serialized data as JSON response
    return JsonResponse(serializer.data, safe=False)


from django.http import JsonResponse
from .models import Job
from .serializers import JobSerializer

def count_jobs(request):
    # Retrieve all jobs from the database
    jobs = Job.objects.all()

    # Serialize the queryset
    serializer = JobSerializer(jobs, many=True)

    # Get the count of all jobs
    job_count = jobs.count()

    # Return the serialized data and the count as JSON response
    return JsonResponse(job_count,safe=False)

from django.http import JsonResponse
from .models import Job
from .serializers import JobSerializer

def jobsPostedByUser(request):
    # Get the user_management_id from the request GET parameters
    user_management_id = request.GET.get('user_management_id')

    # Check if user_management_id is provided
    if user_management_id is None:
        return JsonResponse({'error': 'user_management_id parameter is required'}, status=400)

    try:
        # Convert user_management_id to integer
        user_management_id = int(user_management_id)
    except ValueError:
        return JsonResponse({'error': 'user_management_id must be an integer'}, status=400)

    # Filter jobs based on user_management_id
    jobs = Job.objects.filter(user_management_id=user_management_id)

    # Serialize the queryset
    serializer = JobSerializer(jobs, many=True)

    # Get the count of filtered jobs
    job_count = jobs.count()

    # Return the count and serialized data as JSON response
    return JsonResponse({'job_count': job_count, "jobs": serializer.data})


from django.http import JsonResponse
from .models import Job
from .serializers import JobSerializer

def get_job_details(request):
    job_id = request.GET.get('job_id')

    # Check if job_id is provided
    if job_id is None:
        return JsonResponse({'error': 'job_id parameter is required'}, status=400)

    try:
        job_id = int(job_id)
    except ValueError:
        return JsonResponse({'error': 'job_id must be an integer'}, status=400)

    try:
        job = Job.objects.get(job_id=job_id)
    except Job.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)

    serializer = JobSerializer(job)
    return JsonResponse(serializer.data)


from django.http import JsonResponse
from .models import Job

def delete_job(request):
    # Get the job_id from the request GET parameters
    job_id = request.GET.get('job_id')

    # Check if job_id is provided
    if job_id is None:
        return JsonResponse({'error': 'job_id parameter is required'}, status=400)

    try:
        # Convert job_id to integer
        job_id = int(job_id)
    except ValueError:
        return JsonResponse({'error': 'job_id must be an integer'}, status=400)

    try:
        # Retrieve the job with the provided job_id
        job = Job.objects.get(job_id=job_id)
    except Job.DoesNotExist:
        # If the job does not exist, return a 404 Not Found response
        return JsonResponse({'error': 'Job not found'}, status=404)

    # Delete the job
    job.delete()

    # Return a success message
    return JsonResponse({'message': 'Job deleted successfully'})

# views.py
from django.http import JsonResponse
from .models import AppliedJob
@csrf_exempt
def apply_job(request):
    if request.method == 'POST':
        # Extract data from the request body
        data = json.loads(request.body)
        user_id = data.get('user_id')
        job_id = data.get('job_id')
        job_assignee_id = data.get('job_assignee_id')

        # Create a new AppliedJob instance
        applied_job = AppliedJob.objects.create(
            user_id=user_id,
            job_id=job_id,
            job_assignee_id=job_assignee_id
        )

        # Return success response
        return JsonResponse({'message': 'Job applied successfully!'}, status=201)

    # Handle invalid request method
    return JsonResponse({'error': 'Invalid request method'}, status=405)


from django.http import JsonResponse
from .models import Job, AppliedJob
from .serializers import JobSerializer

def get_job_details_with_status(request):
    job_id = request.GET.get('job_id')
    user_id = request.GET.get('user_id')

    # Check if job_id and user_id are provided
    if job_id is None or user_id is None:
        return JsonResponse({'error': 'job_id and user_id parameters are required'}, status=400)

    try:
        job_id = int(job_id)
        user_id = int(user_id)
    except ValueError:
        return JsonResponse({'error': 'job_id and user_id must be integers'}, status=400)

    try:
        job = Job.objects.get(job_id=job_id)
    except Job.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)

    serializer = JobSerializer(job)

    # Check if the user has applied to the job
    try:
        AppliedJob.objects.get(user_id=user_id, job_id=job_id)
        applied_to_job = True
    except AppliedJob.DoesNotExist:
        applied_to_job = False

    # Add the applied_to_job field to the serialized data
    data = serializer.data
    data['applied_to_job'] = applied_to_job

    return JsonResponse(data)

from django.http import JsonResponse
from .models import AppliedJob
from .serializers import JobSerializer

def get_applied_jobs(request):
    user_id = request.GET.get('user_id')

    # Check if user_id is provided
    if user_id is None:
        return JsonResponse({'error': 'user_id parameter is required'}, status=400)

    try:
        user_id = int(user_id)
    except ValueError:
        return JsonResponse({'error': 'user_id must be an integer'}, status=400)

    # Retrieve applied jobs for the user
    applied_jobs = AppliedJob.objects.filter(user_id=user_id)

    # Serialize the job information
    applied_job_data = []
    for applied_job in applied_jobs:
        job = applied_job.job
        serializer = JobSerializer(job)
        job_data = serializer.data
        job_data['applied_to_job'] = True  
        job_data['status_of_job'] = applied_job.status
        job_data['work_status'] = applied_job.work_status
        job_data['titan_rating_status'] = applied_job.titan_rating
        job_data['captain_rating_status'] = applied_job.captain_rating
        applied_job_data.append(job_data)

    return JsonResponse(applied_job_data, safe=False)

from django.http import JsonResponse
from .models import AppliedJob

def delete_applied_job(request):
    user_id = request.GET.get('user_id')
    job_id = request.GET.get('job_id')

    # Check if both user_id and job_id are provided
    if user_id is None or job_id is None:
        return JsonResponse({'error': 'user_id and job_id parameters are required'}, status=400)

    try:
        user_id = int(user_id)
        job_id = int(job_id)
    except ValueError:
        return JsonResponse({'error': 'user_id and job_id must be integers'}, status=400)

    try:
        # Retrieve the applied job with the given user_id and job_id
        applied_job = AppliedJob.objects.get(user_id=user_id, job_id=job_id)
        # Delete the applied job
        applied_job.delete()
        return JsonResponse({'message': 'Applied job deleted successfully'}, status=200)
    except AppliedJob.DoesNotExist:
        return JsonResponse({'error': 'Applied job not found'}, status=404)

from django.http import JsonResponse
from .models import AppliedJob, UserManagement

def get_users_applied_to_job(request):
    job_id = request.GET.get('job_id')

    # Check if job_id is provided
    if job_id is None:
        return JsonResponse({'error': 'job_id parameter is required'}, status=400)

    try:
        job_id = int(job_id)
    except ValueError:
        return JsonResponse({'error': 'job_id must be an integer'}, status=400)

    try:
        # Retrieve all applied jobs with the given job_id
        applied_jobs = AppliedJob.objects.filter(job_id=job_id)
        # Extract unique user_ids from the applied jobs
        user_ids = applied_jobs.values_list('user_id', flat=True).distinct()
        # Fetch user details for each user_id
        users_data = []
        for user_id in user_ids:
            user = UserDetails.objects.get(user_management_id=user_id)
            status = applied_jobs.filter(job_id=job_id,user_id=user_id).first().status
            work_status = applied_jobs.filter(job_id=job_id,user_id=user_id).first().work_status
            titan_rating_status = AppliedJob.objects.filter(job_id=job_id,user_id=user_id).first().titan_rating is not None
            titan_rating = AppliedJob.objects.filter(job_id=job_id,user_id=user_id).first().titan_rating 
            titan_feedback = AppliedJob.objects.filter(job_id=job_id,user_id=user_id).first().titan_feedback

            user_data = {
                'user_management_id': user.user_management_id,
                'name': user.name,
                'gender': user.gender,
                'email': user.email,
                'address': user.address,
                'status':status,
                'work_status':work_status,
                'titan_rating_status': titan_rating_status,
                'titan_rating': titan_rating,
                'titan_feedback':titan_feedback,
            }
            users_data.append(user_data)
        return JsonResponse(users_data, safe=False)
    except AppliedJob.DoesNotExist:
        return JsonResponse({'error': 'No users applied to the given job_id'}, status=404)
    
from django.http import JsonResponse
from .models import AppliedJob, Job, UserDetails

def get_jobs_for_user(request):
    user_id = request.GET.get('user_id')

    # Check if user_id is provided
    if not user_id:
        return JsonResponse({'error': 'user_id parameter is required'}, status=400)

    try:
        user_id = int(user_id)
    except ValueError:
        return JsonResponse({'error': 'user_id must be an integer'}, status=400)

    try:
        # Retrieve job details for the given user_id
        jobs_data = []
        applied_jobs = AppliedJob.objects.filter(user_id=user_id)
        for applied_job in applied_jobs:
            job_details = Job.objects.get(job_id=applied_job.job_id)
            user_details = UserDetails.objects.get(user_management_id=applied_job.job_assignee_id)
            job_data = {
                'job_id' : applied_job.job_id,
                'user_name': user_details.name,  # Changed 'user_name' to 'name'
                'job_name': job_details.name_of_work,  # Renamed 'job_name' to 'name_of_work'
                'due_date': job_details.due_date,
                'work_status': applied_job.work_status,
                'status': applied_job.status,  # Added 'status' field from the AppliedJob model
            }
            jobs_data.append(job_data)

        return JsonResponse(jobs_data, safe=False)
    except (AppliedJob.DoesNotExist, Job.DoesNotExist, UserDetails.DoesNotExist):
        return JsonResponse({'error': 'No jobs found for the given user_id'}, status=404)


from django.http import JsonResponse
from .models import AppliedJob, UserDetails

def get_connection_names(request):
    user_id = request.GET.get('user_id')

    if not user_id:
        return JsonResponse({'error': 'user_id parameter is required'}, status=400)

    try:
        user_id = int(user_id)
    except ValueError:
        return JsonResponse({'error': 'user_id must be an integer'}, status=400)

    try:
        user_name = UserDetails.objects.get(user_management_id=user_id).name
        return JsonResponse({'name': user_name})
    except UserDetails.DoesNotExist:
        return JsonResponse({'error': 'User details not found'}, status=404)

# from django.http import JsonResponse
# from .models import AppliedJob
# @csrf_exempt
# def update_job_status(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         job_id = data.get('job_id')
#         user_id = data.get('user_id')
#         action = data.get('action')  # 'approved' or 'rejected'
#         try:
#             print(job_id)
#             print(user_id)
#             applied_job = AppliedJob.objects.get(job_id=job_id, user_id=user_id)
#             print(applied_job)
#             if action == 'approved':
#                 applied_job.status = 'ACCEPTED'
#                 applied_job.work_status = 'PENDING'
#                 applied_job.save()

#                 # Update work_status to None for other users with the same job_id
#                 AppliedJob.objects.filter(job_id=job_id).exclude(user_id=user_id).update(work_status=None)

#                 # Update status for other users with the same job_id to 'REJECTED'
#                 AppliedJob.objects.filter(job_id=job_id).exclude(user_id=user_id).update(status='REJECTED')

#             elif action == 'rejected':
#                 applied_job.status = 'REJECTED'
#                 applied_job.work_status = None  # Set work_status to null
#                 applied_job.save()

#             return JsonResponse({'success': True, 'message': 'Job status updated successfully'})
#         except AppliedJob.DoesNotExist:
#             return JsonResponse({'success': False, 'error': 'Applied job not found'}, status=404)

#     return JsonResponse({'success': False, 'error': 'Invalid method'}, status=405)

from django.core.mail import send_mail
from django.http import JsonResponse
from .models import AppliedJob, UserDetails,Notification
import json

@csrf_exempt
def update_job_status(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        job_id = data.get('job_id')
        user_id = data.get('user_id')
        action = data.get('action')  # 'approved' or 'rejected'
        try:
            applied_job = AppliedJob.objects.get(job_id=job_id, user_id=user_id)
            user = UserDetails.objects.get(user_management_id=user_id)
            print(user.user_management_id)
            job = applied_job.job
            
            if action == 'approved':
                applied_job.status = 'ACCEPTED'
                applied_job.work_status = 'PENDING'
                applied_job.save()

                # Update work_status to None for other users with the same job_id
                AppliedJob.objects.filter(job_id=job_id).exclude(user_id=user_id).update(work_status=None)

                # Update status for other users with the same job_id to 'REJECTED'
                AppliedJob.objects.filter(job_id=job_id).exclude(user_id=user_id).update(status='REJECTED')

                # Create a notification for acceptance
                Notification.objects.create(user_id=user.user_management_id, message=f"Congratulations! Your job application for {job.name_of_work} is accepted. Please complete the job before the deadline {job.due_date}.")

                # Send email notification for acceptance
                send_mail(
                    f"Congratulations! Your job application for {job.name_of_work} is accepted",
                    f"Hi {user.name},\n\nCongratulations!! Your job application for {job.name_of_work} is accepted. Please complete the job before the deadline {job.due_date}.",
                    "skillmarket.2024@gmail.com",
                    [user.email],
                    fail_silently=False,
                )
                # Create notifications for rejection for other users
                other_users = AppliedJob.objects.filter(job_id=job_id).exclude(user_id=user_id).exclude(status='REJECTED')

                # Prepare a list to store email recipients
                recipient_emails = []

                for other_applied_job in other_users:
                    other_user_id = other_applied_job.user_id
                    Notification.objects.create(user_id=other_user_id, message=f"Sorry, Your job application for {job.name_of_work} is rejected.")

                    # Add the email address to the recipient list
                    recipient_emails.append(UserDetails.objects.filter(user_management_id=other_user_id).first().email)

                # Send email notification for rejection to all users in the recipient list
                send_mail(
                    f"Sorry, Your job application for {job.name_of_work} is rejected",
                    f"Hi,\n\nSorry to say that Your job application for {job.name_of_work} is rejected.",
                    "skillmarket.2024@gmail.com",
                    recipient_emails,
                    fail_silently=False,
                )


            elif action == 'rejected':
                applied_job.status = 'REJECTED'
                applied_job.work_status = None  # Set work_status to null
                applied_job.save()

                # Create a notification for rejection
                Notification.objects.create(user_id=user.user_management_id, message=f"Sorry, Your job application for {job.name_of_work} is rejected.")

                # Send email notification for rejection
                send_mail(
                    f"Sorry, Your job application for {job.name_of_work} is rejected",
                    f"Hi {user.name},\n\nSorry to say that Your job application for {job.name_of_work} is rejected.",
                    "skillmarket.2024@example.com",
                    [user.email],
                    fail_silently=False,
                )
            elif action == 'IN PROGRESS':
                applied_job.work_status = 'IN PROGRESS'  
                applied_job.save()

                # Create a notification for rejection
                Notification.objects.create(user_id=user.user_management_id, message=f"You have wrongly marked the {job.name_of_work} as completed. Please check with assignee regarding the work.")

                # Send email notification for rejection
                send_mail(
                    f"Your job application for {job.name_of_work} has been marked again as IN PROGRESS",
                    f"Hi {user.name},\n\n" + \
                    f"You have wrongly marked the {job.name_of_work} as completed. Please check with assignee regarding the work.\n Please dont mark as completed until you finish the work other wise your rating will be effected.",
                    "skillmarket.2024@gmail.com",
                    [user.email],
                    fail_silently=False,
                )


            return JsonResponse({'success': True, 'message': 'Job status updated successfully'})
        except AppliedJob.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Applied job not found'}, status=404)
        except UserDetails.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found'}, status=404)

    return JsonResponse({'success': False, 'error': 'Invalid method'}, status=405)

from django.http import JsonResponse
from .models import Notification
from django.http import JsonResponse
from .models import Notification

def user_notifications(request, user_id):
    try:
        # Fetch notifications for the specified user
        notifications = Notification.objects.filter(user_id=user_id)

        # Count the number of notifications
        notifications_count = notifications.count()

        # Serialize notifications data
        notifications_data = [{
            'message': notification.message,
            'created_at': notification.created_at.strftime('%Y-%m-%d %H:%M:%S')
        } for notification in notifications]

        return JsonResponse({
            'notifications_count': notifications_count,
            'notifications': notifications_data
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

from django.core.mail import send_mail
from django.http import JsonResponse
from .models import AppliedJob, Notification, UserManagement
import json

@csrf_exempt
def update_work_status(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        job_id = data.get('job_id')
        user_id = data.get('user_id')
        action = data.get('action')  # 'IN_PROGRESS' or 'COMPLETED'
        try:
            applied_job = AppliedJob.objects.get(job_id=job_id, user_id=user_id)
            print(applied_job.work_status)
            job = applied_job.job

            # Fetch assignee user and current user
            assignee_user = UserDetails.objects.get(user_management_id=applied_job.job_assignee_id)
            current_user = UserDetails.objects.get(user_management_id=user_id)

            if action == 'IN PROGRESS':
                applied_job.work_status = 'IN PROGRESS'
                applied_job.save()

                # Send email notification for work in progress
                send_mail(
                    f"Work in Progress: {job.name_of_work}",
                    f"Hey {assignee_user.name},\n\nYour posted job {job.name_of_work} has been started by {current_user.name}. If you have any queries please ping to this email {current_user.email}.",
                    "your_email@example.com",
                    [assignee_user.email],
                    fail_silently=False,
                )

                # Create notification
                Notification.objects.create(user_id=assignee_user.user_management_id,
                                            message=f"Your posted job {job.name_of_work} has been started by {current_user.name}.")

            elif action == 'COMPLETED':
                applied_job.work_status = 'COMPLETED'
                applied_job.save()

                # Send email notification for work completed
                send_mail(
                    f"Work Completed: {job.name_of_work}",
                    f"Hey {assignee_user.name},\n\nYour posted job {job.name_of_work} has been completed by {current_user.name}. If you have any queries please ping to this email {current_user.email}. If the work has not yet done please update the status back to reassign the task. If work done by {current_user.name} satisfies you please leave us some rating and review.",
                    "your_email@example.com",
                    [assignee_user.email],
                    fail_silently=False,
                )

                # Create notification
                Notification.objects.create(user_id=assignee_user.user_management_id,
                                            message=f"Your posted job {job.name_of_work} has been completed by {current_user.name}.")
                
            return JsonResponse({'success': True, 'message': 'Work status updated successfully'})
        except AppliedJob.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Applied job not found'}, status=404)
        except UserManagement.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found'}, status=404)

    return JsonResponse({'success': False, 'error': 'Invalid method'}, status=405)


from django.http import JsonResponse
from .models import AppliedJob, UserDetails
import json
from django.views.decorators.csrf import csrf_exempt

# @csrf_exempt
# def update_rating(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             job_id = data.get('job_id')
#             user_id = data.get('user_id')
#             rating = data.get('rating')
#             feedback = data.get('feedback')

#             # Retrieve the AppliedJob instance
#             applied_job = AppliedJob.objects.get(job_id=job_id, user_id=user_id)

#             # Update the rating and feedback
#             applied_job.rating = rating
#             applied_job.feedback = feedback
#             applied_job.save()

#             # Get all completed jobs for the user
#             user_completed_jobs = AppliedJob.objects.filter(user_id=user_id, work_status='COMPLETED')

#             # Calculate the new overall_rating
#             total_ratings = sum(job.rating for job in user_completed_jobs)
#             print(total_ratings,len(user_completed_jobs))
#             if total_ratings:
#                 overall_rating = total_ratings / len(user_completed_jobs)
#             else:
#                 overall_rating = None

#             # Update the overall_rating of UserDetails
#             user_details = UserDetails.objects.get(user_management_id=user_id)
#             user_details.overall_rating = overall_rating
#             user_details.save()

#             return JsonResponse({'message': 'Rating and feedback updated successfully'}, status=200)

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     else:
#         return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

from django.core.mail import send_mail
from .models import AppliedJob, UserDetails, Notification
@csrf_exempt
def update_rating(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            job_id = data.get('job_id')
            user_id = data.get('user_id')
            rating = data.get('rating')
            feedback = data.get('feedback')
            whose_feedback = data.get('whose_feedback')

            # Retrieve the AppliedJob instance
            job = Job.objects.get(job_id=job_id)
            # Update the rating and feedback
            if whose_feedback == 'captain':
                applied_job = AppliedJob.objects.get(job_id=job_id, job_assignee_id=user_id)
                applied_job.captain_rating = rating
                applied_job.captain_feedback = feedback
            elif whose_feedback == 'titan':
                applied_job = AppliedJob.objects.get(job_id=job_id, user_id=user_id)
                applied_job.titan_rating = rating
                applied_job.titan_feedback = feedback

            applied_job.save()

            # Get all completed jobs for the user
            user_completed_jobs = AppliedJob.objects.filter(user_id=user_id, work_status='COMPLETED')

            # Calculate the new overall_rating for titan and captain separately
            total_titan_ratings = sum(job.titan_rating or 0 for job in user_completed_jobs)
            total_captain_ratings = sum(job.captain_rating or 0 for job in user_completed_jobs)
            num_completed_jobs = len(user_completed_jobs)

            overall_titan_rating = total_titan_ratings / num_completed_jobs if total_titan_ratings is not None and num_completed_jobs else None
            overall_captain_rating = total_captain_ratings / num_completed_jobs if total_captain_ratings is not None and num_completed_jobs else None

            # Update the overall_rating of UserDetails for titan and captain
            user_details = UserDetails.objects.get(user_management_id=user_id)
            user_details.overall_titan_rating = overall_titan_rating
            user_details.overall_captain_rating = overall_captain_rating
            user_details.save()

            # Send email and create notification if feedback is for titan
            if whose_feedback == 'titan':
                titan_user_details = UserDetails.objects.get(user_management_id=user_id)
                titan_email = titan_user_details.email
                review = feedback  # Assuming the feedback is the review

                # Send email to Titan user
                send_mail(
                    'You have received a rating!',
                    f'You have received a rating of {rating} for {job.name_of_work}. Review on your work is: {review}. Please give rating for your job assignee based on their responsiveness, payment status, etc.',
                    'skillmarket.2024@gmail.com',
                    [titan_email],
                    fail_silently=False,
                )

                # Create notification for Titan user
                Notification.objects.create(
                    user_id=user_id,
                    message=f'You have received a rating of {rating} for {job.name_of_work}. Review on your work is: {review}. Please give rating for your job assignee based on their responsiveness, payment status, etc.'
                )
            elif whose_feedback=="captain" :
                captain_user_details = UserDetails.objects.get(user_management_id=user_id)
                captain_email = captain_user_details.email
                review = feedback  # Assuming the feedback is the review

                # Send email to Titan user
                send_mail(
                    'You have received a rating for the Posted Job!',
                    f'You have received a rating of {rating} for {job.name_of_work}. Review on your job is: {review}.',
                    'skillmarket.2024@gmail.com',
                    [captain_email],
                    fail_silently=False,
                )

                # Create notification for Titan user
                Notification.objects.create(
                    user_id=user_id,
                    message=f'You have received a rating of {rating} for {job.name_of_work}. Review on your job is: {review}.',
                )

            return JsonResponse({'message': 'Rating and feedback updated successfully'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


from django.http import JsonResponse
from django.utils import timezone
from .models import Job
from .serializers import JobSerializer

def show_all_remote_jobs(request):
    # Retrieve all jobs with deadlines greater than the current date
    current_date = timezone.now().date()
    jobs = Job.objects.filter(due_date__gt=current_date,type_of_work='remote')

    # Serialize the queryset
    serializer = JobSerializer(jobs, many=True)

    # Return the serialized data as JSON response
    return JsonResponse(serializer.data, safe=False)

from django.http import JsonResponse
from django.utils import timezone
from .models import Job
from .serializers import JobSerializer

def show_all_non_remote_jobs(request):
    # Retrieve all jobs with deadlines greater than the current date
    current_date = timezone.now().date()
    jobs = Job.objects.filter(due_date__gt=current_date,type_of_work='non-remote')

    # Serialize the queryset
    serializer = JobSerializer(jobs, many=True)

    # Return the serialized data as JSON response
    return JsonResponse(serializer.data, safe=False)


import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AppliedJob

@csrf_exempt
def show_reviews(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            type_of_user = data.get('type_of_user')

            if type_of_user == 'captain':
                reviews = AppliedJob.objects.filter(
                    job_assignee_id=user_id,
                    captain_rating__isnull=False,
                    captain_feedback__isnull=False
                ).values(
                    'job_id', 'job_id__name_of_work', 'captain_rating', 'captain_feedback'
                )
            elif type_of_user == 'titan':
                reviews = AppliedJob.objects.filter(
                    user_id=user_id,
                    titan_rating__isnull=False,
                    titan_feedback__isnull=False
                ).values(
                    'job_id', 'job_id__name_of_work', 'titan_rating', 'titan_feedback'
                )
            else:
                return JsonResponse({'error': 'Invalid type of user'}, status=400)

            return JsonResponse(list(reviews), safe=False, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

from django.http import JsonResponse
from .models import UserDetails
from .serializers import UserRatingsSerializer

def all_users(request):
    # Get all users
    users = UserDetails.objects.all()

    # Serialize the queryset
    serializer = UserRatingsSerializer(users, many=True)

    # Get the count of users
    user_count = users.count()

    # Append co unt to the serialized data
    data = {
        "count": user_count,
        "users": serializer.data
    }

    # Return the combined data as JSON response
    return JsonResponse(data, safe=False)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from django.db import transaction
from .models import UserDetails, UserSkills
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import transaction
from rest_framework.views import APIView
from rest_framework import status
from .models import UserDetails, UserSkills
from .serializers import UserDetailsSerializer, UserSkillsSerializer
import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views import View
from django.db import transaction
from django.core import serializers
from django.forms.models import model_to_dict

from .models import UserDetails, UserSkills
from .serializers import UserDetailsSerializer, UserSkillsSerializer
@method_decorator(csrf_exempt, name='dispatch')
class EditProfile(View):
    def post(self, request):
        # Deserialize request data
        data = json.loads(request.body)
        user_details_data = data.get('user_details')
        user_skills_data = data.get('user_skills')

        try:
            with transaction.atomic():
                # Update or create user details
                user_management_id = user_details_data.get('user_management')  # Remove and get user_management_id
                print(user_management_id)
                user_management_instance = UserManagement.objects.get(pk=user_management_id)
                print(user_management_instance)
                user_details_instance = UserDetails.objects.get(user_management_id=user_management_id);
                user_details_serializer = UserDetailsSerializer(instance=user_details_instance, data=user_details_data)
                if user_details_serializer.is_valid():
                    user_details_serializer.save()
                    print("done")
                else:
                    return JsonResponse(user_details_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                # Update or create user skills
                for skill_data in user_skills_data:
                    skill_id = skill_data.get('skill_id')
                    print(skill_id)
                    try:
                        if skill_id is not None:
                            user_skills_instance = UserSkills1.objects.get(skill_id=skill_id)
                            user_skills_serializer = UserSkillsSerializer(instance=user_skills_instance, data=skill_data)
                        else:
                            # skill_id = skill_data.pop('skill_id')
                            user_skills_serializer = UserSkillsSerializer(data=skill_data)
                            user_skills_serializer.is_valid()
                            print(user_skills_serializer.validated_data)
                    except UserSkills1.DoesNotExist:
                        # skill_id = skill_data.pop('skill_id')
                        # If the skill does not exist, create a new instance
                        user_skills_serializer = UserSkillsSerializer(data=skill_data)
                        print(user_skills_serializer.data)
                        if user_skills_serializer.is_valid():
                            user_skills_serializer.save()
                        # user_skills_serializer = UserSkillsSerializer(instance=user_skills_instance, data=skill_data)

                    if user_skills_serializer.is_valid():
                        user_skills_serializer.save()
                        print("done skills")
                    else:
                        return JsonResponse(user_skills_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                # If everything is successful, return success message
                return JsonResponse({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)
        except UserManagement.DoesNotExist:
            return JsonResponse({'error': 'UserManagement does not exist'}, status=status.HTTP_404_NOT_FOUND)

        except UserDetails.DoesNotExist:
            return JsonResponse({'error': 'UserDetails does not exist'}, status=status.HTTP_404_NOT_FOUND)

        except UserSkills1.DoesNotExist:
            return JsonResponse({'error': 'UserSkills1 does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            # If any error occurs, return error message
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # If the request method is not POST, return method not allowed
        return JsonResponse({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
