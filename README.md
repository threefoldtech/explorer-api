## Introduction 
This a unified project for all explorers inluding gird2 and grid3 using grid proxy


## Technologies
#### Back-end
- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
#### Front-end 
- [Vue.js](https://vuejs.org/)
## Running the app
#### Development mode 
1. Clone the projec
```bash
$ https://github.com/threefoldtech/explorer-api.git
```
2. Install backend dependencies 
``` bash
// You must have yarn installed globaly
$ yarn 
```

3. Install frontend dependencies 
``` bash
$ cd frontend
$ yarn   
```

4. serve frontend
``` bash
$ yarn serve
```

5. serve backend
``` bash
$ cd .. (project home directory)
$ yarn start:dev
```
#### Production mode 
1. Clone the project
```bash
$ https://github.com/threefoldtech/explorer-api.git
```
2. Install backend dependencies and build 
``` bash
$ yarn && yarn build 
```
3- Install frontend dependencies and build
```
$ cd ./frontend
$ yarn && yarn build
```
4- start the server
``` bash
$ cd ../dist
$ node main.js
```
this will start the server in the default `port 3000`
## Run Docker 

1. Build local image
``` bash
$ docker build . -t explorer
```

2. Run container
replace the port with port number that you want to map 
```
$ docker run -p <port>:8081 explorer
```
example
```
$ docker run -p 9090:8081 explorer
```