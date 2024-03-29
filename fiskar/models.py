from django.db import models
from django.contrib.auth.models import User

class Fish(models.Model):
    FISH_TYPES = [
        ('svärdfisk', 'Svärdfisk'),
        ('clownfisk', 'Clownfisk'),
        ('bläckfisk', 'Bläckfisk'),
        ('blåsfisk', 'Blåsfisk'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.TextField(max_length=30, default='Title')
    name = models.TextField(max_length=30, default='Namn')
    message = models.TextField()
    like_count = models.PositiveIntegerField(default=0)
    fish_type = models.CharField(max_length=20, choices=FISH_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_fish_type_display()} #{self.id}: {self.message} {self.title} {self.user} {self.name}"
    

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fish = models.ForeignKey(Fish, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user.username} likes {self.fish.id}"