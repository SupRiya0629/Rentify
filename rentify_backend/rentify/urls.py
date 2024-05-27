# skillmarket/urls.py

from django.urls import path
from .views import CheckUsernameAvailabilityView, EditProfile, UserProfileAPIView, UserRegistrationView,LoginView, ValidateTokenView, all_users, apply_job, change_password, count_jobs, create_job, delete_applied_job, delete_job, forgot_password, get_applied_jobs, get_connection_names, get_job_details, get_job_details_with_status, get_jobs_for_user, get_users_applied_to_job, jobsPostedByUser, show_all_jobs, show_all_non_remote_jobs, show_all_remote_jobs, show_reviews, update_job_status, update_rating, update_work_status, user_notifications, verify_otp

urlpatterns = [
    # path('user-management/', UserManagementView.as_view(), name='user-management'),
    # path('user-details/', UserDetailsView.as_view(), name='user-details'),
    # path('user-skills/', UserSkillsView.as_view(), name='user-skills'),
    # Add more URL patterns as needed
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('check-username/',CheckUsernameAvailabilityView.as_view(), name='check_username_availability'),
    path('login/', LoginView.as_view(), name='login'),
    path('validate_token/', ValidateTokenView.as_view(), name='validate_token'),
    path('forgot_password/', forgot_password, name='forgot_password'),
    path('verify_otp/', verify_otp, name='verify_otp'),
    path('change_password/', change_password, name='change_password'),
    path('profile/<int:user_id>/', UserProfileAPIView.as_view(), name='user_profile'),
    path('create-job/', create_job, name='create_job'),
    path('show_all_jobs/', show_all_jobs, name='show_all_jobs'),
    path('count_jobs/', count_jobs, name='count_jobs'),
    path('posted_by_user/', jobsPostedByUser, name='jobsPostedByUser'),
    path('get_job_details/', get_job_details, name='get_job_details'),
    path('delete_job/',delete_job,name='delete_job'),
    path('apply_job/',apply_job,name='apply_job'),
    path('get_job_details_with_status/',get_job_details_with_status,name='get_job_details_with_status'),
    path('get_applied_jobs/',get_applied_jobs,name='get_applied_jobs'),
    path('delete_applied_job/',delete_applied_job,name='delete_applied_job'),
    path('get_users_applied_to_job/',get_users_applied_to_job,name='get_users_applied_to_job'),
    path('get_jobs_for_user/',get_jobs_for_user,name='get_jobs_for_user'),
    path('get_connection_names/',get_connection_names,name='get_connection_names'),
    path('update_job_status/',update_job_status,name='update_job_status'),
    path('user/<int:user_id>/notifications/',user_notifications,name='user_notifications'),
    path('update_work_status/',update_work_status,name='update_work_status'),
    path('update_rating/',update_rating,name='update_work_status'),
    path('show_all_remote_jobs/', show_all_remote_jobs, name='show_all_remote_jobs'),
    path('show_all_non_remote_jobs/', show_all_non_remote_jobs, name='show_all_non_remote_jobs'),
    path('show_reviews/', show_reviews, name='show_reviews'),
    path('all_users/',all_users,name='all_users'),
    path('edit_user/', EditProfile.as_view(), name='edit_user'),

    # path('logout/', logout_view, name='logout'),
    # path('csrf_token/', get_csrf_token, name='get_csrf_token'),

]
