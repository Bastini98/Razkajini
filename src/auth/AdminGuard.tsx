// src/auth/AdminGuard.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// TODO: направи го от env или от таблица по-късно.
// Засега whitelist по имейл:
const ALLOWED_ADMINS = [
  // "you@example.com",
];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user || null;
      if (!mounted) return;

      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // ако няма whitelist → всеки логнат е admin
      if (!ALLOWED_ADMINS.length) {
        setAllowed(true);
        setLoading(false);
        return;
      }

      const ok = !!user.email && ALLOWED_ADMINS.includes(user.email.toLowerCase());
      setAllowed(ok);
      setLoading(false);
    })();

    // live updates (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      (async () => {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user || null;
        if (!user) {
          setAllowed(false);
          setLoading(false);
          return;
        }
        if (!ALLOWED_ADMINS.length) {
          setAllowed(true);
          setLoading(false);
          return;
        }
        const ok = !!user.email && ALLOWED_ADMINS.includes(user.email.toLowerCase());
        setAllowed(ok);
        setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-texture flex items-center justify-center">
        <div className="w-80 h-32 rounded-2xl border border-sand/30 bg-white shadow-md flex items-center justify-center">
          <span className="animate-pulse text-gray-700">Зареждане…</span>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
