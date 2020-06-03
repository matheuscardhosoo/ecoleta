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
