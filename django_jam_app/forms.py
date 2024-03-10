from django import forms
from django_jam_app.models import Tune, UserProfile
from django.contrib.auth.models import User


class TuneForm(forms.ModelForm):
    name = forms.CharField(max_length=64, help_text="Please enter the Tune's name.")
    notes = forms.CharField(max_length=64, help_text="Please enter the Tune's notes.")
    beats_per_minute = forms.IntegerField(help_text="Please enter the Tune's BPM.")
    views = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
    likes = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
    slug = forms.CharField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = Tune
        fields = ('name', 'notes', 'beats_per_minute')

    def __init__(self, *args, **kwargs):
        self.creator = kwargs.pop("creator", None)
        super(TuneForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(TuneForm, self).save(commit=False)
        if self.creator:
            instance.creator = self.creator
        if commit:
            instance.save()
        return instance


class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    confirmPassword = forms.CharField(widget=forms.PasswordInput())

    def clean(self):
        cleaned_data = super(UserForm, self).clean()
        password = cleaned_data.get('password')
        confirmPassword = cleaned_data.get('confirmPassword')

        if password != confirmPassword:
            raise forms.ValidationError("Passwords do not match.")

    class Meta:
        model = User
        fields = ('username', 'email', 'password',)


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('picture',)
        total_likes = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
        self_likes = forms.IntegerField(widget=forms.HiddenInput(), initial=0)
        number_of_tunes_played = forms.IntegerField(widget=forms.HiddenInput(), initial=0)


# Search form
class SearchForm(forms.Form):
    query = forms.CharField()
    category = forms.CharField()

    def clean(self):
        cleaned_data = super(SearchForm, self).clean()
        query = cleaned_data.get('query')
        category = cleaned_data.get('category')

        if not query and not category:
            raise forms.ValidationError("Please enter a search term or select a category.")
        if category not in ['by-user', 'by-tune']:
            raise forms.ValidationError("Invalid category.")

        return cleaned_data
