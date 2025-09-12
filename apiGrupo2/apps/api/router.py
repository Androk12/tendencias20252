# Vamos a crear las rutas para nuestra API de Pedidos
from rest_framework.routers import DefaultRouter
from apps.pedidos.views import (
    UsuarioViewSet, PedidoViewSet, ProductoViewSet, DetallePedidoViewSet,
    EntregaViewSet, ReporteViewSet, NotificacionViewSet
)


# Crearemos el DefaultRouter (esto nos crea las rutas automáticamente)
router_api = DefaultRouter()

# Registramos una ruta para cada ViewSet
router_api.register(r'usuarios', UsuarioViewSet, basename='usuarios')
router_api.register(r'productos', ProductoViewSet, basename='productos')
router_api.register(r'pedidos', PedidoViewSet, basename='pedidos')
router_api.register(r'detalles-pedido', DetallePedidoViewSet, basename='detalles-pedido')
router_api.register(r'entregas', EntregaViewSet, basename='entregas')
router_api.register(r'reportes', ReporteViewSet, basename='reportes')
router_api.register(r'notificaciones', NotificacionViewSet, basename='notificaciones')


