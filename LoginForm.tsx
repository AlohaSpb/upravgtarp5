"use client";

import { useState } from "react";
export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Ошибка входа");
        return;
      }
      // A full navigation guarantees the server component sees the newly set httpOnly cookie.
      window.location.assign("/admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0d12] px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <div className="mb-2 text-3xl">🏛️</div>
          <h1 className="text-xl font-bold">Конструктор сайта</h1>
          <p className="mt-1 text-sm text-white/50">Управление кадров · Администрация президента</p>
        </div>
        <label className="mb-2 block text-sm font-medium text-white/70">Пароль администратора</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-4 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-2.5 text-white outline-none focus:border-red-500"
          placeholder="Введите пароль"
          autoFocus
        />
        {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-red-600 py-2.5 font-semibold uppercase tracking-wide transition hover:bg-red-500 disabled:opacity-60"
        >
          {loading ? "Проверка..." : "Войти"}
        </button>
        <p className="mt-4 text-center text-xs text-white/40">Пароль по умолчанию: tver2024</p>
      </form>
    </div>
  );
}
