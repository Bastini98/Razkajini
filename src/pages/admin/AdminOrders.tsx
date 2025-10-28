// src/pages/admin/AdminOrders.tsx
import React from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminOrders() {
  return (
    <AdminLayout>
      <div className="rounded-2xl bg-white border border-sand/30 shadow-md p-6">
        <h1 className="text-3xl font-pudelinka text-ink">Покупки</h1>
        <p className="text-gray-700 mt-2">Скоро: таблица с поръчки и детайли.</p>
      </div>
    </AdminLayout>
  );
}
