"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SectionRecord, SectionType, SiteSettingsRecord } from "@/lib/section-types";
import { getSectionNavigation, SECTION_ICONS, SECTION_LABELS, SECTION_TYPES } from "@/lib/section-types";
import { SectionEditorForm } from "@/components/admin/SectionEditorForm";
import { DangerButton, Field, GhostButton, Panel, PrimaryButton, TextInput, Toggle } from "@/components/admin/ui";

function sectionPreviewTitle(section: SectionRecord) {
  const content = section.content as Record<string, unknown>;
  return (content.title as string) || (content.eyebrow as string) || "Без названия";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminBuilder() {
  const router = useRouter();
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [settings, setSettings] = useState<SiteSettingsRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState<Record<string, unknown> | null>(null);
  const [newType, setNewType] = useState<SectionType>("custom");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionLink, setNewSectionLink] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<SiteSettingsRecord | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => { void loadAll(); }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  async function loadAll() {
    setLoading(true);
    const [sectionsRes, settingsRes] = await Promise.all([fetch("/api/sections?all=1"), fetch("/api/settings")]);
    const sectionsData = await sectionsRes.json();
    const settingsData = await settingsRes.json();
    setSections(sectionsData.sections ?? []);
    setSettings(settingsData.settings ?? null);
    setSettingsDraft(settingsData.settings ?? null);
    setLoading(false);
  }

  async function handleLogout() { await fetch("/api/admin/logout", { method: "POST" }); router.refresh(); }

  async function handleAddSection() {
    const title = newSectionTitle.trim();
    let link = newSectionLink.trim();

    if (newType === "custom" && !title) {
      setToast("Укажите название раздела");
      return;
    }

    if (newType === "custom" && !link) {
      const slug = slugify(title);
      link = slug ? `/${slug}` : "/section";
    }

    const res = await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: newType, title, link }),
    });

    if (res.ok) {
      const data = await res.json();
      setSections((prev) => [...prev, data.section]);
      setEditingId(data.section.id);
      setDraftContent(data.section.content);
      setNewSectionTitle("");
      setNewSectionLink("");
      setToast("Раздел добавлен");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить этот раздел?")) return;
    await fetch(`/api/sections/${id}`, { method: "DELETE" });
    setSections((prev) => prev.filter((s) => s.id !== id));
    setToast("Раздел удалён");
  }

  async function handleToggleVisible(section: SectionRecord) {
    const nextVisible = !section.visible;
    setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, visible: nextVisible } : s)));
    await fetch(`/api/sections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: nextVisible }),
    });
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const next = [...sections];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setSections(next);
    await fetch("/api/sections/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((s) => s.id) }),
    });
  }

  function startEditing(section: SectionRecord) { setEditingId(section.id); setDraftContent(section.content); }
  function cancelEditing() { setEditingId(null); setDraftContent(null); }

  async function saveEditing(id: string) {
    if (!draftContent) return;
    const res = await fetch(`/api/sections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: draftContent }),
    });
    if (res.ok) {
      const data = await res.json();
      setSections((prev) => prev.map((s) => (s.id === id ? data.section : s)));
      setEditingId(null);
      setDraftContent(null);
      setToast("Изменения сохранены");
    }
  }

  async function saveSettings() {
    if (!settingsDraft) return;
    setSavingSettings(true);
    try {
      const body: Record<string, unknown> = { ...settingsDraft };
      if (newPassword.trim().length >= 4) body.newPassword = newPassword.trim();
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setSettingsDraft(data.settings);
        setNewPassword("");
        setToast("Настройки сохранены");
      }
    } finally {
      setSavingSettings(false);
    }
  }

  if (loading || !settings || !settingsDraft) {
    return <div className="grid min-h-screen place-items-center bg-[#0b0d12] text-white/60">Загрузка конструктора...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] pb-24 text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d12]/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-lg font-black">🏛️ Конструктор сайта</h1>
            <p className="text-xs text-white/40">Управление кадров — полное редактирование портала</p>
          </div>
          <div className="flex items-center gap-3">
            {toast ? <span className="text-xs font-semibold text-green-400">{toast}</span> : null}
            <a href="/" target="_blank" rel="noreferrer"><GhostButton type="button">Открыть сайт ↗</GhostButton></a>
            <DangerButton type="button" onClick={handleLogout}>Выйти</DangerButton>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 px-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <Panel title="Настройки сайта">
            <Field label="Название сайта"><TextInput value={settingsDraft.siteName} onChange={(e) => setSettingsDraft({ ...settingsDraft, siteName: e.target.value })} /></Field>
            <Field label="Слоган"><TextInput value={settingsDraft.tagline} onChange={(e) => setSettingsDraft({ ...settingsDraft, tagline: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Эмодзи-логотип"><TextInput value={settingsDraft.logoEmoji} onChange={(e) => setSettingsDraft({ ...settingsDraft, logoEmoji: e.target.value })} /></Field>
              <Field label="Акцентный цвет"><TextInput type="color" value={settingsDraft.accentColor} onChange={(e) => setSettingsDraft({ ...settingsDraft, accentColor: e.target.value })} className="h-[42px] p-1" /></Field>
            </div>
            <Field label="IP сервера"><TextInput value={settingsDraft.serverIp} onChange={(e) => setSettingsDraft({ ...settingsDraft, serverIp: e.target.value })} /></Field>
            <Field label="Discord"><TextInput value={settingsDraft.discordLink} onChange={(e) => setSettingsDraft({ ...settingsDraft, discordLink: e.target.value })} /></Field>
            <Field label="VK"><TextInput value={settingsDraft.vkLink} onChange={(e) => setSettingsDraft({ ...settingsDraft, vkLink: e.target.value })} /></Field>
            <Field label="Telegram"><TextInput value={settingsDraft.telegramLink} onChange={(e) => setSettingsDraft({ ...settingsDraft, telegramLink: e.target.value })} /></Field>
            <Field label="YouTube"><TextInput value={settingsDraft.youtubeLink} onChange={(e) => setSettingsDraft({ ...settingsDraft, youtubeLink: e.target.value })} /></Field>
            <Field label="Текст в подвале"><TextInput value={settingsDraft.footerText} onChange={(e) => setSettingsDraft({ ...settingsDraft, footerText: e.target.value })} /></Field>
            <Field label="Новый пароль администратора" hint="Оставьте пустым, чтобы не менять"><TextInput type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Минимум 4 символа" /></Field>
            <PrimaryButton type="button" onClick={saveSettings} disabled={savingSettings} className="w-full">{savingSettings ? "Сохранение..." : "Сохранить настройки"}</PrimaryButton>
          </Panel>

          <Panel title="Добавить раздел">
            <Field label="Тип раздела">
              <select value={newType} onChange={(e) => setNewType(e.target.value as SectionType)} className="w-full rounded-lg border border-white/15 bg-black/30 px-3.5 py-2.5 text-sm text-white outline-none">
                {SECTION_TYPES.map((type) => <option key={type} value={type}>{SECTION_ICONS[type]} {SECTION_LABELS[type]}</option>)}
              </select>
            </Field>
            {newType === "custom" ? (
              <>
                <Field label="Название раздела"><TextInput value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} placeholder="Например: Состав управления" /></Field>
                <Field label="Адрес страницы" hint="Можно оставить пустым — адрес создастся из названия"><TextInput value={newSectionLink} onChange={(e) => setNewSectionLink(e.target.value)} placeholder="/staff" /></Field>
              </>
            ) : null}
            <PrimaryButton type="button" onClick={handleAddSection} className="w-full">+ Добавить на сайт</PrimaryButton>
          </Panel>
        </div>

        <div className="space-y-4">
          {sections.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/40">Разделов пока нет. Добавьте первый слева.</div> : null}
          {sections.map((section, index) => {
            const isEditing = editingId === section.id;
            const navigation = getSectionNavigation(section);
            return (
              <div key={section.id} className="rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => handleMove(index, -1)} disabled={index === 0} className="text-white/50 hover:text-white disabled:opacity-20">▲</button>
                    <button type="button" onClick={() => handleMove(index, 1)} disabled={index === sections.length - 1} className="text-white/50 hover:text-white disabled:opacity-20">▼</button>
                  </div>
                  <div className="text-2xl">{SECTION_ICONS[section.type] ?? "📂"}</div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/40">{SECTION_LABELS[section.type] ?? "Произвольный раздел"} · меню: {navigation.label || "скрыто"}</div>
                    <div className="font-semibold">{sectionPreviewTitle(section)}</div>
                    <div className="mt-1 text-xs text-white/35">{navigation.link}</div>
                  </div>
                  <Toggle checked={section.visible} onChange={() => handleToggleVisible(section)} />
                  {isEditing ? <GhostButton type="button" onClick={cancelEditing}>Свернуть</GhostButton> : <GhostButton type="button" onClick={() => startEditing(section)}>Редактировать</GhostButton>}
                  <DangerButton type="button" onClick={() => handleDelete(section.id)}>Удалить</DangerButton>
                </div>
                {isEditing && draftContent ? (
                  <div className="border-t border-white/10 p-5">
                    <SectionEditorForm type={section.type} content={draftContent} onChange={setDraftContent} />
                    <div className="mt-4 flex gap-3">
                      <PrimaryButton type="button" onClick={() => saveEditing(section.id)}>Сохранить раздел</PrimaryButton>
                      <GhostButton type="button" onClick={cancelEditing}>Отмена</GhostButton>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
