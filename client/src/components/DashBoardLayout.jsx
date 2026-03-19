import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="main-content" style={{ flex: 1, minHeight: "100vh", background: "#0a0a0a" }}>
        <div className="dashboard-wrapper">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
