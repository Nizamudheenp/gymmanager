import React from 'react'
import { Outlet } from "react-router-dom";
import DashBoardLayout from '../../components/DashBoardLayout';

function AdminDashboard() {
  return (
   <DashBoardLayout>
    <Outlet />
   </DashBoardLayout>
  )
}

export default AdminDashboard