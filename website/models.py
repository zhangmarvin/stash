from django.db import models

# Create your models here.

class User(models.Model):
    name = Model.CharField(max_length=30)
    salt = Model.CharField(max_length=5)
    password = Model.CharField(max_length=50)
    
class Stash(models.Model):
    name = Models.CharField(max_length=30)
    content = models.ManyToManyField(Content)
    owner = models.ForeignKey(User)
    takes_from = ManyToManyField(Heap)

class Heap(models.Model):
    name = Models.CharField(max_length=30)
    content = models.ManyToManyField(Content)
    curators = models.ManyToManyField(User, related_name = 'curators')
    readers = models.ManyToManyField(User, related_name = 'readers')
    visible = models.BooleanField()

class Content(models.Model):
    title = Models.CharField(max_length=30)
    link = Models.TextField()
    description = Models.TextField()
    date_posted = Models.DateTimeField()
