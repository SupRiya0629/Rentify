from rest_framework import serializers
from .models import UserManagement, UserDetails, UserSkills1
from django.contrib.auth.hashers import make_password

class UserManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserManagement
        fields = ['username', 'password']
    def create(self,validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ['name', 'gender', 'phone', 'email', 'address', 'user_management']

class UserSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkills1
        fields = ['skill_category', 'job_details', 'has_work_experience', 'workplace', 'position', 'duration', 'user_management']
class UserSkillsSerializer1(serializers.ModelSerializer):
    class Meta:
        model = UserSkills1
        fields = ['skill_id','skill_category', 'job_details', 'has_work_experience', 'workplace', 'position', 'duration', 'user_management']
from django import forms
from .models import Job

class JobPostForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = '__all__'

from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

from rest_framework import serializers
from .models import AppliedJob

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppliedJob
        fields = ['titan_rating', 'titan_feedback', 'captain_rating', 'captain_feedback']

class UserRatingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ['name', 'gender', 'email', 'address', 'user_management','overall_titan_rating','overall_captain_rating']
