#!/bin/bash

set -e  # exit immediately if a command fails

DOCKER_USERNAME="tjc2746"

# Build the Spring Boot JARs first
echo "Building JARs with Maven..."
mvn clean package -DskipTests

# Now build the Docker images
echo "Building Docker images..."

docker build -t ${DOCKER_USERNAME}/config-server ./config-server
docker build -t ${DOCKER_USERNAME}/discovery-service ./discovery-service
docker build -t ${DOCKER_USERNAME}/banking-service ./banking-service
docker build -t ${DOCKER_USERNAME}/client-service ./client-service
docker build -t ${DOCKER_USERNAME}/gateway ./api-gateway

echo "Build complete. Pushing images..."

docker push ${DOCKER_USERNAME}/config-server
docker push ${DOCKER_USERNAME}/discovery-service
docker push ${DOCKER_USERNAME}/banking-service
docker push ${DOCKER_USERNAME}/client-service
docker push ${DOCKER_USERNAME}/gateway

echo "All images pushed to Docker Hub."
