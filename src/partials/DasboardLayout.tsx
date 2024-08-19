import React from "react";
import { Outlet } from "react-router-dom";
import { BreadCrumbs } from "./BreadCrumbs";
import { Menu } from "./Menu";

const DashboardLayout: React.FC = () => {
  return (
    <div className="d-flex">
      <Menu />

      {/* Main Content */}
      <div className="flex-grow-1 p-3" id="main">
        <BreadCrumbs />

        <div className="bg-light p-4 rounded">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
