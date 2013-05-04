# Create your views here.
from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render, render_to_response

def home(request):
    return render_to_response('index.html', request)

def ajax(request, data='default'):
    return HttpResponse('nothing, except for ' + data)
