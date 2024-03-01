from django import template
from django_jam_app.models import Tune

register = template.Library()


@register.inclusion_tag('django_jam_app/tunes.html')
def get_tune_list(current_tune=None):
    return {'Tunes': Tune.objects.all()}


@register.filter(name='is_current_user')
def is_current_user(user_profile, current_user):
    return user_profile.user == current_user
