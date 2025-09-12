# Vamos a crear las vistas que recibirán las peticiones HTTP
from rest_framework import viewsets
from .models import *
from .serializers import *

# Creamos el viewset para el modelo Pedido (esto significa que vamos a tener todas las operaciones CRUD)
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer