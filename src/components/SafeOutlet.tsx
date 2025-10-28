import React from "react";
import { Outlet } from "react-router-dom";

// Няма нито един hook, само рендерира децата.
const SafeOutlet: React.FC = () => <Outlet />;

export default SafeOutlet;