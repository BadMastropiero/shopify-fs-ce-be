## Description

Favorites API.

## Installation

```bash
$ npm install
```

## Running the app
Create a .env file by copying the .env.example file and setting the values for the environment variables.
For the database connection there is a docker-compose file that can be used to start a mongo database.
```bash
$ docker-compose up -d
```
After the database is running, run the following command to start the application.
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
For testing the favorites service a in memory database is used, so there is no need to start a database.
