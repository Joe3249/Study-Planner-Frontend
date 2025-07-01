import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Todo from './pages/Todo';
import Calendar from './pages/Calendar';
import CalendarDay from './pages/CalendarDay';



const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/calendar/day/:date" element={<CalendarDay />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todos" element={<Todo />} />
          <Route path="*" element={<Login />} />
          <Route path="/calendar" element={<Calendar />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
