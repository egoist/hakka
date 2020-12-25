# Running locally

## Configure `.env` file

Create a `.env` file from the default template:

```bash
cp .env.example .env
```

## Initialize a database

```sql
# Run psql
> psql

# Change the password of user `postgres` to the one in .env file
> \password

# Create a database (you can change it in .env file)
> create database mydb;
```

## Run server in dev mode

```bash
yarn dev
```

Then navigate to `http://localhost:3000/graphql`.
