from django.urls import path
from django_jam_app import views

app_name = 'django_jam_app'
urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    # path('tune/<slug:tune_name_slug>/', views.show_tune, name='show_tune'),
    path('add_tune/', views.add_tune, name='add_tune'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('profile/<slug:slug>/', views.profile, name='profile'),
    path('explore/', views.explore, name='explore'),
    path('explore/like/<int:tune_id>/', views.like_tune, name='like_tune'),
    path('explore/dislike/<int:tune_id>/', views.dislike_tune, name='dislike_tune'),
]
