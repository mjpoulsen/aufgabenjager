export default interface Task {
  id: number | undefined;
  title: string;
  description: string;
  due_date: string; // yyyy-mm-dd
  completed: boolean;
}
