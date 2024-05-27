# Generated by Django 4.2.1 on 2024-05-26 15:25

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="UserManagement",
            fields=[
                ("user_id", models.AutoField(primary_key=True, serialize=False)),
                ("username", models.CharField(max_length=255, unique=True)),
                ("password", models.CharField(max_length=255)),
            ],
            options={
                "unique_together": {("user_id", "username")},
            },
        ),
        migrations.CreateModel(
            name="PasswordReset",
            fields=[
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        serialize=False,
                        to="rentify.usermanagement",
                    ),
                ),
                ("otp", models.CharField(max_length=6)),
                (
                    "expiration_time",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserDetails",
            fields=[
                (
                    "user_management",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        serialize=False,
                        to="rentify.usermanagement",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("gender", models.CharField(max_length=10)),
                ("phone", models.CharField(max_length=15)),
                ("email", models.EmailField(max_length=254)),
                ("address", models.TextField()),
                (
                    "overall_titan_rating",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=5, null=True
                    ),
                ),
                (
                    "overall_captain_rating",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=5, null=True
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserSkills",
            fields=[
                (
                    "user_management",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        serialize=False,
                        to="rentify.usermanagement",
                    ),
                ),
                ("skill_category", models.CharField(max_length=20)),
                ("job_details", models.CharField(max_length=255)),
                ("has_work_experience", models.CharField(max_length=3)),
                ("workplace", models.CharField(blank=True, max_length=255, null=True)),
                ("position", models.CharField(blank=True, max_length=255, null=True)),
                ("duration", models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="UserSkills1",
            fields=[
                ("skill_id", models.AutoField(primary_key=True, serialize=False)),
                ("skill_category", models.CharField(max_length=20)),
                ("job_details", models.CharField(max_length=255)),
                ("has_work_experience", models.CharField(max_length=3)),
                ("workplace", models.CharField(blank=True, max_length=255, null=True)),
                ("position", models.CharField(blank=True, max_length=255, null=True)),
                ("duration", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "user_management",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="rentify.usermanagement",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Token",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("key", models.CharField(max_length=40)),
                (
                    "user_management",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="rentify.usermanagement",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Notification",
            fields=[
                (
                    "notification_id",
                    models.AutoField(primary_key=True, serialize=False),
                ),
                ("message", models.CharField(max_length=1000)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="rentify.usermanagement",
                    ),
                ),
            ],
            options={
                "verbose_name": "Notification",
                "verbose_name_plural": "Notifications",
            },
        ),
        migrations.CreateModel(
            name="Job",
            fields=[
                ("job_id", models.AutoField(primary_key=True, serialize=False)),
                ("type_of_sector", models.CharField(blank=True, max_length=100)),
                ("name_of_work", models.CharField(max_length=500)),
                ("description_of_work", models.TextField()),
                ("type_of_work", models.CharField(max_length=20)),
                ("useful_skills", models.CharField(blank=True, max_length=255)),
                ("useful_things", models.CharField(blank=True, max_length=255)),
                ("expected_time", models.CharField(blank=True, max_length=100)),
                ("place_of_work", models.CharField(blank=True, max_length=255)),
                ("worker_stay_info", models.CharField(blank=True, max_length=255)),
                ("travel_info", models.CharField(blank=True, max_length=255)),
                ("other_incentives", models.CharField(blank=True, max_length=255)),
                ("expected_days", models.CharField(max_length=100)),
                ("compensation", models.CharField(max_length=100)),
                ("rules_or_conditions", models.TextField()),
                ("due_date", models.DateField()),
                ("file", models.FileField(blank=True, upload_to="uploads/")),
                (
                    "user_management",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="rentify.usermanagement",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="CustomToken",
            fields=[
                (
                    "key",
                    models.CharField(max_length=100, primary_key=True, serialize=False),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("expiration_time", models.DateTimeField()),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="auth_tokens",
                        to="rentify.usermanagement",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="AppliedJob",
            fields=[
                ("applied_job_id", models.AutoField(primary_key=True, serialize=False)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PENDING", "Pending"),
                            ("ACCEPTED", "Accepted"),
                            ("REJECTED", "Rejected"),
                        ],
                        default="PENDING",
                        max_length=20,
                    ),
                ),
                (
                    "work_status",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("PENDING", "Pending"),
                            ("IN_PROGRESS", "In Progress"),
                            ("COMPLETED", "Completed"),
                        ],
                        default=None,
                        max_length=20,
                        null=True,
                    ),
                ),
                ("deleted", models.BooleanField(default=False)),
                ("titan_rating", models.IntegerField(blank=True, null=True)),
                (
                    "titan_feedback",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                ("captain_rating", models.IntegerField(blank=True, null=True)),
                (
                    "captain_feedback",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                (
                    "job",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="rentify.job"
                    ),
                ),
                (
                    "job_assignee",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="assigned_jobs",
                        to="rentify.usermanagement",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="rentify.usermanagement",
                    ),
                ),
            ],
            options={
                "verbose_name": "Applied Job",
                "verbose_name_plural": "Applied Jobs",
                "unique_together": {("job", "user", "job_assignee")},
            },
        ),
    ]