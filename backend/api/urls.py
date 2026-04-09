from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)
router.register(r'time-entries', views.TimeEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/summary/', views.dashboard_summary, name='dashboard-summary'),
]
