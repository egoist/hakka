```bash
# Update env config
cp .env.example .env

# Install dependencies
yarn

# Run migrations
yarn build:server
yarn migrate:deploy

# Start dev server
yarn dev:server
yarn dev
```
