from django.contrib import admin
from django.urls import path, include, re_path
from apps.api.router import router_api
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.pedidos.views import RegistroUsuarioView, LoadTestView
from django.urls import path, include

schema_view = get_schema_view(
   openapi.Info(
      title="Mi API",
      default_version='v1',
      description="Documentación API con Swagger y DRF",
      terms_of_service="https://www.tu-empresa.com/terminos/",
      contact=openapi.Contact(email="contacto@tuempresa.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router_api.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/loadtest/', LoadTestView.as_view(), name='load_test'),  # Endpoint para pruebas de carga
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('', include(router_api.urls)),
    path('api/', include('apps.api.router')),
   
]
