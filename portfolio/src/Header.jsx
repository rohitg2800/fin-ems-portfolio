import React, { useState, useEffect } from 'react';
import './Header.css';

/**
 * A simple header/navigation component with a dark/light theme toggle.
 *
 * This file is intended to show how the static HTML navbar could be
 * implemented in a React-based application.  It mirrors the structure
 * and behaviour from the existing plain‑JS version in the workspace.
 */
const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  // read stored preference on mount
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light-mode';
    setDarkMode(theme === 'dark-mode');
    document.body.classList.add(theme);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    const theme = newMode ? 'dark-mode' : 'light-mode';
    document.body.classList.toggle('dark-mode', newMode);
    localStorage.setItem('theme', theme);
  };

  return (
    <nav className="nav-container">
      <div className="logo">MyPortfolio</div>
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#devops">DevOps</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        title="Toggle dark/light mode"
      >
        <svg className="theme-icon sun-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2">
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="12"
                y1="1"
                x2="12"
                y2="3"
                transform={`rotate(${i * 45} 12 12)`}
              />
            ))}
          </g>
        </svg>
        <svg className="theme-icon moon-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      </button>
    </nav>
  );
};

export default Header;
