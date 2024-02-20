const express = require("express");
const pg = require("pg");
const bodyParser = require("body-parser");

const { Client } = pg;

const client = new Client({
  user: "postgres",
  host: "db",
  database: "postgres",
  password: "1234",
  port: 5432,
});

client.connect();

const createTable = async () => {
  // due_date format should be yyyy-mm-dd
  // todo: add subtasks (might need a separate table for subtasks, or a JSON column in the tasks table)
  // todo: change due_date to a date type
  await client.query(`CREATE TABLE IF NOT EXISTS tasks 
    (id serial PRIMARY KEY, title VARCHAR (255) UNIQUE NOT NULL, 
    description VARCHAR (255), due_date DATE NOT NULL, completed BOOLEAN NOT NULL DEFAULT FALSE);`);
};

createTable();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => res.send("Hello World!"));

app.get("/api/task", async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM tasks`);

    if (response) {
      res.status(200).send(response.rows);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.post("/api/task", async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const due_date = req.body.due_date;

    console.log(req.body);

    const response = await client.query(
      `INSERT INTO tasks(title, description, due_date) VALUES ('${title}', '${description}', TO_DATE('${due_date}', 'yyyy-mm-dd'));`
    );

    if (response) {
      res.status(200).send(req.body);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.listen(3000, () => console.log(`App running on port 3000.`));
