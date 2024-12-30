import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2, CheckCircle, Circle, AlertCircle } from 'lucide-react';

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
        category,
        dueDate,
        priority,
        createdAt: new Date().toISOString()
      }
    ]);
    setNewTask('');
    setDueDate('');
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Enhanced Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addTask} className="mb-6 space-y-4">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="grid grid-cols-3 gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="p-2 border rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </form>

        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`p-4 border rounded-lg flex items-center justify-between ${
                task.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center space-x-3 flex-grow">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="focus:outline-none"
                >
                  {task.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                
                <div className="flex flex-col">
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.text}
                  </span>
                  <div className="flex space-x-2 text-sm text-gray-500">
                    <span className="capitalize">{task.category}</span>
                    {task.dueDate && (
                      <span>• Due: {formatDate(task.dueDate)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertCircle className={`w-5 h-5 ${getPriorityColor(task.priority)}`} />
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-600 focus:outline-none"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoApp;
