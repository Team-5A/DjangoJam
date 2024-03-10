from django.shortcuts import render
from django_jam_app.models import Tune, UserProfile
from django_jam_app.forms import TuneForm, UserForm, UserProfileForm, SearchForm
from django.shortcuts import redirect, get_object_or_404
from django.urls import reverse
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from django.http import JsonResponse

from datetime import datetime


# Create your views here.
def index(request):
    # tune_list = Tune.objects.order_by('-likes')[:5]
    # page_list = Page.objects.order_by('-views')[:5]
    context_dict = {}
    context_dict['boldmessage'] = 'Django Jam Works'
    # context_dict['tunes'] = tune_list
    # context_dict['pages'] = page_list

    visitor_cookie_handler(request)

    response = render(request, 'django_jam_app/index.html', context=context_dict)

    return response


def about(request):
    context_dict = {}
    visitor_cookie_handler(request)
    context_dict['visits'] = request.session['visits']

    return render(request, 'django_jam_app/about.html', context=context_dict)


def show_tune(request, tune_name_slug):
    context_dict = {}
    try:
        tune = Tune.objects.get(slug=tune_name_slug)
        context_dict['tune'] = tune

    except Tune.DoesNotExist:

        context_dict['tune'] = None

        return render(request, 'django_jam_app/tune.html', context=context_dict)


# @login_required
def add_tune(request):
    form = TuneForm()

    if request.method == 'POST':
        form = TuneForm(request.POST, creator=request.user)

        if form.is_valid():

            form.save(commit=True)

            return redirect('/django_jam_app/')
        else:
            print(form.errors)

    return render(request, 'django_jam_app/add_tune.html', {'form': form})


def register(request):
    registered = False

    errors = []

    if request.method == 'POST':

        user_form = UserForm(request.POST)
        profile_form = UserProfileForm(request.POST)

        if user_form.is_valid() and profile_form.is_valid():

            user = user_form.save()

            user.set_password(user.password)
            user.save()

            profile = profile_form.save(commit=False)
            profile.user = user

            if 'picture' in request.FILES:
                profile.picture = request.FILES['picture']

            profile.save()

            login(request, user)
            lower_case_username = user.username.lower()
            return redirect(reverse('django_jam_app:profile', args=[lower_case_username]))
        else:
            errors.append(user_form.errors)
            errors.append(profile_form.errors)
    else:

        user_form = UserForm()
        profile_form = UserProfileForm()
    
    error_key = ""
    error = ""
    if len(errors) > 0:
        error_key = list(errors[0].keys())[0]
        error = f"{'error' if error_key.startswith('__') else error_key}: {errors[0][error_key][0].lower()}"
    
    return render(request, 'django_jam_app/register.html',
                  context={'user_form': user_form, 'profile_form': profile_form,
                           'registered': registered, 'has_error': len(errors) > 0, 'error': error  })


def user_login(request):
    if request.method == 'POST':

        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)

        if user:

            if user.is_active:

                login(request, user)
                lower_case_username = user.username.lower()
                return redirect(reverse('django_jam_app:profile', args=[lower_case_username]))
            else:

                return render(request, 'django_jam_app/login.html', context={
                    'has_error': True,
                    'error': 'Your DjangoJam account is disabled.',
                }) 
        else:
            return render(request, 'django_jam_app/login.html', context={
                'has_error': True,
                'error': 'Invalid login details.',
            }) 

    else:


        return render(request, 'django_jam_app/login.html', context={
            'has_error': False,
            'error': '',
        })


def profile(request, slug):
    context_dict = {}
    # Retrieve the user profile based on the slug
    user_profile = get_object_or_404(UserProfile, slug=slug)
    context_dict['user_profile'] = user_profile
    return render(request, 'django_jam_app/profile.html', context=context_dict)


def explore(request):
    form = SearchForm(request.GET)
    tunes = []

    if form.is_valid():
        query = form.cleaned_data['query']
        category = form.cleaned_data['category']

        if category == 'by-user':
            tunes = Tune.objects.filter(creator__username__icontains=query)
        elif category == 'by-tune':
            tunes = Tune.objects.filter(name__icontains=query)

    return render(request, 'django_jam_app/explore.html',
                  {'form': form, 'tunes': tunes})


@login_required
def user_logout(request):
    logout(request)

    return redirect(reverse('django_jam_app:index'))


def get_server_side_cookie(request, cookie, default_val=None):
    val = request.session.get(cookie)
    if not val:
        val = default_val
    return val


def visitor_cookie_handler(request):
    visits = int(get_server_side_cookie(request, 'visits', '1'))
    last_visit_cookie = get_server_side_cookie(request, 'last_visit', str(datetime.now()))
    last_visit_time = datetime.strptime(last_visit_cookie[:-7], '%Y-%m-%d %H:%M:%S')

    if (datetime.now() - last_visit_time).days > 0:
        visits = visits + 1

        request.session['last_visit'] = str(datetime.now())
    else:

        request.session['last_visit'] = last_visit_cookie

    request.session['visits'] = visits


def like_tune(request, tune_id):
    if not request.user.is_authenticated:
        return JsonResponse({'likes': -1})

    tune = Tune.objects.get(ID=tune_id)
    tune.likes = tune.likes + 1
    tune.creator.userprofile.total_likes += 1
    request.user.userprofile.self_likes = request.user.userprofile.self_likes + 1
    request.user.userprofile.save()
    tune.creator.userprofile.save()
    tune.save()

    return JsonResponse({'likes': tune.likes})


def unlike_tune(request, tune_id):
    if not request.user.is_authenticated:
        return JsonResponse({'likes': -1})

    tune = Tune.objects.get(ID=tune_id)
    tune.likes = max(0, tune.likes - 1)
    tune.creator.userprofile.total_likes = max(0, tune.creator.userprofile.total_likes - 1)
    request.user.userprofile.self_likes = max(0, request.user.userprofile.self_likes - 1)
    request.user.userprofile.save()
    tune.creator.userprofile.save()
    tune.save()

    return JsonResponse({'likes': tune.likes})


def delete_account(request):
    user = request.user
    if user.is_authenticated:
        user.delete()
    
    logout(request)

    return redirect(reverse('django_jam_app:index'))

def delete_tune(request, tuneid):
    tune = get_object_or_404(Tune, ID=tuneid)

    if tune.creator != request.user or not request.user.is_authenticated:
        return HttpResponse('You are not authorized to delete this tune.', status=403)

    tune.delete()

    return redirect(reverse('django_jam_app:index'))
