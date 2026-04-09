from django.contrib import admin
from .models import Project, TimeEntry


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'color']
    search_fields = ['name', 'client']


@admin.register(TimeEntry)
class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ['project', 'date', 'hours', 'status']
    list_filter = ['status', 'project', 'date']
    search_fields = ['description']
    date_hierarchy = 'date'
