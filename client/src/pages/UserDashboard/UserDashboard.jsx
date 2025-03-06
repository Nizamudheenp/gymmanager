import React from "react";
import { Outlet } from "react-router-dom";
import DashBoardLayout from "../../components/DashBoardLayout";

function UserDashboard() {
  return (
   <DashBoardLayout>
    <Outlet />
   </DashBoardLayout>
  );
}

export default UserDashboard;
