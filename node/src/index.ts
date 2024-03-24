import express, { Express, Request, Response } from "express";
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { eq, inArray } from "drizzle-orm";

const { boards, lists, tasks } = schema;

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
    display_sequence INTEGER NOT NULL,
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

app.put("/api/task/reorder", async (req: Request, res: Response) => {
  try {
    const batchArray = [];

    const body = req.body;

    for (const key in body) {
      const value = body[key];
      batchArray.push(
        await db
          .update(schema.tasks)
          .set({ display_sequence: value })
          .where(eq(schema.tasks.id, parseInt(key, 10)))
          .returning()
      );
    }

    if (batchArray.length > 0) {
      res.status(200).send(batchArray);
    } else {
      res.status(400).send("No tasks to update");
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.put("/api/task/:id", async (req: Request, res: Response) => {
  try {
    if (
      req.body.title === undefined &&
      req.body.due_date === undefined &&
      req.body.completed === undefined &&
      req.body.display_sequence === undefined &&
      req.body.list_id === undefined &&
      req.body.description === undefined
    ) {
      res
        .status(400)
        .send(
          "title, due_date, display_sequence, list_id, description or completed is required"
        );
      return;
    }

    const result = await db
      .update(schema.tasks)
      .set({ ...req.body })
      .where(eq(schema.tasks.id, parseInt(req.params.id, 10)))
      .returning();

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.delete("/api/task/:id", async (req: Request, res: Response) => {
  try {
    const result = await db
      .delete(schema.tasks)
      .where(eq(schema.tasks.id, parseInt(req.params.id, 10)))
      .returning();

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

    const date = new Date(req.body.due_date);

    const task = {
      title: req.body.title,
      description: req.body.description ? req.body.description : "",
      due_date: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`,
      completed: false,
      display_sequence: 0,
      list_id: req.body.list_id,
    };

    const tasksBelongingToList = await db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.list_id, parseInt(task.list_id, 10)));

    task.display_sequence =
      tasksBelongingToList.reduce((acc: number, curr: any) => {
        if (curr.display_sequence > acc) {
          return curr.display_sequence;
        }
        return acc;
      }, 0) + 1;

    const result = await db.insert(tasks).values(task).returning();

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

app.post("/api/board", async (req: Request, res: Response) => {
  if (req.body.title === undefined) {
    res.status(400).send("title is required");
    return;
  }

  try {
    const board = {
      title: req.body.title,
    };

    const boardResult: any = await db.insert(boards).values(board).returning();

    if (boardResult) {
      res.status(200).send(boardResult);
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

app.put("/api/board/:id", async (req: Request, res: Response) => {
  try {
    if (req.body.title === undefined) {
      res.status(400).send("title is required");
      return;
    }

    const result = await db
      .update(schema.boards)
      .set({ ...req.body })
      .where(eq(schema.boards.id, parseInt(req.params.id, 10)))
      .returning();

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.delete("/api/board/:id", async (req: Request, res: Response) => {
  try {
    const resultDeleteBoard = await db
      .delete(schema.boards)
      .where(eq(schema.boards.id, parseInt(req.params.id, 10)))
      .returning();

    if (resultDeleteBoard) {
      const resultDeleteList = await db
        .delete(schema.lists)
        .where(eq(schema.lists.board_id, parseInt(req.params.id, 10)))
        .returning();

      const listIds = Object.values(resultDeleteList).map((list) => list.id);

      if (resultDeleteList) {
        Object.values(listIds).forEach(async (listId) => {
          const resultDeleteTasks = await db
            .delete(schema.tasks)
            .where(eq(schema.tasks.list_id, listId))
            .returning();

          if (resultDeleteTasks) {
            console.log(`No tasks found for list id for ${listId}`);
          }
        });
      } else {
        console.log(`No list found for board id ${req.params.id}`);
      }

      res.status(200).send(resultDeleteBoard);
    } else {
      res.status(400).send("Board not found");
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

    const lists = listsResultSet.reduce((acc: any, curr: any) => {
      acc[curr.id] = {
        title: curr.title,
        display_sequence: curr.display_sequence,
      };
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
      lists,
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

app.post("/api/list/", async (req: Request, res: Response) => {
  if (req.body.title === undefined) {
    res.status(400).send("title is required");
    return;
  } else if (req.body.board_id === undefined) {
    res.status(400).send("board_id is required");
    return;
  } else if (req.body.display_sequence === undefined) {
    res.status(400).send("display_sequence is required");
    return;
  }

  try {
    const list = {
      title: req.body.title,
      board_id: req.body.board_id,
      display_sequence: req.body.display_sequence,
    };

    const listsBelongingToBoard = await db
      .select()
      .from(schema.lists)
      .where(eq(schema.lists.board_id, parseInt(list.board_id, 10)));

    list.display_sequence =
      listsBelongingToBoard.reduce((acc: number, curr: any) => {
        if (curr.display_sequence > acc) {
          return curr.display_sequence;
        }
        return acc;
      }, 0) + 1;

    const listResult: any = await db.insert(lists).values(list).returning();

    if (listResult) {
      res.status(200).send(listResult);
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

app.put("/api/list/reorder", async (req: Request, res: Response) => {
  try {
    const batchArray = [];

    const body = req.body;

    for (const key in body) {
      const value = body[key];
      batchArray.push(
        await db
          .update(schema.lists)
          .set({ display_sequence: value })
          .where(eq(schema.lists.id, parseInt(key, 10)))
          .returning()
      );
    }

    if (batchArray.length > 0) {
      res.status(200).send(batchArray);
    } else {
      res.status(400).send("No lists to update");
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.put("/api/list/:id", async (req: Request, res: Response) => {
  try {
    if (
      req.body.title === undefined &&
      req.body.display_sequence === undefined
    ) {
      res.status(400).send("title or display_sequence is required");
      return;
    }

    const result = await db
      .update(schema.lists)
      .set({ ...req.body })
      .where(eq(schema.lists.id, parseInt(req.params.id, 10)))
      .returning();

    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.delete("/api/list/:id", async (req: Request, res: Response) => {
  try {
    const resultDeleteList = await db
      .delete(schema.lists)
      .where(eq(schema.lists.id, parseInt(req.params.id, 10)))
      .returning();

    if (resultDeleteList) {
      const resultDeleteTasks = await db
        .delete(schema.tasks)
        .where(eq(schema.tasks.list_id, parseInt(req.params.id, 10)))
        .returning();

      if (resultDeleteTasks) {
        res.status(200).send(resultDeleteList);
      }
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.listen(3000, () => console.log(`App running on port 3000.`));
