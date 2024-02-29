export default interface iKanbanCard {
  id: string;
  title: string;
  listId: string;
  description?: string;
  dueDate?: string; // yyyy-mm-dd
  completed: boolean;
  displayOrder: number;
}
