'use client'

import React, { useState } from "react";

const TaskModal = ({ onClose }) => {
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskData = {
      description,
      subject,
      priority,
      deadline,
      isCompleted: false, // Default value
    };

    try {
      const response = await fetch('/api/tasks', { // Adjust the API endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Error creating task');
      }

      // Reset form fields after successful task creation
      setDescription("");
      setSubject("");
      setPriority("");
      setDeadline("");
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-5 w-96">
        <h2 className="text-lg font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Priority</label>
            <input
              type="text"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border rounded w-full px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
