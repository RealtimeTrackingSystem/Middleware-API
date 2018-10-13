docker build -t johnhigginsavila/middleware-api:latest -t johnhigginsavila/middleware-api:$SHA -f ./Dockerfile .
docker push johnhigginsavila/middleware-api:latest
docker push johnhigginsavila/middleware-api:$SHA
