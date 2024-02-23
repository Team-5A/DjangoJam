from django import template
from django_jam_app.models import Tune

register = template.Library()

@register.inclusion_tag('django_jam_app/tunes.html')
def get_tune_list(current_tune=None):
    return {'Tunes': Tune.objects.all()}
