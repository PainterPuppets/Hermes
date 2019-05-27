python manage.py syncdb
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:9000
# uwsgi --http :8000 --module=config.wsgi:application