FROM python:3.7

COPY . /home/app
WORKDIR /home/app

RUN pip install -r requirements.txt

RUN python manage.py migrate

CMD ["python", "manage.py", "runserver", "0.0.0.0:9001"]