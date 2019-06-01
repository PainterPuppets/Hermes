#!/usr/bin/env python
# encoding: utf-8

from django.contrib import admin
from user.models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', )


admin.site.register(Profile, ProfileAdmin)
