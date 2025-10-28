// src/pages/ContactPage.tsx
import React from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

type FormState = {
  full_name: string;
  phone: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  full_name: "",
  phone: "",
  email: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = React.useState<FormState>(initialState);
  const [errors, setErrors] = React.useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // базова email проверка — съдържа @ и .
  const isValidEmail = (v: string) => /\S+@\S+\.\S+/.test(v.trim());
  // само цифри, дължина 6–15
  const isValidPhone = (v: string) => /^[0-9]{6,15}$/.test(v);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // оставяме само цифри
      const digits = value.replace(/\D/g, "");
      setForm((f) => ({ ...f, phone: digits }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<FormState> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      nextErrors.full_name = "Моля, въведете име и фамилия (минимум 2 символа).";
    }
    if (!isValidPhone(form.phone)) {
      nextErrors.phone = "Телефонът трябва да е само цифри (6–15 цифри).";
    }
    if (!isValidEmail(form.email)) {
      nextErrors.email = "Моля, въведете валиден имейл (трябва да съдържа @ и .).";
    }
    if (!form.message.trim() || form.message.trim().length < 5) {
      nextErrors.message = "Моля, въведете запитване (минимум 5 символа).";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSuccess(false);
  setSubmitError(null);

  if (!validate()) return;

  setSubmitting(true);
  try {
    const source_path = window?.location?.pathname || null;
    const user_agent = navigator?.userAgent || null;

    const { error } = await supabase.from("contact_inquiries").insert([
      {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        source_path,
        user_agent,
        status: "new",
      },
    ]);

    if (error) {
      // покажи точната грешка за дебъг
      const hint =
        error.code === "42501" ? " (възможно е RLS/policy проблем)" :
        error.code === "23514" ? " (вероятно не минава CHECK валидатор)" :
        error.code === "42P01" ? " (таблицата/схемата липсва)" :
        "";
      setSubmitError(`Грешка: ${error.message}${hint}`);
      throw error;
    }

    setSuccess(true);
    setForm(initialState);
  } catch (err) {
    console.error(err);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sand-light to-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-5xl font-pudelinka font-bold text-ink">Свържи се с нас</h1>
            <p className="text-lg text-gray-700">
              Пиши ни за поръчки, въпроси или идеи. Отговаряме бързо и с внимание. 💛
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-sand/20 p-6 sm:p-10">
            {success && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 text-green-800 px-4 py-3">
                Благодарим! Запитването е изпратено успешно.
              </div>
            )}
            {submitError && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
                {submitError}
              </div>
            )}

            <form onSubmit={onSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Име и фамилия */}
                <div className="sm:col-span-2">
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Име и фамилия
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={form.full_name}
                    onChange={onChange}
                    required
                    aria-invalid={!!errors.full_name}
                    aria-describedby={errors.full_name ? "full_name-error" : undefined}
                    className={`w-full rounded-2xl border px-4 py-3 outline-none bg-white
                      ${errors.full_name ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                                         : "border-sand/40 focus:border-teal focus:ring-1 focus:ring-teal"}`}
                    placeholder="Пример: Мария Иванова"
                  />
                  {errors.full_name && (
                    <p id="full_name-error" className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                  )}
                </div>

                {/* Телефон */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон (само цифри)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={form.phone}
                    onChange={onChange}
                    required
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={`w-full rounded-2xl border px-4 py-3 outline-none bg-white
                      ${errors.phone ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                                      : "border-sand/40 focus:border-teal focus:ring-1 focus:ring-teal"}`}
                    placeholder="Пример: 0887123456"
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Имейл */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Имейл
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full rounded-2xl border px-4 py-3 outline-none bg-white
                      ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                                      : "border-sand/40 focus:border-teal focus:ring-1 focus:ring-teal"}`}
                    placeholder="example@mail.com"
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Запитване */}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Запитване
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={onChange}
                    required
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full rounded-2xl border px-4 py-3 outline-none bg-white resize-y
                      ${errors.message ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                                        : "border-sand/40 focus:border-teal focus:ring-1 focus:ring-teal"}`}
                    placeholder="Как можем да помогнем?"
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`inline-flex items-center justify-center px-8 py-3 rounded-2xl font-colus font-semibold shadow
                    ${submitting ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                 : "bg-teal text-white hover:bg-teal-dark focus:outline-none focus:ring-4 focus:ring-teal/30"}`}
                >
                  {submitting ? "Изпращане…" : "Изпрати запитване"}
                </button>
                <span className="text-sm text-gray-500">
                  Ще се свържем с вас възможно най-скоро.
                </span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Контактни данни / доверие */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-sand/20 p-6">
              <p className="text-sm text-gray-500">Телефон</p>
              <p className="text-lg font-semibold text-ink">+359 887 445 101</p>
            </div>
            <div className="bg-white rounded-2xl border border-sand/20 p-6">
              <p className="text-sm text-gray-500">Имейл</p>
              <p className="text-lg font-semibold text-ink">info@razkazhini.bg</p>
            </div>
            <div className="bg-white rounded-2xl border border-sand/20 p-6">
              <p className="text-sm text-gray-500">Работно време</p>
              <p className="text-lg font-semibold text-ink">Пон–Пет: 09:00–18:00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
