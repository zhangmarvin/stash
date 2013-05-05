from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'website.views.home', name='home'),
                       
    url(r'^ajax/login', 'website.views.login'),
    url(r'^ajax/register', 'website.views.register'),
    url(r'^ajax/logout', 'website.views.logout'),
    url(r'^ajax/stash_link', 'website.views.stash_link'),
    url(r'^ajax/throw_link', 'website.views.throw_link'),
    url(r'^ajax/toggle_take', 'website.views.toggle_take'),
    url(r'^ajax/(?P<data>.*)', 'website.views.ajax'),
                       
    url(r'^admin/', include(admin.site.urls))
)
# Examples:
    # url(r'^$', 'stash.views.home', name='home'),
    # url(r'^stash/', include('stash.foo.urls')),
