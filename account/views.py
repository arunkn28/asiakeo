from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth import views as auth_views
from django.utils.decorators import method_decorator
from django.views import View
from django.urls import reverse

from .models import Profile
from django.shortcuts import render
from .decorators import unauthenticated_user
from products.models import Category


class BaseView(View):
    def __init__(self):
        self.context_dict = {}
        categories = Category.objects.filter(show_on_header=True)
        self.context_dict['categories'] = categories



class AccountView(BaseView):
    def get(self, request):
        return render(request, 'my-account.html')

    def post(self, request):
        data = request.POST
        username = data['username']
        password = data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return HttpResponseRedirect(reverse('account:mon-compte'))
        else:
            return render(request, 'my-account.html', {'error': "Either username or password is incorrect"})



class SignUpView(BaseView):
    def post(self, request):
        data = request.POST
        try:
            if data['pass1'] != data['pass2']:
                raise Exception
            profile = Profile.objects.create_user(data)
            login(request, profile.user)
            return HttpResponseRedirect(reverse('account:mon-compte'))
        except Exception as e:
            return render(request, 'account:mon-compte', {"error": "Registeration Failed"})


class PasswordResetView(auth_views.PasswordResetView):
    @property
    def template_name(self):
        return 'forgotpassword.html'

    @property
    def success_url(self):
        return reverse('user:password_reset_done')


class PasswordResetConfirmView(auth_views.PasswordResetConfirmView):
    @property
    def template_name(self):
        return 'resetPassword.html'

    @property
    def success_url(self):
        return reverse('user:password_change_done')


class PasswordResetDoneView(auth_views.PasswordResetDoneView):
    @property
    def template_name(self):
        return 'password-reset-email-sent.html'


class PasswordChangeDoneView(View):
    def get(self, request):
        return render(request, 'login.html', {"password_change_msg": "Successfully changed password"})


class MyProgressView(View):
    def get(self, request):
        return render(request, "home/my_progress.html")

    def post(self, request):
        data = request.POST
        user = request.user
        email_changed = data['email'] != user.email
        user.email = data['email']
        user.profile.phone_number = data['phone']
        user.save()
        user.profile.save()
        if email_changed:
            update_session_auth_hash(request, user)
        return HttpResponseRedirect(reverse('user:myprogress'))


class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect(reverse('user:login'))