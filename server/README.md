# Ecoleta Server

## Initialization

### Node

```shell
# Start a new node project
npm init -y

# Install express lib and its types
npm install express
npm install @types/express -D

# Install typescript
npm install typescript -D

# Create typescript config file
npx tsc --init

# Install ts-node-dev for autoreload
npm install ts-node-dev -D

# Install knex
npm install knex

# Install SQLite3
npm install sqlite3

# Run migrations
npx knex --knexfile knexfile.ts migrate:latest
npm run knex:migrate

# Populate database
knex --knexfile knexfile.ts seed:run
npm run knex:seed

# Install cors
npm install cors
npm install @types/cors -D

# Execute server as dev
ts-node-dev src/server.ts
npm run dev
```

### HTTP methods

- GET: Search entities
- POST: Create entities
- PUT: Update entities
- DELETE: Delete entities

### Parameters

- **Request parameters**: mandatory URL parameters.
- **Query parameters**: optional URL parameters.

### Controller

- **index**: list all entities.
- **show**: show only one entity.
- **create**: insert a new entity.
- **update**: update an entity attribute.
- **delete**: delete an entity.

### Service pattern

### Repository pattern.