from django.db import models

# Create your models.Models here.

class Content(models.Model):
    title = models.CharField(max_length=30)
    link = models.TextField()
    description = models.TextField()
    date_posted = models.DateTimeField()

class User(models.Model):
    name = models.CharField(max_length=30)
    salt = models.CharField(max_length=5)
    password = models.CharField(max_length=50)
    
class Heap(models.Model):
    name = models.CharField(max_length=30)
    content = models.ManyToManyField(Content)
    curators = models.ManyToManyField(User, related_name = 'curators')
    readers = models.ManyToManyField(User, related_name = 'readers')
    visible = models.BooleanField()

class Stash(models.Model):
    name = models.CharField(max_length=30)
    content = models.ManyToManyField(Content)
    owner = models.ForeignKey(User)
    takes_from = models.ManyToManyField(Heap)
