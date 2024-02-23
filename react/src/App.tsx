import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import GetAllTasks from "./components/GetAllTasks";
import PostTask from "./components/PostTask";
import KanbanBoard from "./components/KanbanBoard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<KanbanBoard />} />
          <Route path="postTask" element={<PostTask />} />
          <Route path="getTasks" element={<GetAllTasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
