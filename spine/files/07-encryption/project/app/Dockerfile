FROM public.ecr.aws/docker/library/python:3.13-slim
RUN pip install --no-cache-dir boto3==1.43.117
COPY app/ /srv/app/
USER nobody
EXPOSE 8080
CMD ["python", "/srv/app/server.py"]
