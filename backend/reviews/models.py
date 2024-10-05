from django.db import models

class Review(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    content = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.name} ({self.country})"
