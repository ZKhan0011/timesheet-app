from django.core.management.base import BaseCommand
from api.models import Project, TimeEntry


class Command(BaseCommand):
    help = 'Seeds the database with initial project and time entry data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Clear existing data
        TimeEntry.objects.all().delete()
        Project.objects.all().delete()

        # Create projects
        projects_data = [
            {'id': 1, 'name': 'Client Portal Redesign', 'client': 'Acme Corp', 'color': '#84cc16'},
            {'id': 2, 'name': 'Mobile App Development', 'client': 'TechStart Inc', 'color': '#a3e635'},
            {'id': 3, 'name': 'Data Migration', 'client': 'Global Finance', 'color': '#bef264'},
            {'id': 4, 'name': 'Security Audit', 'client': 'SecureNet', 'color': '#65a30d'},
            {'id': 5, 'name': 'Internal Training', 'client': 'FDM Group', 'color': '#4d7c0f'},
        ]

        projects = {}
        for p in projects_data:
            project = Project.objects.create(**p)
            projects[p['id']] = project
            self.stdout.write(f'  Created project: {project.name}')

        # Create time entries
        entries_data = [
            {'project_id': 1, 'date': '2026-03-24', 'hours': 8, 'description': 'Frontend component development', 'status': 'submitted'},
            {'project_id': 1, 'date': '2026-03-23', 'hours': 7.5, 'description': 'UI/UX implementation', 'status': 'submitted'},
            {'project_id': 2, 'date': '2026-03-22', 'hours': 6, 'description': 'React Native setup and configuration', 'status': 'approved'},
            {'project_id': 3, 'date': '2026-03-21', 'hours': 8, 'description': 'Database schema mapping', 'status': 'approved'},
            {'project_id': 2, 'date': '2026-03-20', 'hours': 7, 'description': 'API integration', 'status': 'approved'},
            {'project_id': 4, 'date': '2026-03-19', 'hours': 8, 'description': 'Penetration testing', 'status': 'approved'},
            {'project_id': 1, 'date': '2026-03-18', 'hours': 6.5, 'description': 'Code review and optimization', 'status': 'approved'},
            {'project_id': 5, 'date': '2026-03-17', 'hours': 4, 'description': 'Team training session', 'status': 'approved'},
        ]

        for e in entries_data:
            entry = TimeEntry.objects.create(**e)
            self.stdout.write(f'  Created entry: {entry}')

        self.stdout.write(self.style.SUCCESS(
            f'Successfully seeded {len(projects_data)} projects and {len(entries_data)} time entries'
        ))
