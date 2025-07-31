import { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { cn } from '../utils/cn'; 
import { MdDeleteOutline } from "react-icons/md";
import { useStore } from '../store/useStore';
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

export default function Sidebar() {
  // Project states and store actions
  const {
    projects,
    currentProjectId,
    addProject,
    deleteProject,
    renameProject,
    setCurrentProject,
  } = useStore();

  // Local state for new project and renaming
  const [newProjectName, setNewProjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  // Add a new project if input is not empty
  const handleAdd = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName('');
    }
  };

  // Rename project if input is not empty
  const handleRename = (id: string) => {
    if (editedName.trim()) {
      renameProject(id, editedName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="w-64 h-full overflow-y-auto bg-gray-100 dark:bg-zinc-900 border-r border-gray-300 dark:border-zinc-700 p-3 flex-shrink-0">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Projects</h2>

      {/* Input field to add a new project */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          className="w-full p-2 rounded border text-sm"
          placeholder="New project"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      {/* List of projects with edit and delete options */}
      <ul className="space-y-2">
        {projects.map((proj) => (
          <li
            key={proj.id}
            className={cn(
              'p-2 rounded group cursor-pointer hover:bg-blue-100 dark:hover:bg-zinc-800',
              proj.id === currentProjectId ? 'bg-blue-200 dark:bg-zinc-700 font-semibold' : ''
            )}
            onClick={() => setCurrentProject(proj.id)}
          >
            {editingId === proj.id ? (
              // Rename project input
              <div className="flex  items-center">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-sm rounded px-1 border"
                />
                <TiTick onClick={() => handleRename(proj.id)} className="text-md text-green-500" />
                <RxCross2 onClick={() => setEditingId(null)} className="text-md text-red-500" />
              </div>
            ) : (
              // Display project name with edit/delete icons (on hover)
              <div className="flex justify-between items-center">
                <span className="truncate">{proj.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    className="text-md text-yellow-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(proj.id);
                      setEditedName(proj.name);
                    }}
                  >
                    <CiEdit />
                  </button>
                  <button
                    className="text-sm text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(proj.id);
                    }}
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

