// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Study Planner</h2>
      <div style={styles.links}>
        <Link to="/todos" style={styles.link}>Todos</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/calendar" style={styles.link}>Calendar</Link>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#282c34',
    color: 'white',
    padding: '10px 20px',
  },
  logo: {
    margin: 0,
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  button: {
    background: '#61dafb',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;
