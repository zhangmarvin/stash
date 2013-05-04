from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'website.views.home', name='home'),
    url(r'^ajax/(?P<data>.*)', 'website.views.ajax'),
    url(r'^admin/', include(admin.site.urls))
)
# Examples:
    # url(r'^$', 'stash.views.home', name='home'),
    # url(r'^stash/', include('stash.foo.urls')),
