from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.pedidos.models import Usuario, Producto, Pedido, Entrega


class BaseTestCase(TestCase):
    """Configuración base para todos los tests."""
    def setUp(self):
        self.client = APIClient()

        self.admin = Usuario.objects.create_user(
            username='admin1',
            password='admin1234',
            email='admin@example.com',
            role='ADMIN'
        )
        self.cliente = Usuario.objects.create_user(
            username='cliente1',
            password='test1234',
            email='cliente1@example.com',
            role='CLIENTE'
        )
        self.repartidor = Usuario.objects.create_user(
            username='repartidor1',
            password='test1234',
            email='repartidor@example.com',
            role='REPARTIDOR'
        )

        self.usuario = self.cliente

        self.producto = Producto.objects.create(
            nombre='Mouse gamer',
            descripcion='Mouse RGB',
            precio=150000,
            stock=10,
            disponible=True
        )

        self.pedido = Pedido.objects.create(
            descripcion="Pedido inicial",
            direccion="Calle 123 #45-67",
            estado="PENDIENTE",
            total=150000,
            cliente=self.cliente
        )


class ProductoTests(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.client.force_authenticate(user=self.admin)

    def test_crear_producto(self):
        data = {
            "nombre": "Teclado mecánico",
            "descripcion": "Teclado retroiluminado",
            "precio": 250000,
            "stock": 5,
            "disponible": True
        }
        response = self.client.post('/api/productos/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["nombre"], "Teclado mecánico")

    def test_listar_productos(self):
        response = self.client.get('/api/productos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_actualizar_producto(self):
        data = {"precio": 180000}
        response = self.client.patch(f'/api/productos/{self.producto.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data["precio"]), 180000.00)

    def test_eliminar_producto(self):
        response = self.client.delete(f'/api/productos/{self.producto.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class PedidoTests(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.client.force_authenticate(user=self.cliente)

    def test_crear_pedido(self):
        data = {
            "descripcion": "Pedido de prueba",
            "direccion": "Carrera 50 #80-10",
            "estado": "PENDIENTE",
            "total": 200000,
            "cliente": self.cliente.id
        }
        response = self.client.post('/api/pedidos/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["estado"], "PENDIENTE")

    def test_listar_pedidos(self):
        response = self.client.get('/api/pedidos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_actualizar_pedido(self):
        data = {"estado": "EN_PROCESO"}
        response = self.client.patch(f'/api/pedidos/{self.pedido.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["estado"], "EN_PROCESO")

    def test_eliminar_pedido(self):
        response = self.client.delete(f'/api/pedidos/{self.pedido.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class UsuarioTests(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.client.force_authenticate(user=self.admin)

    def test_crear_usuario(self):
        data = {
            "username": "nuevo_user",
            "password": "pass1234",
            "email": "nuevo@example.com",
            "role": "CLIENTE"
        }
        response = self.client.post('/api/usuarios/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_listar_usuarios(self):
        response = self.client.get('/api/usuarios/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

class EntregaTests(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.client.force_authenticate(user=self.repartidor)

    def test_crear_entrega(self):
        nuevo_pedido = Pedido.objects.create(
            descripcion="Pedido para entrega",
            direccion="Calle 20 #10-30",
            estado="PENDIENTE",
            total=300000,
            cliente=self.cliente
        )
        data = {
            "pedido": nuevo_pedido.id,
            "repartidor": self.repartidor.id,
            "estado": "EN_CAMINO",
            "observaciones": "Entrega en curso"
        }
        response = self.client.post('/api/entregas/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["estado"], "EN_CAMINO")

    def test_listar_entregas(self):
        Entrega.objects.create(
            pedido=self.pedido,
            repartidor=self.repartidor,
            estado="EN_CAMINO",
            observaciones="Prueba de entrega"
        )
        response = self.client.get('/api/entregas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_actualizar_entrega(self):
        entrega = Entrega.objects.create(
            pedido=self.pedido,
            repartidor=self.repartidor,
            estado="EN_CAMINO",
            observaciones="Sin novedades"
        )
        data = {"estado": "ENTREGADO"}
        response = self.client.patch(f'/api/entregas/{entrega.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["estado"], "ENTREGADO")

    def test_eliminar_entrega(self):
        entrega = Entrega.objects.create(
            pedido=self.pedido,
            repartidor=self.repartidor,
            estado="PENDIENTE",
            observaciones="Sin observaciones"
        )
        response = self.client.delete(f'/api/entregas/{entrega.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
