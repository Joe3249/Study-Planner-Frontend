// src/pages/CalendarDay.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CalendarDay = () => {
  const { date } = useParams(); // Get the date from the URL
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    dueDate: date,
    importance: 'medium',
    description: '',
    completed: false,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/todos', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filter todos for the selected day
        const selected = res.data.filter(todo => {
          const todoDate = new Date(todo.dueDate).toDateString();
          return todoDate === new Date(date).toDateString();
        });

        setTodos(selected);
      } catch (err) {
        console.error('Failed to fetch todos:', err);
      }
    };

    fetchTodos();
  }, [date, token]);

  const handleAddTodo = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/todos', newTodo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos([...todos, res.data]);
      setNewTodo({ ...newTodo, title: '', description: '' }); // Clear inputs
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const toggleCompleted = async (id, completed) => {
    try {
      const updated = await axios.put(`http://localhost:5000/api/todos/${id}`, { completed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.map(t => (t._id === id ? updated.data : t)));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tasks for {new Date(date).toDateString()}</h2>

      {/* Add New Todo */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <select
          value={newTodo.importance}
          onChange={e => setNewTodo({ ...newTodo, importance: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>

      {/* Todo List */}
      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ marginBottom: '10px' }}>
            <strong>{todo.title}</strong> ({todo.importance})<br />
            {todo.description}<br />
            Completed: 
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo._id, !todo.completed)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarDay;
