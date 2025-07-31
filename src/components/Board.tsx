// Importing Zustand store and required components
import { useStore } from '../store/useStore';
import Column from './Column';           // Kanban Column component
import TaskModal from './TaskModal';     // Modal for adding new tasks
import type { ColumnType } from '../types/index';
import { useState } from 'react';

// DnD Kit imports for drag-and-drop
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

export default function Board() {
  // Accessing global state from Zustand
  const { projects, currentProjectId, moveTask } = useStore();

  // Local state for modal and tab (for mobile view)
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ColumnType>('todo'); // default mobile tab

  // Find the currently selected project from global store
  const currentProject = projects.find(p => p.id === currentProjectId);

  // Kanban columns to render
  const columns: ColumnType[] = ['todo', 'inprogress', 'done'];

  // Set up drag-and-drop sensors
  const sensors = useSensors(useSensor(PointerSensor));

  // Handle task drag end (drop)
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newColumn = over.id as ColumnType;

    // Find the dragged task and update its column if changed
    const task = currentProject?.tasks.find(t => t.id === taskId);
    if (task && task.column !== newColumn) {
      moveTask(taskId, newColumn);
    }
  };

  // If no project is selected, prompt the user
  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select or create a project to begin.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] sm:h-screen overflow-hidden">
      {/* Project header: Project title and Add Task button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-4 border-b dark:border-zinc-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {currentProject.name}
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto sm:self-auto self-stretch"
        >
          + Add Task
        </button>
      </div>

      {/* Mobile-only Column Tabs: Toggles between single-column views */}
      <div className="sm:hidden flex justify-around border-b dark:border-zinc-700 text-sm">
        {columns.map((col) => (
          <button
            key={col}
            onClick={() => setActiveTab(col)}
            className={`flex-1 py-2 text-center ${activeTab === col
                ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
                : 'text-gray-500'
              }`}
          >
            {col === 'todo'
              ? 'To Do'
              : col === 'inprogress'
                ? 'In Progress'
                : 'Done'}
          </button>
        ))}
      </div>

      {/* Kanban Columns with drag-and-drop support */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>

        {/* Mobile View: Only active tab's column is visible */}
        <div className="sm:hidden p-4 overflow-y-auto flex-1">
          <Column
            column={activeTab}
            tasks={currentProject.tasks.filter((t) => t.column === activeTab)}
          />
        </div>

        {/* Tablet/Desktop View: Show all columns side by side and scrollable if needed */}
        <div className="hidden sm:block flex-1 overflow-x-auto">
          <div className="flex gap-4 px-2 py-4 w-max sm:w-full h-full">
            {columns.map((col) => (
              <Column
                key={col}
                column={col}
                tasks={currentProject.tasks.filter((t) => t.column === col)}
              />
            ))}
          </div>
        </div>
      </DndContext>

      {/* Task creation modal, toggled via button */}
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
