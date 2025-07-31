import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types/index';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import TaskModal from './TaskModal';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { RiDragMove2Fill } from 'react-icons/ri';

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const { deleteTask } = useStore(); // Access delete function from Zustand store
  const [isEditing, setIsEditing] = useState(false); // Local state to control modal visibility

  // Set up drag behavior for the task card
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  // Style transformation for drag animation
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transform ? 'none' : 'transform 0.2s ease',
  };

  return (
    <>
      {/* Task Card Container */}
      <div
        ref={setNodeRef} // Make this div draggable
        style={style} // Apply drag transformation
        className="bg-gray-100 dark:bg-zinc-800 rounded p-3 shadow-sm text-sm relative overflow-hidden"
      >
        {/* Drag Handle Icon */}
        <div
          {...listeners}
          {...attributes}
          className="absolute left-1 top-1 text-gray-400 cursor-grab text-xl"
          title="Drag"
        >
          <RiDragMove2Fill />
        </div>

        {/* Task Title & Description */}
        <div className="pl-7 pr-10">
          <h4 className="font-medium text-gray-800 dark:text-white break-words">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 break-words">
              {task.description}
            </p>
          )}
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Edit/Delete Buttons */}
        <div className="absolute top-1 right-2 flex gap-2 text-lg">
          {/* Open edit modal */}
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <CiEdit />
          </button>

          {/* Delete task */}
          <button
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteTask(task.id);
            }}
          >
            <MdDeleteOutline />
          </button>
        </div>
      </div>

      {/* Task Edit Modal */}
      {isEditing && (
        <TaskModal
          existingTask={task} // pass current task data for editing
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
