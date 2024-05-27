from django.db import models
from django.contrib.auth.hashers import check_password

class UserManagement(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)  # Make username unique
    password = models.CharField(max_length=255)

    class Meta:
        unique_together = ('user_id', 'username')  # Define composite unique constraint

    def check_password(self, raw_password):
        """Verifies the provided password against the stored password hash."""
        return check_password(raw_password, self.password)

class Token(models.Model):
    # ... other fields ...
    key = models.CharField(max_length=40)
    user_management = models.OneToOneField(UserManagement, on_delete=models.CASCADE)  # Add this field


class UserDetails(models.Model):
    # Use both user_id and username as composite primary key
    user_management = models.OneToOneField(UserManagement, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.TextField()
    overall_titan_rating = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    overall_captain_rating = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)


class UserSkills(models.Model):
    # Use both user_id and username as composite primary key
    user_management = models.OneToOneField(UserManagement, on_delete=models.CASCADE, primary_key=True)
    skill_category = models.CharField(max_length=20)
    job_details = models.CharField(max_length=255)
    has_work_experience = models.CharField(max_length=3)
    workplace = models.CharField(max_length=255, null=True, blank=True)
    position = models.CharField(max_length=255, null=True, blank=True)
    duration = models.CharField(max_length=255, null=True, blank=True)

from django.db import models

class UserSkills1(models.Model):
    # Autoincremental primary key for skills
    skill_id = models.AutoField(primary_key=True)
    # Use both user_id and username as composite foreign key
    user_management = models.ForeignKey(UserManagement, on_delete=models.CASCADE)
    skill_category = models.CharField(max_length=20)
    job_details = models.CharField(max_length=255)
    has_work_experience = models.CharField(max_length=3)
    workplace = models.CharField(max_length=255, null=True, blank=True)
    position = models.CharField(max_length=255, null=True, blank=True)
    duration = models.CharField(max_length=255, null=True, blank=True)
# from django.db import models

# class CustomToken(models.Model):
#     key = models.CharField(max_length=100, primary_key=True)
#     user = models.ForeignKey(UserManagement, related_name='auth_tokens', on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.key

from django.db import models
from django.utils import timezone

class CustomToken(models.Model):
    key = models.CharField(max_length=100, primary_key=True)
    user = models.ForeignKey(UserManagement, related_name='auth_tokens', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expiration_time = models.DateTimeField()  # Add this field for token expiration

    def __str__(self):
        return self.key

    def is_expired(self):
        """
        Method to check if the token is expired.
        """
        return timezone.now() > self.expiration_time

    def disable_other_tokens(self):
        """
        Method to disable other tokens for the same user.
        """
        other_tokens = CustomToken.objects.filter(user=self.user).exclude(key=self.key)
        for token in other_tokens:
            token.delete()  # You may want to implement soft deletion instead

from django.db import models
from .models import UserManagement

class PasswordReset(models.Model):
    user = models.OneToOneField(UserManagement, primary_key=True, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    expiration_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Password reset for {self.user.username}"


from django.db import models

class Job(models.Model):
    user_management = models.ForeignKey(UserManagement, on_delete=models.CASCADE)
    job_id = models.AutoField(primary_key=True)
    type_of_sector = models.CharField(max_length=100,blank=True)
    name_of_work = models.CharField(max_length=500)
    description_of_work = models.TextField()
    type_of_work = models.CharField(max_length=20)
    useful_skills = models.CharField(max_length=255, blank=True)
    useful_things = models.CharField(max_length=255, blank=True)
    expected_time = models.CharField(max_length=100, blank=True)
    place_of_work = models.CharField(max_length=255, blank=True)
    worker_stay_info = models.CharField(max_length=255, blank=True)
    travel_info = models.CharField(max_length=255, blank=True)
    other_incentives = models.CharField(max_length=255, blank= True)
    expected_days = models.CharField(max_length=100)
    compensation = models.CharField(max_length=100)
    rules_or_conditions = models.TextField()
    due_date = models.DateField()
    file = models.FileField(upload_to='uploads/', blank=True)  # Adjust upload path as needed

    def __str__(self):
        return f"{self.name_of_work} - {self.user_management}"
    

from django.db import models
from .models import UserManagement, Job

class AppliedJob(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    )

    WORK_STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    )

    applied_job_id = models.AutoField(primary_key=True)  # Auto-generated primary key
    user = models.ForeignKey(UserManagement, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    job_assignee = models.ForeignKey(UserManagement, on_delete=models.CASCADE, related_name='assigned_jobs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    work_status = models.CharField(max_length=20, choices=WORK_STATUS_CHOICES,  default=None,null=True, blank=True)
    deleted = models.BooleanField(default=False)
    titan_rating = models.IntegerField(null=True, blank=True)  
    titan_feedback = models.CharField(null=True,blank=True,max_length=100)
    captain_rating = models.IntegerField(null=True, blank=True)  
    captain_feedback = models.CharField(null=True,blank=True,max_length=100)

    class Meta:
        verbose_name = 'Applied Job'
        verbose_name_plural = 'Applied Jobs'
        unique_together = ('job', 'user', 'job_assignee')  # Make job, user, and job_assignee together as unique

    def __str__(self):
        return f'{self.user.username} applied for {self.job.name_of_work}'

from django.db import models
from .models import UserManagement

class Notification(models.Model):
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserManagement, on_delete=models.CASCADE)
    message = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'

    def __str__(self):
        return f'Notification ID: {self.notification_id} - User: {self.user} - Message: {self.message}'

from django.http import JsonResponse
from .models import Notification

def user_notifications(request, user_id):
    try:
        # Fetch notifications for the specified user
        notifications = Notification.objects.filter(user_id=user_id)

        # Serialize notifications data
        notifications_data = [{
            'message': notification.message,
            'created_at': notification.created_at.strftime('%Y-%m-%d %H:%M:%S')
        } for notification in notifications]

        return JsonResponse({'notifications': notifications_data}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
