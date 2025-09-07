from rest_framework.routers import DefaultRouter
from ..task.views import *

router = DefaultRouter()

router.register(r'task', TaskViewset, basename= 'task')

urlpatterns = router.urls