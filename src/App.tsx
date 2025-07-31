import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Board from './components/Board';
import { FiMenu } from 'react-icons/fi';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // toggle for mobile sidebar

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 ">
      
      {/* Sidebar - fixed for mobile, static for larger screens */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform transform bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 sm:relative sm:translate-x-0 sm:w-64 ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay to close sidebar on mobile when background is clicked */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        
        {/* Top navigation bar for mobile with menu toggle */}
        <div className="sm:hidden p-3 border-b dark:border-zinc-700 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-800 dark:text-white text-2xl"
          >
            <FiMenu />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Kanban Board</h1>
        </div>

        {/* Kanban board content */}
        <Board />
      </div>
    </div>
  );
}

