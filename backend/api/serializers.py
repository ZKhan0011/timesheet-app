from rest_framework import serializers
from .models import Project, TimeEntry


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'client', 'color']


class TimeEntrySerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    projectId = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        source='project',
        write_only=True,
    )

    class Meta:
        model = TimeEntry
        fields = ['id', 'project', 'projectId', 'date', 'hours', 'description', 'status']
