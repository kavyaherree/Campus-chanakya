# Multi-stage build for Spring Boot Backend
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B || true
COPY src ./src
RUN mvn clean package -Dmaven.test.skip=true

# Production Runtime Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
VOLUME /app/data
COPY --from=builder /app/target/campus-chanakya-backend-1.0.0.jar app.jar

ENV SERVER_PORT=8080
ENV SPRING_DATASOURCE_URL="jdbc:h2:file:./data/campus_chanakya;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE;CASE_INSENSITIVE_IDENTIFIERS=TRUE"

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
