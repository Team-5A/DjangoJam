import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'django_jam_project.settings')

import django
django.setup()
from django.contrib.auth.models import User
from django_jam_app.models import Tune, UserProfile

print("Creating super user with username: admin")
os.system("python manage.py createsuperuser --username admin --email django_jam@gmail.com")
print("Creating userprofile for super user")

try:
    user = User.objects.get(username='admin')
    profile = UserProfile.objects.create(
        user=user,
        total_likes=0,
        self_likes=0,
        number_of_tunes_played=0
    )
    profile.save()
    print("Super user created successfully")
except User.DoesNotExist:
    print("Super user does not exist")
    print("Super user not created")
    print("Please create super user manually")
    print("Exiting...")
    exit(1)


