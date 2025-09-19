from django.contrib import admin
from django.urls import path, include
from apps.api.router import router_api
from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

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
    path('api/', include(router_api.urls)),  # para redirigir a la api de los modelos en general
     re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),  # UI interactiva
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),  # alternativa

]
