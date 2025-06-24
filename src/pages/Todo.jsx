import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', dueDate: '', importance: 'low' });
  const [editingId, setEditingId] = useState(null);
  const [editedTodo, setEditedTodo] = useState({});
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch todos:', err.response?.data || err.message);
    }
  };

  const addTodo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/todos', newTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos([...todos, res.data]);
      setNewTodo({ title: '', description: '', dueDate: '', importance: 'low' });
    } catch (err) {
      console.error('❌ Failed to add todo:', err.response?.data || err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('❌ Failed to delete todo:', err.response?.data || err.message);
    }
  };

  const updateTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, editedTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.map(todo => todo._id === id ? res.data : todo));
      setEditingId(null);
    } catch (err) {
      console.error('❌ Failed to update todo:', err.response?.data || err.message);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/todos/${todo._id}`, {
        completed: !todo.completed
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.map(t => t._id === todo._id ? res.data : t));
    } catch (err) {
      console.error('❌ Failed to toggle completion:', err.response?.data || err.message);
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === 'createdAt') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === 'importance') {
      const levels = { low: 1, med: 2, high: 3 };
      return levels[b.importance] - levels[a.importance]; // high first
    }
    return 0;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Todos</h2>
      <div style={{ marginBottom: '10px' }}>
        <input placeholder="Title" value={newTodo.title} onChange={e => setNewTodo({ ...newTodo, title: e.target.value })} />
        <input placeholder="Description" value={newTodo.description} onChange={e => setNewTodo({ ...newTodo, description: e.target.value })} />
        <input type="date" value={newTodo.dueDate} onChange={e => setNewTodo({ ...newTodo, dueDate: e.target.value })} />
        <select value={newTodo.importance} onChange={e => setNewTodo({ ...newTodo, importance: e.target.value })}>
          <option value="low">Low</option>
          <option value="med">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={addTodo}>Add</button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Sort By: </label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="createdAt">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="importance">Importance</option>
        </select>
      </div>

      <ul>
        {sortedTodos.map(todo => (
          <li key={todo._id} style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}>
            {editingId === todo._id ? (
              <>
                <input value={editedTodo.title} onChange={e => setEditedTodo({ ...editedTodo, title: e.target.value })} />
                <input value={editedTodo.description} onChange={e => setEditedTodo({ ...editedTodo, description: e.target.value })} />
                <input type="date" value={editedTodo.dueDate} onChange={e => setEditedTodo({ ...editedTodo, dueDate: e.target.value })} />
                <select value={editedTodo.importance} onChange={e => setEditedTodo({ ...editedTodo, importance: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="med">Medium</option>
                  <option value="high">High</option>
                </select>
                <button onClick={() => updateTodo(todo._id)}>Save</button>
              </>
            ) : (
              <>
                <strong>{todo.title}</strong> - {todo.description}<br />
                📅 Due: {todo.dueDate} | 🕓 Created: {new Date(todo.createdAt).toLocaleString()}<br />
                🔥 Priority: {todo.importance} | ✅ Completed: {todo.completed ? 'Yes' : 'No'}<br />
                <button onClick={() => {
                  setEditingId(todo._id);
                  setEditedTodo({
                    title: todo.title,
                    description: todo.description,
                    dueDate: todo.dueDate,
                    importance: todo.importance,
                  });
                }}>Edit</button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                <button onClick={() => toggleComplete(todo)}>
                  {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
