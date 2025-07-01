// src/pages/Calendar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(null);
  const [todos, setTodos] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(res.data);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };

    fetchTodos();
  }, []);

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const totalDays = getDaysInMonth(month, year);
  const startDay = getFirstDayOfMonth(month, year);

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let day = 1; day <= totalDays; day++) calendarDays.push(day);

  const getWeekFromDate = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return [...Array(7)].map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const goToPrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
    setSelectedDay(null);
  };

  const getTodosForDate = (date) =>
    todos.filter((todo) => {
      const due = new Date(todo.dueDate);
      return (
        due.getFullYear() === date.getFullYear() &&
        due.getMonth() === date.getMonth() &&
        due.getDate() === date.getDate()
      );
    });

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={goToPrevMonth}>◀</button>
        <h1>
          {currentMonth.toLocaleString("default", { month: "long" })} {year}
        </h1>
        <button onClick={goToNextMonth}>▶</button>
      </div>

      {/* Calendar Header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", fontWeight: "bold" }}>
        {daysOfWeek.map((day) => (
          <div key={day} style={{ textAlign: "center", padding: "5px" }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {calendarDays.map((day, index) => {
          const fullDate = day ? new Date(year, month, day) : null;
          const taskCount = fullDate ? getTodosForDate(fullDate).length : 0;

          return (
            <div
              key={index}
              style={{
                height: "80px",
                border: "1px solid #ccc",
                padding: "5px",
                backgroundColor: day ? "#f9f9f9" : "transparent",
                cursor: day ? "pointer" : "default",
              }}
              onClick={() => day && setSelectedDay(fullDate)}
            >
              {day && (
                <>
                  <strong>{day}</strong>
                  <div style={{ fontSize: "0.8rem", color: "#555" }}>
                    {taskCount} task{taskCount !== 1 ? "s" : ""}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Task View */}
      {selectedDay && (
        <div style={{ marginTop: "20px" }}>
          <h2>Week of {selectedDay.toDateString()}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px" }}>
            {getWeekFromDate(selectedDay).map((dateObj, idx) => {
              const tasks = getTodosForDate(dateObj);
              return (
                <div
                  key={idx}
                  style={{ border: "1px solid #ccc", padding: "10px", cursor: "pointer" }}
                  onClick={() => navigate(`/calendar/day/${dateObj.toISOString()}`)}
                >
                  <strong>{daysOfWeek[dateObj.getDay()]}</strong>
                  <div>{dateObj.getDate()}</div>
                  {tasks.map((task) => (
                    <div key={task._id} style={{ fontSize: "0.85rem", marginTop: "5px" }}>
                      • {task.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
