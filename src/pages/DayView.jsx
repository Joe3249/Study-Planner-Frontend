import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DayView = () => {
  const { date } = useParams(); // from /calendar/day/:date
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const dayTodos = res.data.filter(todo =>
        new Date(todo.dueDate).toDateString() === new Date(date).toDateString()
      );
      setTodos(dayTodos);
    });
  }, [date]);

  return (
    <div>
      <h2>Todos for {new Date(date).toDateString()}</h2>
      {todos.map(todo => (
        <div key={todo._id}>
          <p>{todo.title}</p>
          {/* Add edit options here */}
        </div>
      ))}
    </div>
  );
};

export default DayView;
