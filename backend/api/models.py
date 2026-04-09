from django.db import models


class Project(models.Model):
    name = models.CharField(max_length=200)
    client = models.CharField(max_length=200)
    color = models.CharField(max_length=7, default='#84cc16')  # hex color

    def __str__(self):
        return f"{self.name} ({self.client})"

    class Meta:
        ordering = ['name']


class TimeEntry(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='time_entries',
    )
    date = models.DateField()
    hours = models.DecimalField(max_digits=4, decimal_places=1)
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
    )

    def __str__(self):
        return f"{self.project.name} - {self.date} ({self.hours}h)"

    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Time entries'
