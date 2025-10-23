from django.contrib import admin
from .models import *

# Register your models here.
# Se registran todas las aplicaciones para que apasrezcan en la consola web

admin.site.register(Usuario)
admin.site.register(Pedido)
admin.site.register(Producto)
admin.site.register(DetallePedido)
admin.site.register(Entrega)
admin.site.register(Reporte)
admin.site.register(Notificacion)
