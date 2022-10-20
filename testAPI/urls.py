from django.conf.urls.static import static
from django.urls import path, include

from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view

from TesProject import settings

from rest_framework.routers import DefaultRouter
from .views import ColorsViewSet, MarkAutosViewSet, ModelAutosViewSet, BucketViewSet, main, colors, mark_auto, model_auto, bucket
from .yasg import urlpatterns as doc_urls
router = DefaultRouter()
router.register(r'colors', ColorsViewSet, basename='colors')
router.register(r'mark_autos', MarkAutosViewSet, basename='markautos')
router.register(r'model_autos', ModelAutosViewSet, basename='modelautos')
router.register(r'bucket', BucketViewSet, basename='bucket')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('', main, name='main'),
    path('colors/', colors, name='color'),
    path('markauto/', mark_auto, name='markauto'),
    path('modelauto/', model_auto, name='modelauto'),
    path('bucket/', bucket, name='buckets'),
]
urlpatterns += doc_urls
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)