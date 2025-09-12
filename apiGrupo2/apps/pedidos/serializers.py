# Aca construirmos los serializers para el modelo de Pedidos
from rest_framework import serializers
from .models import Pedido

# Creamos el serializer para el modelo Pedido
class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'