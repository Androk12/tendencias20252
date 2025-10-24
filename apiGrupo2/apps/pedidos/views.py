# Vamos a crear las vistas que recibirán las peticiones HTTP
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Usuario, Pedido, Producto, DetallePedido, Entrega, Reporte, Notificacion
from .serializers import (
    UsuarioSerializer, PedidoSerializer, ProductoSerializer, DetallePedidoSerializer,
    EntregaSerializer, ReporteSerializer, NotificacionSerializer
)
from .permissions import (
    UsuarioPermission, ProductoPermission, PedidoPermission,
    EntregaPermission, ReportePermission, NotificacionPermission,
    AdminOrVendedor, IsAdmin
)
from .pdf import *
from .json import *
from django.http import HttpResponse
# --- ViewSets para cada modelo ---


class UsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de usuarios con permisos basados en roles.

    Comportamiento por rol:
    - ADMIN: CRUD completo sobre todos los usuarios
    - VENDEDOR/REPARTIDOR: Solo lectura de usuarios
    - CLIENTE: Solo puede ver y editar su propio perfil
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [UsuarioPermission]

    def get_queryset(self):
        """
        Filtra los usuarios según el rol del usuario autenticado.
        """
        user = self.request.user

        # Admin ve todos los usuarios
        if user.role == 'ADMIN':
            return Usuario.objects.all()

        # Vendedores ven todos los usuarios (para gestión de pedidos)
        elif user.role == 'VENDEDOR':
            return Usuario.objects.all()

        # Repartidores solo ven otros repartidores y sus clientes asignados
        elif user.role == 'REPARTIDOR':
            return Usuario.objects.filter(
                Q(role='REPARTIDOR') |
                Q(role='CLIENTE', pedidos_cliente__entrega__repartidor=user)
            ).distinct()

        # Clientes solo ven su propio perfil
        elif user.role == 'CLIENTE':
            return Usuario.objects.filter(id=user.id)

        return Usuario.objects.none()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """
        Endpoint para que cualquier usuario obtenga su propia información.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class ProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de productos con permisos basados en roles.
    """
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [ProductoPermission]

    def get_queryset(self):
        """
        Todos los roles pueden ver todos los productos.
        """
        return Producto.objects.all()

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """
        Endpoint para obtener solo productos disponibles.
        Útil para clientes y repartidores.
        """
        productos = Producto.objects.filter(disponible=True, stock__gt=0)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)


class PedidoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de pedidos con permisos basados en roles.
    """
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.AllowAny]  # [PedidoPermission]

# se comento para poder probar generacion de reportes en pdf y json
    # def get_queryset(self):
    #     """
    #     Filtra los pedidos según el rol del usuario autenticado.
    #     """
    #     user = self.request.user

    #     # Admin y vendedores ven todos los pedidos
    #     if user.role in ['ADMIN', 'VENDEDOR']:
    #         return Pedido.objects.all()

    #     # Repartidores solo ven pedidos que tienen entregas asignadas a ellos
    #     elif user.role == 'REPARTIDOR':
    #         return Pedido.objects.filter(entrega__repartidor=user)

    #     # Clientes solo ven sus propios pedidos
    #     elif user.role == 'CLIENTE':
    #         return Pedido.objects.filter(cliente=user)

    #     return Pedido.objects.none()

    def perform_create(self, serializer):
        """
        Al crear un pedido, si es un cliente, automáticamente se asigna como cliente.
        """
        if self.request.user.role == 'CLIENTE':
            serializer.save(cliente=self.request.user)
        else:
            serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[AdminOrVendedor])
    def por_estado(self, request):
        
        estados = {}
        for estado_code, estado_name in Pedido.ESTADOS:
            pedidos = self.get_queryset().filter(estado=estado_code)
            serializer = self.get_serializer(pedidos, many=True)
            estados[estado_name] = serializer.data
        return Response(estados)

    @action(detail=True, methods=['patch'], permission_classes=[AdminOrVendedor])
    def cambiar_estado(self, request, pk=None):
        """
        Endpoint específico para cambiar el estado de un pedido.
        """
        pedido = self.get_object()
        nuevo_estado = request.data.get('estado')

        if nuevo_estado in [choice[0] for choice in Pedido.ESTADOS]:
            pedido.estado = nuevo_estado
            pedido.save()
            serializer = self.get_serializer(pedido)
            return Response(serializer.data)
        else:
            return Response({'error': 'Estado no válido'}, status=400)

    # api/pedidos/pdf_pedido

    @action(detail=True, methods=["get"], url_path="pdf_pedido")
    def pdf_pedido(self, request, pk=None):
        pedido = self.get_object()
        data = generar_pdf_pedido(pedido)
        resp = HttpResponse(data, content_type='application/pdf')
        resp['Content-Disposition'] = f'attachment; filename="pedido_{pedido.id}.pdf"'
        return resp
# api/pedidos/pdf_todos

    @action(detail=False, methods=["get"], url_path="pdf_todos")
    def pdf_todos_pedidos(self, request):
        pedidos = self.filter_queryset(self.get_queryset())
        data = generar_pdf_de_pedidos(pedidos)
        resp = HttpResponse(data, content_type='application/pdf')
        resp['Content-Disposition'] = f'inline; filename="todos_pedidos.pdf"'
        return resp
# api/pedidos/json

    @action(detail=False, methods=["get"], url_path="json")
    def json_todos_pedidos(self, request):
        pedidos = self.get_queryset()
        data = generar_json_de_pedidos(pedidos)
        resp = HttpResponse(data, content_type='application/json')
        resp['Content-Disposition'] = f'inline; filename="reporte.json"'
        return resp


class DetallePedidoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de detalles de pedidos.
    """
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer
    permission_classes = [PedidoPermission]  # Reutiliza permisos de pedido

    def get_queryset(self):
        """
        Filtra los detalles según los pedidos que el usuario puede ver.
        """
        user = self.request.user

        if user.role in ['ADMIN', 'VENDEDOR']:
            return DetallePedido.objects.all()
        elif user.role == 'REPARTIDOR':
            return DetallePedido.objects.filter(pedido__entrega__repartidor=user)
        elif user.role == 'CLIENTE':
            return DetallePedido.objects.filter(pedido__cliente=user)

        return DetallePedido.objects.none()


class EntregaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de entregas con permisos basados en roles.
    """
    queryset = Entrega.objects.all()
    serializer_class = EntregaSerializer
    permission_classes = [EntregaPermission]

    def get_queryset(self):
        """
        Filtra las entregas según el rol del usuario autenticado.
        """
        user = self.request.user

        # Admin ve todas las entregas
        if user.role == 'ADMIN':
            return Entrega.objects.all()

        # Vendedores ven todas las entregas (solo lectura)
        elif user.role == 'VENDEDOR':
            return Entrega.objects.all()

        # Repartidores solo ven sus entregas asignadas
        elif user.role == 'REPARTIDOR':
            return Entrega.objects.filter(repartidor=user)

        # Clientes solo ven entregas de sus pedidos
        elif user.role == 'CLIENTE':
            return Entrega.objects.filter(pedido__cliente=user)

        return Entrega.objects.none()

    def perform_create(self, serializer):
        """
        Al crear una entrega, si es un repartidor, se asigna automáticamente.
        """
        if self.request.user.role == 'REPARTIDOR':
            serializer.save(repartidor=self.request.user)
        else:
            serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mis_entregas(self, request):
        """
        Endpoint para que repartidores obtengan sus entregas.
        """
        if request.user.role == 'REPARTIDOR':
            entregas = Entrega.objects.filter(repartidor=request.user)
            serializer = self.get_serializer(entregas, many=True)
            return Response(serializer.data)
        else:
            return Response({'error': 'Solo repartidores pueden acceder a este endpoint'}, status=403)

    @action(detail=True, methods=['patch'])
    def actualizar_estado(self, request, pk=None):
        """
        Endpoint para actualizar el estado de una entrega.
        """
        entrega = self.get_object()
        nuevo_estado = request.data.get('estado')

        if nuevo_estado in [choice[0] for choice in Entrega.ESTADOS_ENTREGA]:
            entrega.estado = nuevo_estado
            entrega.save()

            # Si se marca como entregado, actualizar el pedido
            if nuevo_estado == 'ENTREGADO':
                entrega.pedido.estado = 'ENTREGADO'
                entrega.pedido.save()

            serializer = self.get_serializer(entrega)
            return Response(serializer.data)
        else:
            return Response({'error': 'Estado no válido'}, status=400)


class ReporteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de reportes con permisos basados en roles.
    """
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [ReportePermission]

    def get_queryset(self):
        """
        Filtra los reportes según el rol del usuario autenticado.
        """
        user = self.request.user

        # Admin ve todos los reportes
        if user.role == 'ADMIN':
            return Reporte.objects.all()

        # Vendedores solo ven sus propios reportes
        elif user.role == 'VENDEDOR':
            return Reporte.objects.filter(usuario=user)

        # Otros roles no tienen acceso
        return Reporte.objects.none()

    def perform_create(self, serializer):
        """
        Al crear un reporte, automáticamente se asigna el usuario autenticado.
        """
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['post'], permission_classes=[IsAdmin])
    def generar_reporte_general(self, request):
        """
        Endpoint para generar reportes generales del sistema.
        """
        # Aquí implementarías la lógica para generar reportes automáticos
        # Por ejemplo, reportes de ventas, entregas, etc.
        return Response({'mensaje': 'Funcionalidad de reporte general pendiente de implementación'})


class NotificacionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de notificaciones con permisos basados en roles.
    """
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    permission_classes = [NotificacionPermission]

    def get_queryset(self):
        """
        Filtra las notificaciones según el rol del usuario autenticado.
        """
        user = self.request.user

        # Admin ve todas las notificaciones
        if user.role == 'ADMIN':
            return Notificacion.objects.all()

        # Clientes ven notificaciones de sus pedidos
        elif user.role == 'CLIENTE':
            return Notificacion.objects.filter(pedido__cliente=user)

        # Repartidores ven notificaciones de pedidos que entregan
        elif user.role == 'REPARTIDOR':
            return Notificacion.objects.filter(pedido__entrega__repartidor=user)

        # Vendedores ven todas las notificaciones (son staff)
        elif user.role == 'VENDEDOR':
            return Notificacion.objects.all()

        return Notificacion.objects.none()

    @action(detail=True, methods=['patch'])
    def marcar_visto(self, request, pk=None):
        """
        Endpoint para marcar una notificación como vista.
        """
        notificacion = self.get_object()
        notificacion.visto = True
        notificacion.save()
        serializer = self.get_serializer(notificacion)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def no_vistas(self, request):
        """
        Endpoint para obtener notificaciones no vistas del usuario.
        """
        notificaciones = self.get_queryset().filter(visto=False)
        serializer = self.get_serializer(notificaciones, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[AdminOrVendedor])
    def crear_notificacion_masiva(self, request):
        """
        Endpoint para crear notificaciones masivas.
        """
        # Aquí implementarías la lógica para enviar notificaciones masivas
        return Response({'mensaje': 'Funcionalidad de notificación masiva pendiente de implementación'})
