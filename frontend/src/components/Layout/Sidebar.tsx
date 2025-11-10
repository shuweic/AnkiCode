import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  BarChart3, 
  Calendar, 
  Laptop, 
  Bell, 
  Settings, 
  ChevronUp, 
  ChevronDown, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => {
    // 精确匹配当前路径
    if (location.pathname === path) {
      return true;
    }
    // 对于子路径，需要确保后面跟着 '/'，避免误匹配
    // 例如：/dashboard 不应该匹配 /dashboard/today
    if (path !== '/dashboard' && location.pathname.startsWith(path + '/')) {
      return true;
    }
    return false;
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
          <div className="brand-icon">
            <Brain size={24} />
          </div>
          <span className="brand-name">Ankicode</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-label">Overview</div>
          <Link 
            to="/dashboard" 
            className={`nav-item ${isActive('/dashboard') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">
              <BarChart3 size={20} />
            </div>
            <span className="nav-item-text">Dashboard</span>
          </Link>
          <Link 
            to="/dashboard/today" 
            className={`nav-item ${isActive('/dashboard/today') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">
              <Calendar size={20} />
            </div>
            <span className="nav-item-text">Today's Review</span>
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-label">Manage</div>
          <Link 
            to="/problems" 
            className={`nav-item ${isActive('/problems') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">
              <Laptop size={20} />
            </div>
            <span className="nav-item-text">Problems</span>
          </Link>
          <Link 
            to="/reminders" 
            className={`nav-item ${isActive('/reminders') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">
              <Bell size={20} />
            </div>
            <span className="nav-item-text">Reminders</span>
          </Link>
        </div>

        <div className="nav-section">
          <div className="nav-section-label">Settings</div>
          <Link 
            to="/settings" 
            className={`nav-item ${isActive('/settings') ? 'nav-item-active' : ''}`}
          >
            <div className="nav-item-icon">
              <Settings size={20} />
            </div>
            <span className="nav-item-text">Preferences</span>
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
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email}</div>
            </div>
            <div className="user-menu-icon">
              {showUserMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <Link 
                to="/settings" 
                className="user-dropdown-item"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <div className="user-dropdown-divider"></div>
              <button 
                className="user-dropdown-item logout-button"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
