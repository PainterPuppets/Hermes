FROM python:3

ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/    
RUN pip install --index https://pypi.mirrors.ustc.edu.cn/simple/ -r requirements.txt
ADD . /code/
