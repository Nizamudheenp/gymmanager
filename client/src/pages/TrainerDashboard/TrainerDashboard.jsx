import React from "react";
import { Outlet } from "react-router-dom";
import DashBoardLayout from '../../components/DashBoardLayout';

function TrainerDashboard() {
  return (
    <DashBoardLayout>
      <Outlet />
    </DashBoardLayout>
  );
}

export default TrainerDashboard;
