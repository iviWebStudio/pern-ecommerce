# SIMPLE PERN STACK STORE

A small full-stack e-commerce project built with Postgres, Express, React and Node.

## Run Locally

Clone the project

```bash
  git clone https://github.com/iviWebStudio/pern-ecommerce.git
```

Go to the project directory

```bash
  cd pern-ecommerce
```

Install dependencies

```bash
  npm install
```

Go to server directory and install dependencies

```bash
  npm install
```

Go to client directory and install dependencies

```bash
  npm install
```

Go to server directory and start the server

```bash
  npm run dev
```

Go to client directory and start the client

```bash
  npm run client
```

Start both client and server concurrently from the root directory

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env files in both client and
server directory

#### client/.env

| Variable            | Description      |
| ------------------- | ---------------- |
| `REACT_APP_API_URL` | Backend API url  |

### server/.env

| Variable              | Description                                                                   |
| --------------------- | ----------------------------------------------------------------------------- |
| `PGDB_USER`           | Postgres username                                                             |
| `PGDB_HOST`           | Postgres host (default: localhost)                                            |
| `PGDB_PASS`           | Postgre password                                                              |
| `PGDB_NAME`           | Postgre DB name                                                               |
| `PGDB_PORT`           | Postgre DB name                                                               |
| `APP_PORT`            | Application Port - express server listens on this port (default 9000).        |
| `JWT_SECRET`          | JWT access secret                                                             |
| `JWT_REFRESH_SECRET`  | JWT refresh secret                                                            |
