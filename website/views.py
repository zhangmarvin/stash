# Create your views here.
from django.http import HttpResponse, Http404
from django.core.exceptions import PermissionDenied
from django.template import RequestContext
from django.shortcuts import render, render_to_response

def home(request):
    return render_to_response('index.html', request)

def user_home(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise Http404
    data = {'id': user_id,
            'stashes': user.stash_set.all(),
            'heaps_write': user.curators.all(),
            'heaps_read': user.readers.all()
           }
    return render_to_response('user_home.html', RequestContext(request, data))

def stash(request, user_id, stash_id):
    try:
        user = User.objects.get(pk=user_id)
        stash = Stash.objects.get(pk=stash_id)
    except User.DoesNotExist, Stash.DoesNotExist:
        raise Http404
    if stash.owner is not user:
        raise PermissionDenied
    data = {'id': stash_id,
            'name': stash.name,
            'owner': user_id,
            'content': stash.content
           }
    return render_to_response('stash.html', RequestContext(request, data))
