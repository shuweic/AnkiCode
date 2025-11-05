import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="ankicode-layout">
      <Sidebar />
      <main className="ankicode-main">
        <div className="ankicode-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
