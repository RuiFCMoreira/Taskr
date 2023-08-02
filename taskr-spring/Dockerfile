FROM maven:3.8.5-eclipse-temurin-18-alpine

WORKDIR /taskr-app
COPY . .
RUN rm ./src/main/resources/application.properties
COPY ./src/main/resources/cloud.application.properties ./src/main/resources/application.properties
RUN rm ./src/main/resources/cloud.application.properties
RUN mvn clean install

CMD mvn spring-boot:run