'use client'

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; 
import TaskModal from "./TaskModal"; // Import the modal component

export default function SearchBar() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAddTaskClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex justify-center mt-5">
      <div className="flex items-center bg-gray-100 p-2 rounded-full shadow-md">
        <input
          type="text"
          placeholder="Search"
          className="border-none bg-transparent rounded-full px-4 py-2 focus:outline-none w-64"
        />
        <button className="text-black px-4 py-2 rounded-full hover:bg-blue-600 flex items-center">
          <FaSearch />
        </button>
      </div>

      <div className="flex ml-4 space-x-2">
        <button
          onClick={handleAddTaskClick}
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
        >
          Add Task
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">
          Delete Task
        </button>
      </div>

      {/* Task Modal for adding a new task */}
      {isModalOpen && <TaskModal onClose={handleModalClose} />}
    </div>
  );
}
