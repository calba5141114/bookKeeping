### GraphQL API 
This API is an example of using MySQL,
Elastic Search, Google Cloud Storage Buckets,
Kubernetes, Docker, Node.js, 
and GraphQL all at the same time. 


```sh
#Kafka Server Instance
sudo docker run --rm -p 2181:2181 -p 3030:3030 -p 8081-8083:8081-8083 \
       -p 9581-9585:9581-9585 -p 9092:9092 -e ADV_HOST=localhost \
       landoop/fast-data-dev:latest

#MySQL Server Instance
sudo docker run -d -p 3306:3306 --name='mysql-server' --env="MYSQL_ROOT_PASSWORD=123456" mysql --default-authentication-plugin=mysql_native_password

#Elastic Search server Instance 
 sudo docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.6.0

```