from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User


# Create your models here.

# user model with relationship to django user model.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    website = models.URLField(blank=True)
    picture = models.ImageField(upload_to='profile_images', blank=True)

    def __str__(self):
        return self.user.username


# tune model has foreign key relationship with user profile model.
class Tune(models.Model):
    ID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, unique=True)
    artist = models.ForeignKey(User, on_delete=models.CASCADE)
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    notes = models.CharField(max_length=16)
    # add slug field to store the url of the tune.
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Tune, self).save(*args, **kwargs)

    class Meta:
        verbose_name_plural = 'Tunes'

    def __str__(self):
        return self.name
