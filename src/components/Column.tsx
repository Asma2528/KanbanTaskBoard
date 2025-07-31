import type { Task, ColumnType } from '../types/index';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';

interface Props {
  column: ColumnType;
  tasks: Task[];
}

// Mapping column key to readable title
const columnTitles: Record<ColumnType, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

export default function Column({ column, tasks }: Props) {
  // Make this column a drop target
  const { setNodeRef } = useDroppable({
    id: column,
  });

  return (
    <div
      ref={setNodeRef}
      className="w-[85vw] sm:min-w-[300px] sm:max-w-[350px] bg-white dark:bg-zinc-900 shadow rounded-lg p-4 flex flex-col gap-4"
    >
      <h3 className="text-lg font-semibold text-gray-700 dark:text-white">{columnTitles[column]}</h3>

      {/* List of draggable task cards */}
      <div className="flex flex-col gap-3 min-h-[100px]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
