import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './NavBar.css';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          📚 Review Scheduler
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/problems" className="navbar-link">
              问题列表
            </Link>
          </li>
          <li>
            <Link to="/settings" className="navbar-link">
              设置
            </Link>
          </li>
        </ul>

        <div className="navbar-user">
          <button
            className="navbar-avatar"
            onClick={() => setShowMenu(!showMenu)}
          >
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </button>

          {showMenu && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-header">
                <div className="navbar-dropdown-name">{user?.name}</div>
                <div className="navbar-dropdown-email">{user?.email}</div>
              </div>
              <div className="navbar-dropdown-divider"></div>
              <button
                className="navbar-dropdown-item"
                onClick={handleLogout}
              >
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

