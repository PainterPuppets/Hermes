FROM nikolaik/python-nodejs:python3.7-nodejs12

COPY . /home/app
WORKDIR /home/app

# build frontend
RUN cd react && yarn && yarn production

RUN pip install -r requirements.txt

CMD ["sh", "./entrypoint.sh"]