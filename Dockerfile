FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install git curl -y
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash 

SHELL ["/bin/bash", "-c"]
RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh && bash nodesource_setup.sh && apt install nodejs -y

RUN npm install -g yarn 

COPY . /app

WORKDIR /app
RUN yarn && yarn build 
WORKDIR /app/frontend
RUN yarn && yarn build
WORKDIR /app/dist
ENV PORT 8081
EXPOSE 8081 

CMD ["node", "main.js" ]




