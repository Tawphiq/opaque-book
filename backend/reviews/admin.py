from django.contrib import admin
from .models import Review

class ReviewAdmin(admin.ModelAdmin):
    list_display = ('name', 'profession', 'rating', 'created_at')
    search_fields = ('name', 'profession', 'content')
    list_filter = ('rating', 'created_at')
    readonly_fields = ('created_at',)

admin.site.register(Review, ReviewAdmin)
