# Vamos a crear las vistas que recibirán las peticiones HTTP
from rest_framework import viewsets, permissions
from .models import Usuario, Pedido, Producto, DetallePedido, Entrega, Reporte, Notificacion
from .serializers import (
    UsuarioSerializer, PedidoSerializer, ProductoSerializer, DetallePedidoSerializer,
    EntregaSerializer, ReporteSerializer, NotificacionSerializer
)

# --- ViewSets para cada modelo ---

class UsuarioViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet para ver y editar instancias de Usuario.
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]

class ProductoViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet para ver y editar instancias de Producto.
    """
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]

class PedidoViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet para ver y editar instancias de Pedido.
    """
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.AllowAny]

class DetallePedidoViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet para ver y editar instancias de DetallePedido.
    """
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer
    permission_classes = [permissions.AllowAny]

class EntregaViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet para ver y editar instancias de Entrega.
    """
    queryset = Entrega.objects.all()
    serializer_class = EntregaSerializer
    permission_classes = [permissions.AllowAny]

class ReporteViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet para ver y editar instancias de Reporte.
    """
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [permissions.AllowAny]

class NotificacionViewSet(viewsets.ModelViewSet):
    """
    Un ViewSet para ver y editar instancias de Notificacion.
    """
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_classes = [permissions.AllowAny]