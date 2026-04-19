#FROM ubuntu:latest
#LABEL authors="Nithyasree M"
#
#ENTRYPOINT ["top", "-b"]

FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY StudentModule /app

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8083

CMD ["sh", "-c", "java -jar target/*.jar"]