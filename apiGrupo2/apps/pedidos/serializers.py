# Aca construirmos los serializers para el modelo de Pedidos
from rest_framework import serializers
from .models import Usuario, Pedido, Producto, DetallePedido, Entrega, Reporte, Notificacion

# --- Serializers Base ---

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # Exponemos solo estos campos (role lo definimos dentro de models.py los demas vienen por defecto con AbstractUser)
        fields = ['id', 'username', 'email', 'role']

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

# --- Serializers Dependientes ---

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = '__all__'

class EntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrega
        fields = '__all__'

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'