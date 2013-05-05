from django.db import models

# Create your models.Models here.

class User(models.Model):
    name = models.CharField(max_length=30)
    salt = models.CharField(max_length=8)
    password = models.CharField(max_length=64) # output of hashlib.sha512()
    
class Content(models.Model):
    title = models.CharField(max_length=30)
    link = models.TextField()
    poster = models.ForeignKey(User, related_name = 'posts')
    date_posted = models.DateTimeField(auto_add_now=True)

class Heap(models.Model):
    name = models.CharField(max_length=30)
    content = models.ManyToManyField(Content)
    curators = models.ManyToManyField(User, related_name = 'curators')
    readers = models.ManyToManyField(User, related_name = 'readers')
    visible = models.BooleanField()

class Stash(models.Model):
    name = models.CharField(max_length=30)
    content = models.ManyToManyField(Content)
    owner = models.ForeignKey(User, related_name = 'stashes')
    takes_from = models.ManyToManyField(Heap)
