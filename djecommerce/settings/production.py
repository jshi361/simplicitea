from .base import *

DEBUG = config('DEBUG', cast=bool)
ALLOWED_HOSTS = ['ip-address', 'www.your-website.com']

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'}
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': ''
    }
}

STRIPE_SECRET_KEY = 'sk_test_EhCBY3FMYLtaYAEdqXv3Iy0O00DWIWSHnT'
STRIPE_PUBLIC_KEY = 'pk_test_Iw07X8Ntb2chW8u7n7uYmBoA00toFklOqh'
STRIPE_PUBLISHABLE_KEY = 'pk_test_Iw07X8Ntb2chW8u7n7uYmBoA00toFklOqh'