from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User


class Usuario(AbstractUser):

    ROLES = (
        ('ADMIN', 'Administrador'),
        ('CLIENTE', 'Cliente'),
        ('REPARTIDOR', 'Repartidor'),
        ('VENDEDOR', 'Vendedor'),
    )
    role = models.CharField(max_length=20, choices=ROLES, blank=True)


def __str__(self):
    return f"{self.username} - {self.get_role_display()}"
    


class Pedido(models.Model):
    ESTADOS = (
        ('ENTREGADO', 'Entregado'),
        ('PENDIENTE', 'Pendiente'),
        ('EN_PROCESO', 'En Proceso'),
    )
    descripcion = models.TextField(max_length=500, blank=True, null=True)
    direccion = models.CharField(max_length=200)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=30, choices=ESTADOS, default='PENDIENTE')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    cliente = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='pedidos_cliente')

    def __str__(self):
        return f"Pedido {self.id} - {self.estado} - {self.direccion}"
   

class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(max_length=500, blank=True, null=True)
    precio = models.DecimalField(max_digits=9, decimal_places=2)
    stock = models.IntegerField(default=0)
    pedidos = models.ManyToManyField(Pedido, through='DetallePedido')
    disponible = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre} - ${self.precio} - Disponible: {self.disponible} "


class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()

    def __str__(self):
        
        return f"{self.cantidad} x {self.producto.nombre} en Pedido {self.pedido.id}"


class Entrega(models.Model):
    pedido = models.OneToOneField(Pedido, on_delete=models.CASCADE)
    repartidor = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='entregas_repartidor')
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    
    ESTADOS_ENTREGA = (
        ('ASIGNADO', 'Asignado'),
        ('EN_CAMINO', 'En Camino'),
        ('ENTREGADO', 'Entregado'),
        ('FALLIDO', 'Fallido'),
    )
    estado = models.CharField(
        max_length=20, choices=ESTADOS_ENTREGA, default='ASIGNADO')
    observaciones = models.TextField(max_length=500, blank=True, null=True)


class Reporte(models.Model):
    pedido = models.ForeignKey(
        
        Pedido, on_delete=models.CASCADE, related_name='reportes')
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name='reportes_usuario')
 
    tipo_reporte = models.CharField(max_length=100)
    fecha_generacion = models.DateTimeField(auto_now_add=True)
   
    repo_pdf = models.FileField(upload_to='reportes/', blank=True, null=True)

    repo_json = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Reporte {self.id} - Pedido {self.pedido.id} - Usuario {self.usuario.username} - Tipo {self.tipo_reporte}"


class Notificacion(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    TIPOS_NOTIFICACION = ( 
        ('INFO', 'Información'),
        ('ALERTA', 'Alerta'),
        ('URGENTE', 'Urgente'),
    )
    tipo_notificacion = models.CharField(
        max_length=20, choices=TIPOS_NOTIFICACION)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    visto = models.BooleanField(default=False)
    ESTADOS_NOTIFICAION = (
        ('ENVIADO', 'Enviado'),
        ('FALLIDO', 'Fallido'),
    )
    estado = models.CharField(
        max_length=20, choices=ESTADOS_NOTIFICAION, default='ENVIADO')
    mensaje = models.TextField(max_length=500)
