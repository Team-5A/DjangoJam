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
            website=f'http://www.{data["username"]}.com',
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
        {'name': 'Tune 1', 'artist_username': 'user1', 'views': 100, 'likes': 50, 'notes': 'AAABBB'},
        {'name': 'Tune 2', 'artist_username': 'user1', 'views': 150, 'likes': 70, 'notes': 'CCCCBBBB'},
        {'name': 'Tune 3', 'artist_username': 'user1', 'views': 200, 'likes': 90, 'notes': 'AAAA'},
        {'name': 'Tune 4', 'artist_username': 'user2', 'views': 250, 'likes': 110, 'notes': 'CCCBBAAD'},
        {'name': 'Tune 5', 'artist_username': 'user4', 'views': 300, 'likes': 130, 'notes': 'GGGGAAA'},
        {'name': 'Tune 6', 'artist_username': 'user3', 'views': 350, 'likes': 150, 'notes': 'AAAAAGGG'},
        {'name': 'Tune 7', 'artist_username': 'user3', 'views': 400, 'likes': 170, 'notes': 'GGGGGGGG'}
    ]

    for data in tunes_data:
        # Get the artist user
        artist_user = User.objects.get(username=data['artist_username'])
        tune = Tune.objects.create(
            name=data['name'],
            artist=artist_user,
            views=data['views'],
            likes=data['likes'],
            notes=data['notes'],
            slug=slugify(data['name'])
        )
        tune.save()
        print(f"Created Tune: {data['name']}")


if __name__ == '__main__':
    print('Starting Rango population script...')
    populate_user_profiles()
    populate_tunes()