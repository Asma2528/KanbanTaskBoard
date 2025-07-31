import { create } from 'zustand'; // Zustand for global state management
import type { Project, Task, ColumnType } from '../types/index'; // Custom types
import { persist } from 'zustand/middleware'; // Middleware to persist state in localStorage
import { nanoid } from 'nanoid'; // Unique ID generator


interface State {
  projects: Project[]; // All projects
  currentProjectId: string | null; // Currently selected project

  // Project operations
  addProject: (name: string) => void;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string) => void;

  // Task operations for current project
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newColumn: ColumnType) => void;
}


export const useStore = create<State>()(
  persist(
    (set, get) => ({
      projects: [], // Initially no projects
      currentProjectId: null, // No project selected by default


      // Add a new project with a generated ID
      addProject: (name) => {
        const newProject = {
          id: nanoid(),
          name,
          tasks: [],
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProjectId: newProject.id, // Set new project as current
        }));
      },

      // Rename a project by ID
      renameProject: (id, name) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        }));
      },

      // Delete a project by ID and update currentProjectId
      deleteProject: (id) => {
        set((state) => {
          const updated = state.projects.filter((p) => p.id !== id);
          return {
            projects: updated,
            currentProjectId: updated[0]?.id || null, // Set to first available project or null
          };
        });
      },

      // Set which project is currently active
      setCurrentProject: (id) => set({ currentProjectId: id }),

      // Add a task to the current project
      addTask: (task) => {
        const project = get().projects.find(p => p.id === get().currentProjectId);
        if (!project) return;

        const newTask: Task = {
          ...task,
          id: nanoid(),
          createdAt: new Date().toISOString(),
        };

        project.tasks.push(newTask);
        set({ projects: [...get().projects] }); // Trigger state update
      },

      // Update task details in the current project
      updateTask: (updatedTask) => {
        const currentProjectId = get().currentProjectId;
        if (!currentProjectId) return;

        const projects = get().projects.map(project => {
          if (project.id !== currentProjectId) return project;

          const updatedTasks = project.tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          );

          return { ...project, tasks: updatedTasks };
        });

        set({ projects });
      },

      // Delete task by ID from current project
      deleteTask: (id) => {
        const project = get().projects.find(p => p.id === get().currentProjectId);
        if (!project) return;

        project.tasks = project.tasks.filter(t => t.id !== id);
        set({ projects: [...get().projects] });
      },

      // Move task to a different column (e.g., from "Todo" to "In Progress")
      moveTask: (id, newColumn) => {
        const project = get().projects.find(p => p.id === get().currentProjectId);
        if (!project) return;

        const task = project.tasks.find(t => t.id === id);
        if (task) {
          task.column = newColumn;
          set({ projects: [...get().projects] });
        }
      },
    }),
    {
      name: 'kanban-data', // Key for storing in localStorage
    }
  )
);
