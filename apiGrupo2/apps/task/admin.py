from django.contrib import admin
from .models import Task


admin.site.register(Task)
# Register your models here.
#Se registran todas las aplicaciones para que apasrezcan en la consola web