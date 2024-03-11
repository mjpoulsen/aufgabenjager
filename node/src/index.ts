import express, { Express, Request, Response } from "express";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { eq, inArray } from "drizzle-orm";

const { tasks } = schema;

const client = new Client({
  user: "postgres",
  host: "db",
  database: "postgres",
  password: "1234",
  port: 5432,
});

client.connect();
const db = drizzle(client, { schema });

const createTables = async () => {
  await client.query(`CREATE TABLE IF NOT EXISTS tasks 
  (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NULL,
    due_date DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    list_id SERIAL NOT NULL
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS lists 
  (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    board_id SERIAL NOT NULL
  );`);
  await client.query(`CREATE TABLE IF NOT EXISTS boards 
  (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
  );`);
};

createTables();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req: Request, res: Response) => res.send("Hello World!"));

app.get("/api/task", async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(tasks);

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.get("/api/task/:id", async (req: Request, res: Response) => {
  try {
    const result = await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, parseInt(req.params.id, 10)));

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.post("/api/task", async (req: Request, res: Response) => {
  try {
    if (req.body.list_id === undefined) {
      res.status(400).send("list_id is required");
      return;
    } else if (req.body.title === undefined) {
      res.status(400).send("title is required");
      return;
    } else if (req.body.due_date === undefined) {
      res.status(400).send("due_date is required");
      return;
    }

    const task = {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.due_date,
      completed: false,
      list_id: req.body.list_id,
    };

    const result = await db.insert(tasks).values(task);

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.get("/api/board/", async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(schema.boards);

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.get("/api/board/:id", async (req: Request, res: Response) => {
  try {
    const result = await db
      .select()
      .from(schema.boards)
      .where(eq(schema.boards.id, parseInt(req.params.id, 10)));

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.get("/api/board/:id/data", async (req: Request, res: Response) => {
  try {
    const listsResultSet = await db
      .select()
      .from(schema.lists)
      .where(eq(schema.lists.board_id, parseInt(req.params.id, 10)));

    const listNames = listsResultSet.reduce((acc: any, curr: any) => {
      acc[curr.id] = curr.title;
      return acc;
    }, {} as Record<string, any>);

    const lists = listsResultSet.reduce((acc: any, curr: any) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as Record<string, any>);

    const listsIds = Object.keys(lists).map((id) => parseInt(id, 10));

    const tasksResultSet = await db
      .select()
      .from(schema.tasks)
      .where(inArray(schema.tasks.list_id, listsIds));

    const tasks = tasksResultSet.reduce((acc: any, curr: any) => {
      if (!acc[curr.list_id]) {
        acc[curr.list_id] = {};
      }
      acc[curr.list_id][curr.id] = curr;
      return acc;
    }, {} as Record<string, any>);

    const response = {
      tasks,
      listNames,
    };

    if (response) {
      res.status(200).send(response);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.get("/api/list/", async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(schema.lists);

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.get("/api/list/:id", async (req: Request, res: Response) => {
  try {
    const result = await db
      .select()
      .from(schema.lists)
      .where(eq(schema.lists.id, parseInt(req.params.id, 10)));

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.listen(3000, () => console.log(`App running on port 3000.`));
