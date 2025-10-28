// src/pages/admin/AdminLoginPage.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const BG = {
  dots: {
    backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1.2px, transparent 1.2px)",
    backgroundSize: "18px 18px",
    backgroundColor: "#0f766e",
  } as React.CSSProperties,
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ако вече е логнат → към dashboard
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate("/admin/dashboard", { replace: true });
    })();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    const to = location.state?.from || "/admin/dashboard";
    navigate(to, { replace: true });
  }

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* Hero header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden style={BG.dots} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl lg:text-6xl font-pudelinka font-bold"
          >
            Админ панел
          </motion.h1>
          <p className="mt-4 text-white/90">
            Вход за екипа. Данните се валидират през Supabase Authentication.
          </p>
        </div>
      </section>

      {/* Login card */}
      <section className="py-10">
        <div className="max-w-md mx-auto px-4">
          <div className="rounded-3xl bg-white border border-sand/30 shadow-xl p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Имейл</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-sand/40 px-4 py-3 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="you@example.com"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Парола</label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  className="w-full rounded-xl border border-sand/40 px-4 py-3 outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {err && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-teal text-white px-5 py-3 rounded-2xl shadow hover:bg-teal-dark disabled:opacity-60"
              >
                <LogIn className="w-5 h-5" />
                Вход
              </button>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              С влизането приемате вътрешните правила за достъп.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
