from django.http import JsonResponse


def generar_json_de_pedidos(pedidos):
    data = {
        "total_pedidos": pedidos.count(),
        "pedidos": []

    }
    for pedido in pedidos:
        data["pedidos"].append({
            "id": pedido.id,
            "descripcion": pedido.descripcion,
            "direccion": pedido.direccion,
            "fecha_creacion": pedido.fecha_creacion,
            "estado": pedido.estado,
            "total": float(pedido.total),
            "cliente": pedido.cliente.username,
            "detalles": [
                {
                    "producto": detalle.producto.nombre,
                    "cantidad": detalle.cantidad
                } for detalle in pedido.detallepedido_set.all()
            ]
        })
    return JsonResponse(data)
