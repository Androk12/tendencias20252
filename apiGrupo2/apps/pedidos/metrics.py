import time
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class RequestMetricsMiddleware(MiddlewareMixin):
    """
    Middleware para registrar métricas básicas de las peticiones HTTP.
    - Tiempo de respuesta
    - Método y endpoint
    - Código de estado
    """

    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        if hasattr(request, "start_time"):
            duration = time.time() - request.start_time
            user = getattr(request.user, "username", "anonimo")
            
            # Log más detallado
            log_message = (
                f"Petición {request.method} {request.path} por {user} -> "
                f"{response.status_code} ({duration:.2f}s)"
            )
            
            # Log diferente según el status code
            if response.status_code >= 400:
                logger.warning(log_message)
            else:
                logger.info(log_message)
                
        return response