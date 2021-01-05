## Running locally

1. Configure `.env` file

Copy `.env.example` to `.env` and change the values accordingly.

2. Install dependencies

```bash
yarn
```

This app also requires PostgreSQL and Redis, you can spin up two Docker containers, the easiest way is to use [doko](https://github.com/egoist/doko):

```bash
doko enable postgres
doko enable redis
```

3. Start server

```bash
# In on tab
yarn dev:server
# In another tab
yarn dev
```

After that, you might need to deploy migrations as well if you haven't done that before:

```bash
yarn migrate:deploy
```

## Database

After modifying ORM entities in `./orm`, you might need to generate a new migration file based on schema diff:

```bash
yarn migrate:save <migration-name>
```

Then deploy the migration to the database:

```bash
# If you're not running yarn dev:server
# Following command is also needed
# yarn build:server
yarn migrate:deploy
```
