from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from .views import AccountView, SignUpView, MyProgressView, LogoutView, PasswordResetView, PasswordResetDoneView, \
    PasswordResetConfirmView, PasswordChangeDoneView

app_name = 'account'
urlpatterns = [
    url('mon-compte/', AccountView.as_view(), name='mon-compte'),
    url('logout/', LogoutView.as_view(), name='logout'),
    url('signup/', SignUpView.as_view(), name='signup'),
    url(r'forgot-password/', PasswordResetView.as_view(
                                                       email_template_name='email_templates'
                                                                           '/reset_password_email.html', ),
        name="password_change"),
    url(r'forgot-password-done/', PasswordResetDoneView.as_view(),
        name="password_reset_done"),
    url(r'password-change-done/', PasswordChangeDoneView.as_view(),
        name="password_change_done"),
    url(r'forgot-passwordreset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/',
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm"),
    url('my-progress', login_required(MyProgressView.as_view(), login_url='/user/login'), name='myprogress'),
]