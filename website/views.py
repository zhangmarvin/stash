# Create your views here.
from hashlib import sha512
from random import randrange

from django.http import HttpResponse, Http404
from django.core.exceptions import PermissionDenied
from django.template import RequestContext
from django.shortcuts import render, render_to_response
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt

from website.models import *

@csrf_exempt
def home(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('index.html', c)

def login(request):
    name = request.POST['username']
    matches = User.objects.filter(username=name)
    if len(matches) != 1:
        return HttpResponse(str({'success': 'false', 'reason': 'no account'}))
    
    pw = request.POST['password']
    salt = matches[0].salt
    hashed = matches[0].password
    checker = sha512()
    checker.update(pw)
    checker.update(salt)
    
    if checker.digest() == hashed:
        return HttpResponse(str({'success': 'true'}))
    else:
        return HttpResponse(str({'success': 'false', 'reason': 'bad password'}))
    
def register(request):
    _name = request.POST['username']
    matches = User.objects.filter(username=_name)
    if len(matches) > 0:
        return HttpResponse(str({'success': 'false', 'reason': 'already registered'}))
    
    pw = request.POST['password']
    if len(pw) == 0:
        return HttpResponse(str({'success': 'false', 'reason': 'password required'}))

    raw = randrange(2 ** 512)
    salt = ''
    for i in range(512/8):
        salt += chr((raw >> (8*i)) & 0xFF)
        
    hasher = sha512()
    hasher.update(pw)
    hasher.update(salt)

    u = User(name=_name, salt=_salt, password=hasher.digest())
    u.save()
    
    return HttpResponse(str({'success': 'true'}))

def user_home(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise Http404
    data = {'id': user_id,
            'stashes': user.stash_set.all(),
            'heaps_write': user.curators.all(),
            'heaps_read': user.readers.all(),
            'range': range(3)
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
            'content': stash.content.all()
           }
    return render_to_response('stash.html', RequestContext(request, data))

def heap(request, user_id, heap_id):
    try:
        user = User.objects.get(pk=user_id)
        all_users = User.objects.get(pk=0)
        heap = Heap.objects.get(pk=user_id)
    except User.DoesNotExist, Heap.DoesNotExist:
        raise Http404
    curators_list = heap.curators.all()
    if user not in curators_list and all_users not in curators_list:
        raise PermissionDenied
    readers_list = heap.readers.all()
    if user not in readers_list and all_users not in readers_list:
        raise PermissionDenied
    data = {'id': heap_id,
            'name': heap.name,
            'curators': curators_list,
            'readers': readers_list,
            'content': heap.content.all()
           }
    return render_to_response('heap.html', RequestContext(request, data))

def ajax(request, data='default'):
    return HttpResponse('nothing, except for ' + data)
