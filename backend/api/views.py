from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

from .models import Project, TimeEntry
from .serializers import ProjectSerializer, TimeEntrySerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """CRUD API for projects."""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class TimeEntryViewSet(viewsets.ModelViewSet):
    """CRUD API for time entries."""
    queryset = TimeEntry.objects.select_related('project').all()
    serializer_class = TimeEntrySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Optional date range filtering via query params
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        return queryset

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Change a time entry status to 'submitted'."""
        entry = self.get_object()
        entry.status = 'submitted'
        entry.save()
        serializer = self.get_serializer(entry)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Change a time entry status to 'approved'."""
        entry = self.get_object()
        entry.status = 'approved'
        entry.save()
        serializer = self.get_serializer(entry)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Change a time entry status to 'rejected'."""
        entry = self.get_object()
        entry.status = 'rejected'
        entry.save()
        serializer = self.get_serializer(entry)
        return Response(serializer.data)
    @action(detail=True, methods=['post'], url_path='approve-payroll')
    def approve_payroll(self, request, pk=None):
        entry = self.get_object()
        entry.status = 'payroll_approved'
        entry.save()
        return Response({'status': 'payroll approved'})


@api_view(['GET'])
def dashboard_summary(request):
    """Aggregated stats for the dashboard page."""
    today = timezone.now().date()
    # Monday of current week
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)

    all_entries = TimeEntry.objects.all()
    week_entries = all_entries.filter(date__gte=week_start, date__lte=week_end)

    this_week_hours = week_entries.aggregate(total=Sum('hours'))['total'] or 0
    submitted_count = all_entries.filter(status='submitted').count()
    approved_count = all_entries.filter(status='approved').count()
    total_hours = all_entries.aggregate(total=Sum('hours'))['total'] or 0

    return Response({
        'thisWeekHours': float(this_week_hours),
        'submittedEntries': submitted_count,
        'approvedEntries': approved_count,
        'totalHours': float(total_hours),
        'weekStart': week_start.isoformat(),
        'weekEnd': week_end.isoformat(),
    })