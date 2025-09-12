from django.contrib import admin
from django.urls import path, include
from apps.api.router import router_api

urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/', include(router_api.urls)),  # para redirigir a la api de pedidos
]
