from django.contrib import admin
from .models import Review

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'rating', 'created_at')
    search_fields = ('name', 'country', 'content')
    list_filter = ('rating', 'created_at')
    readonly_fields = ('created_at',)

admin.site.register(Review, ReviewAdmin)
