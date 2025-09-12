# Vamos a crear las rutas para nuestra API de Pedidos
from rest_framework.routers import DefaultRouter
from apps.pedidos.views import *


# Crearemos el DefaultRouter (esto nos crea las rutas automáticamente)
router_api = DefaultRouter()

# Registramos el viewset de Pedidos con el basename 'pedidos' que se usará para nombrar las rutas
router_api.register(r'pedidos', PedidoViewSet, basename='pedidos')


