# [Assistance GraphQL](https://github.com/eat-sleep-code-repeat-it/assistance-graph.git)

## Quick Start

Follow these steps after cloning the repo to run the application locally.

Prerequisites

- Node.js (LTS) — recommended: Node 18 or newer. You can check your version with:

```bash
node --version
```

If you use a version manager (nvm, fnm, asdf), switch to a compatible Node version before installing dependencies.

1. Clone and install

```bash
git clone https://github.com/eat-sleep-code-repeat-it/assistance-graph.git
cd assistance-graph
pnpm install
```

2. Configure the database

This project uses Prisma with SQLite by default. Create a `.env` file in the project root with:

```env
DATABASE_URL="file:./dev.db"
```

If you prefer Postgres or another provider, set `DATABASE_URL` accordingly.

3. Initialize the database (one of the options below)

Option A — apply migrations (recommended for development):

```bash
npx prisma migrate dev
npx prisma generate
```

Option B — push the current schema without creating a migration:

```bash
npx prisma db push
npx prisma generate
```

4. Start the server

```bash
pnpm run dev
```

The GraphQL playground will be available at:

http://localhost:4000/graphql

5. Run tests / integration scripts

There are a couple of convenience scripts in `package.json`:

```bash
# run the example integration test (creates data, asserts, cleans up)
npm test

# run the clean integration test explicitly
npm run test:clean
```

Example GraphQL query (in the playground):

```graphql
query {
  questionnaires {
    id
    currentVersion
    versions {
      id
      version
      sections {
        viewGroups {
          questions {
            text
          }
        }
      }
    }
  }
}
```


## Database Management

```bash
# Push schema changes directly to the database
npx prisma db push

# Create a new migration, apply it, and regenerate client
npx prisma migrate dev

# Reset database (clear all data)
npx prisma migrate reset --force

# Regenerate Prisma client after schema changes
npx prisma generate

# Open Prisma Studio (database UI)
npx prisma studio
```

## Integration Test

The project includes an integration test (`src/integration-test.ts`) that verifies the complete questionnaire workflow:

1. Creates a questionnaire with initial version
   - Version 1 contains basic questions (name, age)
2. Updates the questionnaire, creating version 2
   - Adds an additional newsletter signup question
   - Updates currentVersion to 2
3. Creates and submits a response
   - Creates response for version 2
   - Adds test answers
   - Changes status from "in_progress" to "completed"
4. Verifies the full workflow
   - Confirms questionnaire exists
   - Checks version count and currentVersion
   - Validates question count in version 2
   - Verifies response creation and submission

Run the test:
```bash
# Run once
npm test

# Run in watch mode (re-runs on changes)
npm run test:watch
```

The test provides a good example of using the Prisma client to:
- Create nested records (questionnaire → version → sections → viewGroups → questions)
- Update records (questionnaire.currentVersion, response.status)
- Query the full object graph with nested includes