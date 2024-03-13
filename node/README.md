# Backend Readme

## NPM Commands

View `package.json` for run commands. The following are a breakdown of the common commands.

### Build

```bash
npm run build
```

### Run

```bash
npm run start
```

### Dev

```bash
npm run dev
```

### Drizzle Studio

```bash
npm run studio
```

Generates the `drizzle` directory and launches a daemon for the local studio.

## Tech Stack

- Express
- Drizzle ORM

## Dev Tech Stack

- Typescript
- Drizzle Kit (Studio)

## Todo

- Ensure new boards always have a default list and a DONE list
- Add the following APIs
  - GET Board by ID with its Lists and each List's Tasks
  - GET List by ID and its Tasks
  - Post, Put, Delete Board
  - Post, Put, Delete List
  - Post, Put, Delete Task
- Verify schema.ts relations work when using Drizzle
- Functions to create tables (if they do not exist)
