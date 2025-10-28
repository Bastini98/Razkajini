// src/pages/admin/AdminDashboard.tsx
import React from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Блог", desc: "Създавай и редактирай статии, SEO мета, изображения." },
          { title: "Покупки", desc: "Поръчки, статуси, детайли за плащания и fulfillment." },
          { title: "Форми за запитване", desc: "Събрани запитвания от сайта и контакт формите." },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl bg-white border border-sand/30 shadow-md p-5"
          >
            <h3 className="text-2xl font-pudelinka text-ink">{c.title}</h3>
            <p className="text-gray-700 mt-2">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
}
