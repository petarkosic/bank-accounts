## Bank App

The Bank Accounts App is a web-based platform designed for bank tellers, offering efficient management of client accounts. It simplifies complex banking tasks, from client search by account number and effortless money transfers to the seamless onboarding of new clients.

1. [Features](#features)
2. [Requirements](#requirements)
3. [How to run](#how-to-run)

## Features

- **Search for Clients**: Search for clients based on their account number.
- **Account Management**: Change client's information, deposit or withdraw money.
- **Money Transfer**: Transfer money from one client to the other.
- **Add New Clients**: Add new clients to the system.

## Requirements

- Docker (https://www.docker.com/)

## How to run

Make sure that docker is installed and running on your machine.

Clone the project and navigate to it:

```bash
git clone https://github.com/petarkosic/bank-accounts.git
cd /bank-accounts
```

In the project root folder, create an `.env` file.

```
POSTGRES_USER=<db-username>         (default = postgres)
POSTGRES_PASSWORD=<db-password>     (default = postgres)

REDIS_HOST=redis
REDIS_PORT=6379
```

<br/>

Inside `/server` folder, create an `.env` file.

```
PORT=<app_port>                     (default = 5000)

POSTGRES_USER=<db-username>         (default = postgres)
POSTGRES_PASSWORD=<db-password>     (default = postgres)
POSTGRES_HOST=postgres
POSTGRES_DB_PORT=5432
POSTGRES_DATABASE=bank_accounts

REDIS_URL=<redis-url>               (default = redis://redis:6379)
```

<br/>

### To run the application in `development` environment, from the project root folder run:

<br/>

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**Note**: Inside the postgres service, there is a database initialization and seeding script that runs. The data is limited, but this process may take some time during the initial setup.

This docker compose setup will orchestrate the necessary containers, including the Node.js application, React client side, PostgreSQL database, and Redis cache.

Once the Docker containers are up and running, you can access the app in your web browser at http://127.0.0.1:3000/

<br/>

### To run the application in `production` environment, from the project root folder run:

<br/>

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

**Note**: Inside the postgres service, there is a database initialization script. The script may take some time to create a database and tables during the initial setup.

This docker compose setup will orchestrate the necessary containers, including the Node.js application, React client side, PostgreSQL database, and Redis cache.

Once the Docker containers are up and running, you can access the app in your web browser at http://127.0.0.1:3000/

<br/>

### To stop the application, from the project root folder run:

<br/>

```bash
docker compose down
```
