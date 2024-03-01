from django import forms
from django_jam_app.models import Tune, UserProfile
from django.contrib.auth.models import User


class TuneForm(forms.ModelForm):
    name = forms.CharField(max_length=128, help_text="Please enter the Tune's name.")
    notes = forms.CharField(max_length=16, help_text="Please enter the Tune's notes.")
    views = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
    likes = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
    slug = forms.CharField(widget=forms.HiddenInput(), required=False)


    class Meta:
        model = Tune
        fields = ('name', 'notes',)

    def __init__(self, *args, **kwargs):
        self.artist = kwargs.pop('artist', None)
        super(TuneForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(TuneForm, self).save(commit=False)
        if self.artist:
            instance.artist = self.artist
        if commit:
            instance.save()
        return instance


class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'email', 'password',)


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('website', 'picture',)
        total_likes = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
        self_likes = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
        number_of_tunes_played = forms.IntegerField(widget=forms.HiddenInput(), initial=0)


# Search form
class SearchForm(forms.Form):
    query = forms.CharField(label='Search')
