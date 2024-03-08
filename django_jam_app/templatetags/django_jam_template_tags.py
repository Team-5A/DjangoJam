from django import template
from django_jam_app.models import Tune

register = template.Library()

@register.inclusion_tag('django_jam_app/tunes.html')    # Get all tunes
def get_tune_list():
    return {'Tunes': Tune.objects.all()}


@register.filter(name='is_current_user')            # Check if user is current user (logged in)
def is_current_user(user_profile, current_user):
    return user_profile.user == current_user


@register.filter(name='count_tunes')                # Count tunes by user
def count_tunes(user):
    return Tune.objects.filter(creator=user).count()


@register.inclusion_tag('django_jam_app/tunes.html')    # Get tunes by user
def get_tunes_by_user(user):
    return {'Tunes': Tune.objects.filter(creator=user)}

@register.simple_tag(name='has_tunes')                # Count tunes by user
def has_tunes(user):
    return Tune.objects.filter(creator=user).count() > 0
