from datetime import date, timedelta
from django.core.management.base import BaseCommand
from api.models import Project, TimeEntry


class Command(BaseCommand):
    help = 'Seeds the database with initial project and time entry data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Calculate dynamic dates
        today = date.today()
        # Monday of this week (0-indexed, where 0 is Monday)
        this_monday = today - timedelta(days=today.weekday())
        last_monday = this_monday - timedelta(days=7)
        two_weeks_ago_monday = this_monday - timedelta(days=14)
        three_weeks_ago_monday = this_monday - timedelta(days=21)

        def fmt_dt(dt):
            return dt.strftime('%Y-%m-%d')

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
            # Drafts (This Week)
            {'project_id': 1, 'date': fmt_dt(this_monday + timedelta(days=2)), 'hours': 3, 'description': 'Drafting design docs', 'status': 'draft'},
            {'project_id': 3, 'date': fmt_dt(this_monday + timedelta(days=4)), 'hours': 2.5, 'description': 'Initial migration planning', 'status': 'draft'},
            
            # Submitted (This Week & Last Week)
            {'project_id': 1, 'date': fmt_dt(this_monday + timedelta(days=0)), 'hours': 8, 'description': 'Frontend component development', 'status': 'submitted'},
            {'project_id': 1, 'date': fmt_dt(last_monday + timedelta(days=4)), 'hours': 4, 'description': 'UI/UX implementation', 'status': 'submitted'},
            {'project_id': 5, 'date': fmt_dt(this_monday + timedelta(days=1)), 'hours': 2, 'description': 'Onboarding exercises', 'status': 'submitted'},
            
            # Approved (Last Week & This Week)
            {'project_id': 2, 'date': fmt_dt(last_monday + timedelta(days=0)), 'hours': 6, 'description': 'React Native setup and configuration', 'status': 'approved'},
            {'project_id': 3, 'date': fmt_dt(last_monday + timedelta(days=1)), 'hours': 8, 'description': 'Database schema mapping', 'status': 'approved'},
            {'project_id': 2, 'date': fmt_dt(last_monday + timedelta(days=2)), 'hours': 4, 'description': 'API integration', 'status': 'approved'},
            {'project_id': 4, 'date': fmt_dt(last_monday + timedelta(days=3)), 'hours': 8, 'description': 'Penetration testing', 'status': 'approved'},
            {'project_id': 1, 'date': fmt_dt(this_monday + timedelta(days=0)), 'hours': 2.5, 'description': 'Code review and optimization', 'status': 'approved'},
            {'project_id': 5, 'date': fmt_dt(this_monday + timedelta(days=1)), 'hours': 4, 'description': 'Team training session', 'status': 'approved'},
            
            # Rejected (This Week)
            {'project_id': 4, 'date': fmt_dt(this_monday + timedelta(days=3)), 'hours': 8, 'description': 'Wait time for test environment', 'status': 'rejected'},
            {'project_id': 2, 'date': fmt_dt(last_monday + timedelta(days=2)), 'hours': 10, 'description': 'Weekend overtime (unauthorized)', 'status': 'rejected'},

            # 2 Weeks Ago (Approved - Ready for payroll)
            {'project_id': 1, 'date': fmt_dt(two_weeks_ago_monday + timedelta(days=0)), 'hours': 8, 'description': 'Full day workshop', 'status': 'approved'},
            {'project_id': 1, 'date': fmt_dt(two_weeks_ago_monday + timedelta(days=1)), 'hours': 8, 'description': 'Client discovery', 'status': 'approved'},
            {'project_id': 3, 'date': fmt_dt(two_weeks_ago_monday + timedelta(days=2)), 'hours': 8, 'description': 'Data mapping', 'status': 'approved'},
            {'project_id': 2, 'date': fmt_dt(two_weeks_ago_monday + timedelta(days=3)), 'hours': 8, 'description': 'API Design', 'status': 'approved'},
            {'project_id': 4, 'date': fmt_dt(two_weeks_ago_monday + timedelta(days=4)), 'hours': 8, 'description': 'Security prep', 'status': 'approved'},

            # 3 Weeks Ago (Payroll Approved)
            {'project_id': 4, 'date': fmt_dt(three_weeks_ago_monday + timedelta(days=0)), 'hours': 8, 'description': 'Kickoff meetings', 'status': 'payroll_approved'},
            {'project_id': 3, 'date': fmt_dt(three_weeks_ago_monday + timedelta(days=1)), 'hours': 8, 'description': 'Requirements gathering', 'status': 'payroll_approved'},
            {'project_id': 2, 'date': fmt_dt(three_weeks_ago_monday + timedelta(days=2)), 'hours': 8, 'description': 'Initial architecture', 'status': 'payroll_approved'},
            {'project_id': 1, 'date': fmt_dt(three_weeks_ago_monday + timedelta(days=3)), 'hours': 8, 'description': 'UI Mockups', 'status': 'payroll_approved'},
            {'project_id': 5, 'date': fmt_dt(three_weeks_ago_monday + timedelta(days=4)), 'hours': 8, 'description': 'Internal prep', 'status': 'payroll_approved'},
        ]

        for e in entries_data:
            entry = TimeEntry.objects.create(**e)
            self.stdout.write(f'  Created entry: {entry}')

        self.stdout.write(self.style.SUCCESS(
            f'Successfully seeded {len(projects_data)} projects and {len(entries_data)} time entries'
        ))
