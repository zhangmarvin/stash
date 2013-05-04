from django.db import models

# Create your models here.

class User(models.Model):
    name = Model.CharField(max_length=30)
    salt = Model.CharField(max_length=5)
    passwd = Model.CharField(max_length=50)
    
