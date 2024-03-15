export default interface iKanbanCard {
  id: string;
  title: string;
  list_id: string;
  description?: string;
  due_date?: string; // yyyy-mm-dd
  completed: boolean;
  display_sequence: number;
}
