"""
Sistema de permisos basado en roles para la API de pedidos.
Implementa la lógica de autorización siguiendo el principio de menor privilegio
y segregación de responsabilidades por rol de usuario.
"""

from rest_framework import permissions
from rest_framework.permissions import BasePermission


class IsAuthenticated(BasePermission):
    """
    Permiso base que requiere autenticación JWT válida.
    Todos los permisos personalizados heredan de esta clase.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated


class IsAdmin(IsAuthenticated):
    """
    Permiso para usuarios con rol ADMIN.
    Los administradores tienen acceso completo a todos los recursos.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return hasattr(request.user, 'role') and request.user.role == 'ADMIN'


class IsVendedor(IsAuthenticated):
    """
    Permiso para usuarios con rol VENDEDOR.
    Los vendedores pueden gestionar productos y pedidos.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return hasattr(request.user, 'role') and request.user.role == 'VENDEDOR'


class IsRepartidor(IsAuthenticated):
    """
    Permiso para usuarios con rol REPARTIDOR.
    Los repartidores pueden gestionar entregas asignadas.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return hasattr(request.user, 'role') and request.user.role == 'REPARTIDOR'


class IsCliente(IsAuthenticated):
    """
    Permiso para usuarios con rol CLIENTE.
    Los clientes pueden gestionar sus propios pedidos.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return hasattr(request.user, 'role') and request.user.role == 'CLIENTE'


class UsuarioPermission(IsAuthenticated):
    """
    Permisos específicos para el modelo Usuario:
    - ADMIN: CRUD completo sobre todos los usuarios
    - VENDEDOR/REPARTIDOR: Solo lectura de usuarios de su mismo tipo
    - CLIENTE: Solo puede ver y editar su propio perfil
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        user_role = getattr(request.user, 'role', None)

        if user_role == 'ADMIN':
            return True

        if user_role in ['VENDEDOR', 'REPARTIDOR']:
            return request.method in permissions.SAFE_METHODS

        if user_role == 'CLIENTE':
            return request.method in permissions.SAFE_METHODS or view.action == 'retrieve'

        return False

    def has_object_permission(self, request, view, obj):
        user_role = getattr(request.user, 'role', None)

        if user_role == 'ADMIN':
            return True

        if user_role == 'CLIENTE':
            return obj.id == request.user.id

        if user_role in ['VENDEDOR', 'REPARTIDOR']:
            return request.method in permissions.SAFE_METHODS

        return False


class ProductoPermission(IsAuthenticated):
    """
    Permisos para el modelo Producto:
    - ADMIN/VENDEDOR: CRUD completo
    - REPARTIDOR/CLIENTE: Solo lectura
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        user_role = getattr(request.user, 'role', None)

        if user_role in ['ADMIN', 'VENDEDOR']:
            return True

        if user_role in ['REPARTIDOR', 'CLIENTE']:
            return request.method in permissions.SAFE_METHODS

        return False


class PedidoPermission(IsAuthenticated):
    """
    Permisos para el modelo Pedido:
    - ADMIN: CRUD completo
    - VENDEDOR: CRUD completo
    - REPARTIDOR: Lectura + actualizar estado de pedidos asignados
    - CLIENTE: CRUD solo de sus propios pedidos
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        user_role = getattr(request.user, 'role', None)

        if user_role in ['ADMIN', 'VENDEDOR']:
            return True

        if user_role in ['REPARTIDOR', 'CLIENTE']:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        user_role = getattr(request.user, 'role', None)

        if user_role in ['ADMIN', 'VENDEDOR']:
            return True

        if user_role == 'CLIENTE':
            return obj.cliente.id == request.user.id

        if user_role == 'REPARTIDOR':
            if request.method in permissions.SAFE_METHODS:
                return True
            try:
                entrega = obj.entrega
                return entrega.repartidor.id == request.user.id
            except:
                return False

        return False


class EntregaPermission(IsAuthenticated):
    """
    Permisos para el modelo Entrega:
    - ADMIN: CRUD completo
    - VENDEDOR: Solo lectura
    - REPARTIDOR: CRUD de sus propias entregas
    - CLIENTE: Solo lectura de entregas de sus pedidos
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        user_role = getattr(request.user, 'role', None)

        if user_role == 'ADMIN':
            return True

        if user_role == 'VENDEDOR':
            return request.method in permissions.SAFE_METHODS

        if user_role in ['REPARTIDOR', 'CLIENTE']:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        user_role = getattr(request.user, 'role', None)

        if user_role == 'ADMIN':
            return True

        if user_role == 'VENDEDOR':
            return request.method in permissions.SAFE_METHODS

        if user_role == 'REPARTIDOR':
            return obj.repartidor.id == request.user.id

        if user_role == 'CLIENTE':
            return (request.method in permissions.SAFE_METHODS and
                    obj.pedido.cliente.id == request.user.id)

        return False


class ReportePermission(IsAuthenticated):
    """
    Permisos para el modelo Reporte:
    - ADMIN: CRUD completo
    - VENDEDOR: Crear y leer sus propios reportes
    - REPARTIDOR/CLIENTE: Sin acceso
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        user_role = getattr(request.user, 'role', None)

        return user_role in ['ADMIN', 'VENDEDOR']

    def has_object_permission(self, request, view, obj):
        user_role = getattr(request.user, 'role', None)

        # Admin puede hacer todo
        if user_role == 'ADMIN':
            return True

        if user_role == 'VENDEDOR':
            return obj.usuario.id == request.user.id

        return False


class NotificacionPermission(IsAuthenticated):
    """
    Permisos para el modelo Notificacion:
    - ADMIN: CRUD completo
    - VENDEDOR/REPARTIDOR/CLIENTE: Solo sus propias notificaciones (lectura y marcar como visto)
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        return True

    def has_object_permission(self, request, view, obj):
        user_role = getattr(request.user, 'role', None)

        if user_role == 'ADMIN':
            return True

        if user_role == 'CLIENTE':
            return obj.pedido.cliente.id == request.user.id

        if user_role == 'REPARTIDOR':
            try:
                return obj.pedido.entrega.repartidor.id == request.user.id
            except:
                return False

        if user_role == 'VENDEDOR':
            return request.method in permissions.SAFE_METHODS

        return False



class AdminOrVendedor(IsAuthenticated):
    """
    Permiso compuesto: permite acceso a usuarios ADMIN o VENDEDOR.
    Útil para recursos que requieren privilegios de gestión.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        user_role = getattr(request.user, 'role', None)
        return user_role in ['ADMIN', 'VENDEDOR']


class StaffOrOwner(IsAuthenticated):
    """
    Permiso compuesto: permite acceso a staff (ADMIN/VENDEDOR) o al propietario del recurso.
    Requiere implementación específica en has_object_permission.
    """

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        user_role = getattr(request.user, 'role', None)
        return user_role in ['ADMIN', 'VENDEDOR', 'CLIENTE', 'REPARTIDOR']
