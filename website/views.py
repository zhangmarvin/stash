# Create your views here.
from hashlib import sha512
from random import randrange

from django.http import HttpResponse, HttpRequest, Http404
from django.core.exceptions import PermissionDenied
from django.template import RequestContext
from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import csrf_exempt

from website.models import *
import simplejson as json

### AJAX ###

@csrf_exempt
def login(request):
    _name = request.POST['username']
    matches = User.objects.filter(name=_name)
    if len(matches) != 1:
        return HttpResponse(json.dumps({"success": 0, "reason": "no account"}))
    
    pw = request.POST['password']
    salt = matches[0].salt
    hashed = matches[0].password
    checker = sha512()
    checker.update(pw)
    checker.update(salt)
    digest = checker.digest()
    
    digested = ""
    for char in digest:
        digested += chr(ord(char) % 128)

    
    if digested == hashed:
        request.session['id'] = matches[0].id
        request.session['username'] = _name
        #         request.session['heaps_write'] = matches[0].curators.all() 
        #         request.session['heaps_read'] = matches[0].readers.all()
        #         request.session['stashes'] = matches[0].stashes.all()
        return HttpResponse(json.dumps({"success": 1}))
    else:
        return HttpResponse(json.dumps({"success": 0, "reason": "bad password"}))
    
@csrf_exempt
def register(request):
    _name = request.POST['username']
    if len(_name) == 0:
        return HttpResponse(json.dumps({"success": 0, "reason": "username required"}))
    matches = User.objects.filter(name=_name)

    if len(matches) > 0:
        return HttpResponse(json.dumps({"success": 0, "reason": "already registered"}))
    
    pw = request.POST['password']
    if len(pw) == 0:
        return HttpResponse(json.dumps({"success": 0, "reason": "password required"}))

    raw = randrange(2 ** 512)
    _salt = ''
    for i in range(64):
        _salt += chr(((raw >> (8*i)) & 0xFF) % 128)
    _salt = unicode(_salt)
        
    hasher = sha512()
    hasher.update(pw)
    hasher.update(_salt)
    digest = hasher.digest()
    digested = ""
    for char in digest:
        digested += chr(ord(char) % 128)

    u = User(name=_name, salt =_salt, password=unicode(digested))
    u.password = u.password
    u.save()

    request.session['id'] = u.id
    request.session['username'] = _name
    #     request.session['heaps_write'] = []
    #     request.session['heaps_read'] = []
    #     request.session['stashes'] = []
    
    return HttpResponse(json.dumps({"success": 1}))

def logout(request):
    try:
        del request.session["id"]
        return HttpResponse(json.dumps({"success": 1}))
    except KeyError:
        return HttpResponse(json.dumps({"success": 0, "reason": "not logged in"}))

def make_stash(request):
    try:
        _owner = request.session["id"]
    except AttributeError:
        return HttpResponse(json.dumps({"success": 0, "reason": "not logged in"}))
    _name = request.GET["name"]
    user = User.objects.get(pk=_owner)
    for stash in user.stashes.all():
        if _name == stash.name:
            return HttpResponse(json.dumps({"success": 0, "reason": "this name has been taken"}))
    new_stash = Stash(name = _name, owner = user)
    new_stash.save()

    return HttpResponse(json.dumps({"success": 1, "id": new_stash.id}))

def make_heap(request):
    try:
        _owner = request.session["id"]
    except AttributeError:
        return HttpResponse(json.dumps({"success": 0, "reason": "not logged in"}))
    _name = request.GET["name"]
    user = User.objects.get(pk=_owner)
    new_heap = Heap(name = _name, visible = request.GET["visible"])
    new_heap.save()
    new_heap.curators.add(user)
    new_heap.readers.add(user)
    new_heap.save()

    return HttpResponse(json.dumps({"success": 1, "id": new_heap.id}))

def stash_link(request):
    try:
        _owner = request.session["id"]
    except AttributeError:
        return HttpResponse(json.dumps({"success": 0, "reason": "not logged in"}))
    
    if _type == "stash":
        targets = Stash.objects.filter(id=_s_id)
    else:
        targets = Heap.objects.filter(id=_s_id)
    if len(targets) == 0:
        return HttpResponse(json.dumps({"success": 0, "reason": "stash does not exist"}))
    target = targets[0]
    if _type == "stash":
        writeable = (target.owner == _owner)
    else:
        writeable = (owner in target.curators)
    if not writeable:
        return HttpResponse(json.dumps({"success": 0, "reason": "no write access"}))
        
    _type = request.GET["type"]
    _s_id = request.GET["stash"]
    _title = request.GET["title"]
    _url = request.GET["url"]
    c = Content(title=_title, link=_url, poster=_owner)
    c.save()
    target.content.add(c)
    target.save()
    
    return HttpResponse(json.dumps({"success": 1}))

    

### END AJAX ###


@csrf_exempt
def home(request):
    return render_to_response('index.html', request)

def user_home(request, user_id=None):
    if user_id is None:
        user_id = request.session['id']     
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise Http404
    data = {'id': user_id,
            'name': user.name,
            'stashes': user.stashes.all(),
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
