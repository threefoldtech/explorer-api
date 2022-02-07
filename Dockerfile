FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install git curl -y
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash 

ENV NVM_DIR "$HOME/.nvm"
RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" && \ 
    source ~/.bashrc && nvm install --lts


RUN npm install -g yarn 

COPY . /app

WORKDIR /app
RUN yarn && yarn build 
WORKDIR /app/frontend
RUN yarn && yarn build
WORKDIR /app/dist
EXPOSE 8081

CMD ["PORT=8081", "node", "main.js" ]




