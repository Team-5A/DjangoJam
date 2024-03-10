import os
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'django_jam_project.settings')

import django
django.setup()
from django.utils.text import slugify
from django.contrib.auth.models import User
from django_jam_app.models import Tune, UserProfile


def populate_user_profiles():
    # Sample user data
    users_data = [
        {'username': 'user1', 'email': 'user1@example.com', 'password': 'password1'},
        {'username': 'user2', 'email': 'user1@example.com', 'password': 'password2'},
        {'username': 'user3', 'email': 'user1@example.com', 'password': 'password3'},
        {'username': 'user4', 'email': 'user2@example.com', 'password': 'password3'},
        # Add more user data as needed
    ]

    for data in users_data:
        random.seed(42)
        user = User.objects.create_user(data['username'], data['email'], data['password'])
        profile = UserProfile.objects.create(
            user=user,
            total_likes=random.randint(0, 20),
            self_likes=random.randint(0, 20),
            number_of_tunes_played=random.randint(0, 50),
            slug=slugify(data['username'])
        )
        profile.save()
        print(f"Created UserProfile for {data['username']}")


def populate_tunes():
    # Sample tune data
    tunes_data = [
        {'name': 'Never Gonna Give You Up', 'artist_username': 'user1', 'views': 10, 'likes': 10,
         'notes': 'G3,A3,C4,A3,E4,E4,D4,,G3,A3,C4,A3,D4,D4,C4,,', 'beats_per_minute': 120},

        {'name': 'Pokemon Center', 'artist_username': 'user1', 'views': 50, 'likes': 70,
         'notes': 'C4,G3,C4,G4,,F4,,E4,D4,B4,,,,', 'beats_per_minute': 160},

        {'name': 'Ocarina Of Time', 'artist_username': 'user1', 'views': 200, 'likes': 90,
         'notes': 'D3,,,E3,,,D4,,,,C4,B4,B4,,,,', 'beats_per_minute': 100},

        {'name': 'GOT Title Theme', 'artist_username': 'user2', 'views': 20, 'likes': 10,
         'notes': 'E4,,A3,,C4,D4,E4,,A3,,C4,B4,C4,,,,', 'beats_per_minute': 130},

        {'name': 'Tetris', 'artist_username': 'user4', 'views': 30, 'likes': 13,
         'notes': 'E4,,B4,C4,D4,,C4,B4,A3,,A3,C4,D4,E4,,D4,C4,B4,,', 'beats_per_minute': 240},

        {'name': 'Imperial March', 'artist_username': 'user3', 'views': 50, 'likes': 50,
         'notes': 'D4,,D4,,D4,,A3,,F4,,D4,,A3,,F4,,D4,,', 'beats_per_minute': 50},

        {'name': 'Lavender Town', 'artist_username': 'user3', 'views': 400, 'likes': 170,
         'notes': 'C3,,,G3,,,C#4,,,G4,,,C3,,,G3,,,C#4,,,G4', 'beats_per_minute': 70},
    ]

    for data in tunes_data:
        # Get the artist user
        artist_user = User.objects.get(username=data['artist_username'])
        tune = Tune.objects.create(
            name=data['name'],
            creator=artist_user,
            views=data['views'],
            likes=data['likes'],
            notes=data['notes'],
            slug=slugify(data['name']),
            beats_per_minute=data['beats_per_minute']
        )
        tune.save()
        print(f"Created Tune: {data['name']}")


if __name__ == '__main__':
    print('Starting Rango population script...')
    populate_user_profiles()
    populate_tunes()