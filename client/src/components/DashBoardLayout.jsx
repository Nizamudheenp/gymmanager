import React, { useState } from 'react'
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function DashBoardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="d-flex"> 
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} /> 
 
    <div className={`main-content ${isSidebarOpen ? "expanded" : "collapsed"}`}>
      <div className="container mt-4">
        <Outlet /> 
      </div>
    </div>
  </div>
  )
}

export default DashBoardLayout