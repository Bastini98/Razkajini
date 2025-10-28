// src/layouts/AdminLayout.tsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, ShoppingCart, FileQuestion, LogOut } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const logo = "https://i.ibb.co/S70rh1nm/lohonavbar.webp";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/admin");
  }

  return (
    <div className="min-h-screen bg-paper-texture">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-sand/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img src={logo} alt="Разкажи ни!" className="h-10 w-auto" />
            <span className="font-colus text-teal text-lg">Admin</span>
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-sand/40 hover:border-teal text-gray-700 hover:text-teal transition"
          >
            <LogOut className="w-4 h-4" />
            Изход
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 h-max rounded-2xl bg-white border border-sand/30 shadow-md p-4">
          <nav className="space-y-1">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                  isActive ? "bg-teal text-white" : "hover:bg-sand/10 text-gray-800"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Табло
            </NavLink>
            <NavLink
              to="/admin/blog"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                  isActive ? "bg-teal text-white" : "hover:bg-sand/10 text-gray-800"
                }`
              }
            >
              <FileText className="w-5 h-5" />
              Блог
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                  isActive ? "bg-teal text-white" : "hover:bg-sand/10 text-gray-800"
                }`
              }
            >
              <ShoppingCart className="w-5 h-5" />
              Покупки
            </NavLink>
            <NavLink
              to="/admin/inquiries"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition ${
                  isActive ? "bg-teal text-white" : "hover:bg-sand/10 text-gray-800"
                }`
              }
            >
              <FileQuestion className="w-5 h-5" />
              Форми за запитване
            </NavLink>
          </nav>
        </aside>

        {/* Content */}
        <main className="min-h-[60vh]">{children}</main>
      </div>
    </div>
  );
}
 