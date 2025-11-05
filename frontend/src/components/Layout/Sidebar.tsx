import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="ankicode-sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <Link to="/dashboard" className="brand-link">
          <div className="brand-icon">🧠</div>
          <span className="brand-name">Ankicode</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-label">概览</div>
          <Link 
            to="/dashboard" 
            className={`nav-item ${isActive('/dashboard') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">📊</div>
            <span className="nav-item-text">Dashboard</span>
          </Link>
          <Link 
            to="/dashboard/today" 
            className={`nav-item ${isActive('/dashboard/today') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">📅</div>
            <span className="nav-item-text">今日复习</span>
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-label">管理</div>
          <Link 
            to="/problems" 
            className={`nav-item ${isActive('/problems') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">💻</div>
            <span className="nav-item-text">题目列表</span>
          </Link>
          <Link 
            to="/reminders" 
            className={`nav-item ${isActive('/reminders') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">⏰</div>
            <span className="nav-item-text">提醒列表</span>
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-label">设置</div>
          <Link 
            to="/settings" 
            className={`nav-item ${isActive('/settings') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">⚙️</div>
            <span className="nav-item-text">个人设置</span>
          </Link>
        </div>
      </nav>

      {/* User Profile */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <button 
            className="user-profile-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || '用户'}</div>
              <div className="user-email">{user?.email}</div>
            </div>
            <div className="user-menu-icon">
              {showUserMenu ? '▲' : '▼'}
            </div>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <Link 
                to="/settings" 
                className="user-dropdown-item"
                onClick={() => setShowUserMenu(false)}
              >
                <span>⚙️</span>
                <span>个人设置</span>
              </Link>
              <div className="user-dropdown-divider"></div>
              <button 
                className="user-dropdown-item logout-button"
                onClick={handleLogout}
              >
                <span>🚪</span>
                <span>退出登录</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
