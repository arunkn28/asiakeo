from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class ProfileUserManager(models.Manager):
    def create_user(self, data):
        email = username = data['email']
        phone = data['phone']
        password = data['pass1']
        first_name = data['first_name']
        last_name = data['last_name']
        autocomplete_address = data['autocomplete-address']
        address_2 = data['address_2']
        instructions = data['instructions']
        user = User.objects.create_user(email=email, username=email, password=password, first_name=first_name,
                                        last_name=last_name)
        profile = Profile(user=user, phone_number=phone, address_line_1 = autocomplete_address,
                          address_line_2 = address_2, additional_info=instructions)

        profile.save()
        return profile


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15)
    address_line_1 = models.TextField(blank=True, null=True)
    address_line_2 = models.TextField(blank=True, null=True)
    additional_info = models.TextField(blank=True, null=True)
    objects = ProfileUserManager()

    def __str__(self):
        return str(self.user.first_name) + " " + str(self.user.last_name)
