import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Управление кадров — Администрация президента",
  description:
    "Информационный портал Управления кадров Администрации президента Тверской области: документы, положения, объявления и контакты.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-[#0b0d12] text-white antialiased">{children}</body>
    </html>
  );
}
