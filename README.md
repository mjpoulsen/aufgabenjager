# Aufgabenjager

Aufgabenjäger - the task hunter

## About

Aufgabenjäger is meant to be a fullstack solution for tracking tasks without using a cloud service.

This project was made using this [repo](https://github.com/AntonioMaccarini/dockerize-react-node-postgres-nginx-application) as a starting point. It deviates from the source in that it uses Typescript and newer versions of Vite and Docker.

## Stack

- React
- Express JS
- PostgreSQL
- Docker

## Features

- Create multiple boards
- Each board supports multiple lists and tasks
- Tasks and lists can be rearragned through drag and drop
- Store data locally (through docker mount volume)
- Single port (orchestrated through nginx)

## Todo

- Add tests -- tests were not provided because I wanted the freedom to develop the api and frontend without having to update tests. Now that the project is more or less complete, tests should be added to prevent future changes from breaking existing functionality
- Add information on how to update the password for postgres db

## Dependencies

The application was developed with the following dependencies and versions

- Node: 19.8.1
- NPM: 9.5.1
- Docker
  - Engine: 25.0.3
  - Compose: 2.24.5-desktop.1

## Building Dependencies

### Frontend

```bash
cd react && npm install
```

### Backend

```bash
cd node && npm install
```

## Local Development

When developing a feature for the application, it is easy to test changes with hotreload enabled. The `docker-compose-dev.yaml` file executes those commands and persists the database files to a `./data` directory (see [Docker Mount Volume](#docker-mount-volume) for more details).

### Build and Run Docker Containers

```bash
docker-compose -f docker-compose-dev.yaml up --build
```

## Running the Application

### Docker Mount Volume

The postgres database stores the data within the container, but this means the data is temporary (find a better word). To avoid this, the `docker-compose.yaml` file defines a volume mapping `./data:/var/lib/postgresql/data`.

The current mapping can remain as the `.gitignore` file should exclude it from commits, but a `data` directory will need to be created. The `data` director is at the top level of the project for development reasons.

Therefore, if you plan to run the application as a tool, it is recommended that the `data` folder be stored outside of the project.

### Postgres Security

For development purposes, the postgres username and password are in plaintext and the default values. They can be found in the `docker-compose.yaml` file's `backend` and `db` environment sections.

Although this application is meant to be used without a cloud service, if it is deployed to an exposed port, it is recommended to change the database credentials before running the application.

### Build the Docker Containers

```bash
docker-compose build
```

### Run the Docker Containers

```bash
docker-compose up -d
```
