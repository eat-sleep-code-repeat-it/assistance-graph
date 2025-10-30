# [Assistance GraphQL](https://github.com/eat-sleep-code-repeat-it/assistance-graph.git)

## Quick start

```bash

cd C:/workspace/assistance-graph/assistance-graph

# start the server and restarts it on every change.
pnpm run dev - will start the server and restarts it on every change.

# start the server
pnpm run start

# Runs the prettier formatter for all files in the current directory
pnpm prettier . --write


pnpm run dev

# http://localhost:4000/graphql
query {
  hello
}

or 
curl -X POST http://localhost:4000/graphql -H "Content-type: application/json" --data-raw '{"query": "query { hello }"}'
```
