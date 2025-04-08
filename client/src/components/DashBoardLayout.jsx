import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="main-content" style={{ background: "rgba(177, 179, 168, 0.8)", height:"100%", minHeight:"100vh"}}>
        <div className="container mt-4">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
