export type ColumnType = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  column: ColumnType;
}

export interface Project {
  id: string;
  name: string;
  tasks: Task[];
}
