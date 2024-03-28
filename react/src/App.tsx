import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import KanbanBoard from "./components/KanbanBoard";
import BoardList from "./components/BoardList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BoardList />} />
          <Route path="board/:boardId" element={<KanbanBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
