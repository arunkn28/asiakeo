from django.shortcuts import redirect


def unauthenticated_user(view_func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('account:mon-compte')
        return view_func(request, *args, **kwargs)
    return wrapper