import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import AdminBlogEditor from "../../components/admin/AdminBlogEditor";
import { supabase } from "../../lib/supabaseClient";

export default function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error) setPost(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="rounded-2xl bg-white border border-sand/30 shadow-md p-6">
          Зареждане…
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="rounded-2xl bg-white border border-sand/30 shadow-md p-6">
          Постът не е намерен.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminBlogEditor mode="edit" initialPost={post} />
    </AdminLayout>
  );
}
