from asiakeo.settings.settings import *


DEBUG = True

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases


SECRET_KEY = 'fa8yyh2qr7sc929vxh*sztwxw4#f1mj9^s_k6==+zag&19_r9k'

# SECURITY WARNING: update this when you have the production host
ALLOWED_HOSTS = ['0.0.0.0', 'localhost', '127.0.0.1']

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'