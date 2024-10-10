'use client'
import React, { useEffect, useState } from "react";

export default function Billboard() {
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState({ visible: false, type: '', taskId: null });
  const [newDescription, setNewDescription] = useState('');
  const [newTaskData, setNewTaskData] = useState({ subject: '', priority: '', deadline: '', isCompleted: false });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks'); // Assuming the endpoint is /api/tasks
      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        console.error('Error fetching tasks:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const openModal = (type, id) => {
    const task = tasks.find(task => task.id === id);
    setNewDescription(task ? task.description : '');
    setModal({ visible: true, type, taskId: id });
  };

  const handleUpdate = async () => {
    const { taskId } = modal;
    const updatedTask = {
      description: newDescription,
      subject: newTaskData.subject,
      priority: newTaskData.priority,
      deadline: newTaskData.deadline,
      isCompleted: newTaskData.isCompleted,
    };

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.map(task => (task.id === taskId ? data : task)));
        closeModal();
      } else {
        console.error('Error updating task:', data.error);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    const { taskId } = modal;
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
        closeModal();
      } else {
        const data = await response.json();
        console.error('Error deleting task:', data.error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleComplete = async (id) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
      const updatedTask = { ...task, isCompleted: true };
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });
        const data = await response.json();
        if (response.ok) {
          setTasks(tasks.map(t => (t.id === id ? data : t)));
        } else {
          console.error('Error updating task:', data.error);
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const closeModal = () => {
    setModal({ ...modal, visible: false });
    setNewDescription(''); // Clear description input
  };

  const incompleteTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);
  console.log(tasks)

  return (
    <div>
      {/* Modal for confirmation */}
      {modal.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-6 shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">
              {modal.type === 'update' ? 'Update Task' : 'Delete Task'}
            </h2>
            {modal.type === 'update' ? (
              <>
                <p>Enter new description:</p>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 w-full mt-2"
                />
              </>
            ) : (
              <p>Do you want to delete this task?</p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={modal.type === 'update' ? handleUpdate : handleDelete}
              >
                Yes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={closeModal}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incomplete Tasks Table */}
      <h2 className="text-xl font-bold m-6">Incomplete Tasks</h2>
      <div className="overflow-x-auto m-6 rounded-md border">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-white text-black">
            <tr>
             
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Subject</th>
              <th className="py-2 px-4 border">Priority</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incompleteTasks.length > 0 ? (
              incompleteTasks.map((task) => (
                <tr key={task.id} className="text-center">
                 
                  <td className="py-2 px-4 border">{task.description}</td>
                  <td className="py-2 px-4 border">{task.subject}</td>
                  <td className="py-2 px-4 border">{task.priority}</td>
                  <td className="py-2 px-4 border">{task.deadline}</td>
                  <td className="py-2 px-4 border space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md"
                      onClick={() => openModal('update', task.id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md"
                      onClick={() => handleComplete(task.id)}
                    >
                      Complete
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                      onClick={() => openModal('delete', task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-2 text-center">No incomplete tasks available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Completed Tasks Table */}
      <h2 className="text-xl font-bold m-6">Completed Tasks</h2>
      <div className="overflow-x-auto m-6 rounded-md border">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-white text-black">
            <tr>
              
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Subject</th>
              <th className="py-2 px-4 border">Priority</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.map((task) => (
              <tr key={task.id} className="text-center">
               
                <td className="py-2 px-4 border">{task.description}</td>
                <td className="py-2 px-4 border">{task.subject}</td>
                <td className="py-2 px-4 border">{task.priority}</td>
                <td className="py-2 px-4 border">{task.deadline}</td>
              </tr>
            ))}
            {completedTasks.length === 0 && (
              <tr>
                <td colSpan="5" className="py-2 text-center">No completed tasks available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
