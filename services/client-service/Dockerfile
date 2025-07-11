# Use official JDK image
FROM eclipse-temurin:21-jdk-alpine

# Set workdir
WORKDIR /app

# Copy JAR from build context
COPY target/*.jar app.jar

# Expose port (adjust if needed)
EXPOSE 9494

# Run
ENTRYPOINT ["java", "-jar", "app.jar"]
