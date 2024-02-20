import axios from "axios";
import { useEffect, useState } from "react";
import Task from "../types/Task";

const GetAllTasks = () => {
  const [tasks, setAllTasks] = useState<Task[]>([]); // Provide type for users state variable
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/task")
      .then((response) => {
        console.log(response.data);
        setAllTasks(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <>
      <h1>All Tasks</h1>
      <ul>
        {tasks &&
          tasks.map((task: Task) => (
            <li key={task.id}>
              <h3>ID: {task.id} </h3>
              title: {task.title} <br></br>
              description: {task.description} <br></br>
              due date: {task.due_date.slice(0, 10)} <br></br>
              completed: {`${task.completed}`} <br></br>
            </li>
          ))}
      </ul>
    </>
  );
};

export default GetAllTasks;
