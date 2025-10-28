// src/components/PageTurnTransition.tsx
import React from "react";
import { Outlet } from "react-router-dom";

const PageTurnTransition: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
};

export default PageTurnTransition;
 