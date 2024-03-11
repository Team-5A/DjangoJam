from django.urls import path
from django_jam_app import views

app_name = 'django_jam_app'
urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    # path('tune/<slug:tune_name_slug>/', views.show_tune, name='show_tune'),
    path('create/', views.create, name='create'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('profile/<slug:slug>/', views.profile, name='profile'),
    path('explore/', views.explore, name='explore'),
    path('save/', views.save_tune, name='save_tune'),
    path('delete_account/', views.delete_account, name='delete_account'),
    path('delete_tune/<int:tuneid>/', views.delete_tune, name='delete_tune'),
    path('like_tune/<int:tune_id>/', views.like_tune, name='like_tune'),
    path('unlike_tune/<int:tune_id>/', views.unlike_tune, name='unlike_tune'),
    path('played_tune/', views.played_tune, name='played_tune'),
]
