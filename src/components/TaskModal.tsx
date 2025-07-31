import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { ColumnType, Task } from '../types';

interface Props {
  existingTask?: Task; // if passed, modal works in edit mode
  onClose: () => void;
}

const columnOptions: ColumnType[] = ['todo', 'inprogress', 'done'];

export default function TaskModal({ existingTask, onClose }: Props) {
  const isEditing = !!existingTask;
  const { addTask, updateTask } = useStore();

  // Form fields
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [column, setColumn] = useState<ColumnType>(existingTask?.column || 'todo');
  const [error, setError] = useState('');

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle form submission
  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (isEditing) {
      // Update existing task
      updateTask({ ...existingTask!, title: title.trim(), description, column });
    } else {
      // Create new task
      addTask({ title: title.trim(), description, column });
    }

    onClose(); // Close modal after saving
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 px-2">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 space-y-4 max-h-screen overflow-y-auto">
        
        {/* Modal Heading */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </h3>

        <div className="space-y-3">
          {/* Title Input */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded bg-white dark:bg-zinc-800 text-sm text-gray-800 dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Description</label>
            <textarea
              className="w-full mt-1 p-2 border rounded bg-white dark:bg-zinc-800 text-sm text-gray-800 dark:text-white"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Column Dropdown */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300">Column</label>
            <select
              value={column}
              onChange={(e) => setColumn(e.target.value as ColumnType)}
              className="w-full mt-1 p-2 border rounded bg-white dark:bg-zinc-800 text-sm text-gray-800 dark:text-white"
            >
              {columnOptions.map((col) => (
                <option key={col} value={col}>
                  {col === 'todo' ? 'To Do' : col === 'inprogress' ? 'In Progress' : 'Done'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
          <button
            className="w-full sm:w-auto px-4 py-2 rounded border dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
