from django.test import TestCase, Client
from django.template import Template, Context
from django.template.exceptions import TemplateSyntaxError
from django.contrib.admin.sites import AdminSite
from django_jam_app.admin import TuneAdmin
from django_jam_app.models import Tune, UserProfile
from django.contrib.auth.models import User
from django.urls import reverse
from django_jam_app.forms import TuneForm, UserForm, UserProfileForm, SearchForm
import os



class TemplateCompilationTest(TestCase):
    def test_template_compilation(self):
        template_dir = os.path.join(os.path.dirname(__file__), "templates")
        for root, dirs, files in os.walk(template_dir):
            for file in files:
                if file.endswith(".html"):
                    template_path = os.path.join(root, file)
                    with open(template_path, "r") as f:
                        template_string = f.read()
                    try:
                        Template(template_string).render(Context())
                    except TemplateSyntaxError as e:
                        self.fail(f"Template '{template_path}' failed to compile: {e}")


class TuneAdminTests(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = TuneAdmin(Tune, self.site)

    def test_prepopulated_fields(self):
        self.assertEqual(self.admin.prepopulated_fields, {"slug": ("name",)})

    def test_admin_instance(self):
        self.assertIsInstance(self.admin, TuneAdmin)

    def test_admin_model(self):
        self.assertEqual(self.admin.model, Tune)

    def test_admin_site(self):
        self.assertEqual(self.admin.admin_site, self.site)


class ViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.user_profile = UserProfile.objects.create(user=self.user, slug="testuser")

    def test_index_view(self):
        response = self.client.get(reverse("django_jam_app:index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Jam your heart out with django!")

    def test_about_view(self):
        response = self.client.get(reverse("django_jam_app:about"))
        self.assertEqual(response.status_code, 200)

    def test_create_view(self):
        self.client.login(username="testuser", password="testpassword")
        response = self.client.get(reverse("django_jam_app:create"))
        self.assertEqual(response.status_code, 200)

    def test_register_view(self):
        response = self.client.get(reverse("django_jam_app:register"))
        self.assertEqual(response.status_code, 200)

    def test_login_view(self):
        response = self.client.get(reverse("django_jam_app:login"))
        self.assertEqual(response.status_code, 200)

    def test_explore_view(self):
        response = self.client.get(reverse("django_jam_app:explore"))
        self.assertEqual(response.status_code, 200)

    def test_logout_view(self):
        response = self.client.get(reverse("django_jam_app:logout"))
        self.assertEqual(response.status_code, 302)  # Should redirect

    def test_profile_view(self):
        response = self.client.get(
            reverse("django_jam_app:profile", args=[self.user_profile.slug])
        )
        self.assertEqual(response.status_code, 200)

    def test_like_tune_view(self):
        tune = Tune.objects.create(
            name="Test Tune", notes="CDEFG", creator=self.user, slug="test-tune"
        )
        response = self.client.post(reverse("django_jam_app:like_tune", args=[tune.ID]))
        self.assertEqual(response.status_code, 200)

    def test_delete_account_view(self):
        self.client.login(username="testuser", password="testpassword")
        response = self.client.post(reverse("django_jam_app:delete_account"))
        self.assertEqual(response.status_code, 302)  # Should redirect

    def test_delete_tune_view(self):
        tune = Tune.objects.create(
            name="Test Tune", notes="CDEFG", creator=self.user, slug="test-tune"
        )
        response = self.client.post(
            reverse("django_jam_app:delete_tune", args=[tune.ID])
        )
        self.assertEqual(response.status_code, 302)  # Should redirect

    def test_played_tune_view(self):
        response = self.client.get(reverse("django_jam_app:played_tune"))
        self.assertEqual(response.status_code, 200)


class FormTests(TestCase):
    def test_tune_form_valid(self):
        form_data = {
            "name": "Test Tune",
            "notes": "C#4",
            "beats_per_minute": 120,
            "views": 0,
            "likes": 0,
            "slug": "test-tune",
        }
        form = TuneForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_tune_form_invalid(self):
        form_data = {
            "name": "Test Tune",
            "notes": "Test Notes",
            "beats_per_minute": 120,
        }
        form = TuneForm(data=form_data)
        self.assertFalse(form.is_valid())

    def test_user_form_valid(self):
        form_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword",
            "confirmPassword": "testpassword",
        }
        form = UserForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_user_form_invalid(self):
        form_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword",
            "confirmPassword": "wrongpassword",  # Intentionally wrong password confirmation
        }
        form = UserForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn("Passwords do not match.", form.errors["__all__"])

    def test_user_profile_form_valid(self):
        form_data = {
            "picture": "test.jpg",
            "total_likes": 10,
            "self_likes": 5,
            "number_of_tunes_played": 20,
        }
        form = UserProfileForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_search_form_valid(self):
        form_data = {"query": "test", "category": "by-user"}
        form = SearchForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_search_form_invalid(self):
        form_data = {
            "query": "",
            "category": "",  # Intentionally empty to test validation error
        }
        form = SearchForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn(
            "Please enter a search term or select a category.", form.errors["__all__"]
        )
