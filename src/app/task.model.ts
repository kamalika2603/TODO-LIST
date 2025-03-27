export interface Task {
  id: string;
  name: string;
  category: string;
  description: string;
  deadline: Date | null;
}
