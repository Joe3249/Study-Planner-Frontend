// src/components/TodoList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/todos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setTodos(res.data);
    })
    .catch(err => {
      setError(err.response?.data?.error || 'Failed to fetch todos');
    });
  }, []);

  return (
    <div>
      <h2>Your Todos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
