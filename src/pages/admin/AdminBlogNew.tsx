// src/pages/admin/AdminBlogNew.tsx
import React from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminBlogEditor from "../../components/admin/AdminBlogEditor";

export default function AdminBlogNew() {
  return (
    <AdminLayout>
      <AdminBlogEditor mode="create" initialPost={null} />
    </AdminLayout>
  );
}
