import axios from "axios";
import { useEffect, useState } from "react";
import Task from "../types/Task";

const GetAllTasks = () => {
  const [tasks, setAllTasks] = useState<Task[]>([]);
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
      <h1 className="p-3 font-bold underline">All Tasks</h1>
      <div className="mx-5">
        <table className="table-auto border">
          <thead>
            <tr>
              <th className="p-1 border">Title</th>
              <th className="p-1 border">Description</th>
              <th className="p-1 border">Due Date</th>
              <th className="p-1 border">Completed</th>
            </tr>
          </thead>
          <tbody>
            {tasks &&
              tasks.map((task: Task) => (
                <tr>
                  <td className="px-2 py-1 border border-gray-400">
                    {task.title}
                  </td>
                  <td className="px-2 py-1 border border-gray-400">
                    {task.description}
                  </td>
                  <td className="px-2 py-1 border border-gray-400">
                    {task.due_date}
                  </td>
                  <td className="px-2 py-1 border border-gray-400">{`${task.completed}`}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GetAllTasks;
