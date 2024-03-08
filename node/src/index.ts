import express, { Express, Request, Response } from "express";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

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

app.post("/api/task", async (req: Request, res: Response) => {
  try {
    const task = {
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.due_date,
      completed: false,
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

app.listen(3000, () => console.log(`App running on port 3000.`));
