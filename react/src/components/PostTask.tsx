import axios from "axios";
import { useState } from "react";
import Task from "../types/Task";

const BLANK_TASK: Task = {
  id: undefined,
  title: "",
  description: "",
  due_date: "",
  completed: false,
};
const PostTask = () => {
  const currentDate = new Date().toJSON().slice(0, 10);
  const [task, setTask] = useState(BLANK_TASK);
  const createTask = async () => {
    await axios
      .post("http://localhost:8000/api/task", task, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setTask(BLANK_TASK);
        console.log(response);
        return alert(
          "Task Created: " + `${JSON.stringify(response.data, null, 4)}`
        );
      })
      .catch((err) => {
        return alert(err);
      });
  };
  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "title") {
      setTask({ ...task, title: e.target.value });
    } else if (e.target.name === "description") {
      setTask({ ...task, description: e.target.value });
    } else if (e.target.name === "due_date") {
      setTask({ ...task, due_date: e.target.value });
    }
  };
  return (
    <div className="flex">
      <div>
        <h1 className="p-3 font-bold underline">Create Task</h1>
        <form className="p-3">
          <div className="flex flex-col p-2">
            <div className="flex flex-col">
              <label className="py-2">Title</label>
              <input
                type="text"
                value={task.title}
                onChange={(e) => onChangeForm(e)}
                name="title"
                id="title"
                placeholder="Title"
              />
            </div>
            <div className="flex flex-col">
              <label className="py-2">Description</label>
              <input
                type="text"
                value={task.description}
                onChange={(e) => onChangeForm(e)}
                name="description"
                id="description"
                placeholder="Description"
              />
            </div>
            <div className="flex flex-col">
              <label className="py-2">Due Date</label>
              <input
                type="date"
                value={task.due_date}
                onChange={(e) => onChangeForm(e)}
                name="due_date"
                id="due_date"
                placeholder={currentDate}
              />
            </div>
          </div>
          <button className="p-2" type="button" onClick={() => createTask()}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostTask;
