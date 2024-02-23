from django.contrib import admin

from django_jam_app.models import Tune, UserProfile


class TuneAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Tune, TuneAdmin)
admin.site.register(UserProfile)
