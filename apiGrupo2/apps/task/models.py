from django.db import models

# Create your models here.
class Task (models.Model):
    name = models.CharField("Nombre", max_length=50, default='pending')
    state = models.BooleanField("Estado", default=False)
    

    def __str__(self):
        return f'{self.name} - {self.state}'