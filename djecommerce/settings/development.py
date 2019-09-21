from .base import *

DEBUG = True
ALLOWED_HOSTS = ['127.0.0.1']

INSTALLED_APPS += [
    'debug_toolbar',
    

]

MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware', ]

# DEBUG TOOLBAR SETTINGS

DEBUG_TOOLBAR_PANELS = [
    'debug_toolbar.panels.versions.VersionsPanel',
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    'debug_toolbar.panels.request.RequestPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.staticfiles.StaticFilesPanel',
    'debug_toolbar.panels.templates.TemplatesPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.signals.SignalsPanel',
    'debug_toolbar.panels.logging.LoggingPanel',
    'debug_toolbar.panels.redirects.RedirectsPanel',
]


def show_toolbar(request):
    return True


DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False,
    'SHOW_TOOLBAR_CALLBACK': show_toolbar
}


DATABASES = {
     'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'qqrt1234',
        'HOST': '127.0.0.1',
        'PORT': '5432'
    }
}


# DATABASES = {
#      'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'MySQL80',
#         'USER': 'root',
#         'PASSWORD': 'qqrt1234',
#         'HOST': '127.0.0.1',
#         'PORT': '3306'
#     }
# }

STRIPE_SECRET_KEY = 'sk_test_EhCBY3FMYLtaYAEdqXv3Iy0O00DWIWSHnT'
STRIPE_PUBLIC_KEY = 'pk_test_Iw07X8Ntb2chW8u7n7uYmBoA00toFklOqh'
STRIPE_PUBLISHABLE_KEY = 'pk_test_Iw07X8Ntb2chW8u7n7uYmBoA00toFklOqh'