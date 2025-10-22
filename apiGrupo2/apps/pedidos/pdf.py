from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def generar_pdf_pedido(pedido):
    buf = BytesIO()
    hoja = canvas.Canvas(buf, pagesize=letter)
    ancho, alto = letter
    hoja.setFont("Times-Roman", 12)
    hoja.setTitle("Pedido")
    y = alto-50
    hoja.drawString(50, y, f'id Pedido: {pedido.id}')
    y -= 15
    hoja.drawString(50, y, f'direccion: {pedido.direccion}')
    y -= 15
    hoja.drawString(50, y, f'estado: {pedido.estado}')
    y -= 15
    hoja.drawString(50, y, f'fecha creacion: {pedido.fecha_creacion}')
    y -= 15
    hoja.drawString(50, y, f'cliente: {pedido.cliente}')
    y -= 15

    hoja.drawString(50, y, 'Detalle del Pedido:')
    for detalle in pedido.detallepedido_set.all():
        hoja.drawString(
            50, y, f'Producto : {detalle.producto.nombre}, Pedido: {detalle.pedido.id}, Cantidad: {detalle.cantidad}')
        y -= 15

    hoja.showPage()
    hoja.save()
    buf.seek(0)
    return buf.getvalue()


def generar_pdf_de_pedidos(pedidos):
    buf = BytesIO()
    hoja = canvas.Canvas(buf, pagesize=letter)
    ancho, alto = letter
    hoja.setFont("Times-Roman", 12)
    hoja.setTitle("Lista de Pedidos")
    y = alto - 50
    hoja.drawString(50, y, 'Lista de Pedidos:')
    y -= 40
    for pedido in pedidos:
        hoja.drawString(
            50, y -
            40, f'id pedido: {pedido.id}, direccion: {pedido.direccion}, estado: {pedido.estado}, '
            f' cliente: {pedido.cliente}')
        y -= 15

    hoja.showPage()
    hoja.save()
    buf.seek(0)
    return buf.getvalue()
