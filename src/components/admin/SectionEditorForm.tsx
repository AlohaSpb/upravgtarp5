"use client";

import type {
  ContactItem,
  ContactsContent,
  CtaContent,
  FeatureItem,
  FeaturesContent,
  GalleryContent,
  GalleryImage,
  HeroContent,
  NewsContent,
  NewsItem,
  RuleItem,
  RulesContent,
  SectionType,
  StatItem,
  StatsContent,
  TextContent,
} from "@/lib/section-types";
import { Field, TextArea, TextInput, DangerButton, GhostButton, Toggle } from "@/components/admin/ui";

function ListEditor<T>({
  items,
  onChange,
  renderItem,
  newItem,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  newItem: T;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/40">#{index + 1}</span>
            <DangerButton
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Удалить
            </DangerButton>
          </div>
          {renderItem(item, (patch) => {
            const next = [...items];
            next[index] = { ...next[index], ...patch };
            onChange(next);
          }, index)}
        </div>
      ))}
      <GhostButton type="button" onClick={() => onChange([...items, newItem])}>
        + {addLabel}
      </GhostButton>
    </div>
  );
}

export function SectionEditorForm({
  type,
  content,
  onChange,
}: {
  type: SectionType;
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}) {
  const update = (patch: Record<string, unknown>) => onChange({ ...content, ...patch });

  switch (type) {
    case "hero": {
      const c = content as unknown as HeroContent;
      return (
        <div>
          <Field label="Надпись сверху (eyebrow)">
            <TextInput value={c.eyebrow ?? ""} onChange={(e) => update({ eyebrow: e.target.value })} />
          </Field>
          <Field label="Заголовок">
            <TextInput value={c.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Подзаголовок">
            <TextArea value={c.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Текст кнопки 1">
              <TextInput value={c.primaryButtonText ?? ""} onChange={(e) => update({ primaryButtonText: e.target.value })} />
            </Field>
            <Field label="Ссылка кнопки 1">
              <TextInput value={c.primaryButtonLink ?? ""} onChange={(e) => update({ primaryButtonLink: e.target.value })} />
            </Field>
            <Field label="Текст кнопки 2">
              <TextInput value={c.secondaryButtonText ?? ""} onChange={(e) => update({ secondaryButtonText: e.target.value })} />
            </Field>
            <Field label="Ссылка кнопки 2">
              <TextInput value={c.secondaryButtonLink ?? ""} onChange={(e) => update({ secondaryButtonLink: e.target.value })} />
            </Field>
          </div>
          <Field label="Фоновая картинка (URL)" hint="Оставьте пустым для однотонного фона">
            <TextInput value={c.backgroundImage ?? ""} onChange={(e) => update({ backgroundImage: e.target.value })} />
          </Field>
          <div className="flex items-center gap-3">
            <Toggle checked={Boolean(c.showServerIp)} onChange={(v) => update({ showServerIp: v })} />
            <span className="text-sm text-white/70">Показывать IP сервера</span>
          </div>
        </div>
      );
    }

    case "features": {
      const c = content as unknown as FeaturesContent;
      return (
        <div>
          <Field label="Заголовок">
            <TextInput value={c.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Подзаголовок">
            <TextInput value={c.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
          </Field>
          <ListEditor<FeatureItem>
            items={c.items ?? []}
            onChange={(items) => update({ items })}
            addLabel="Добавить преимущество"
            newItem={{ icon: "✨", title: "Новое преимущество", description: "Описание" }}
            renderItem={(item, upd) => (
              <div className="grid grid-cols-[70px_1fr] gap-3">
                <Field label="Иконка">
                  <TextInput value={item.icon} onChange={(e) => upd({ icon: e.target.value })} />
                </Field>
                <Field label="Заголовок">
                  <TextInput value={item.title} onChange={(e) => upd({ title: e.target.value })} />
                </Field>
                <div className="col-span-2">
                  <Field label="Описание">
                    <TextArea value={item.description} onChange={(e) => upd({ description: e.target.value })} />
                  </Field>
                </div>
              </div>
            )}
          />
        </div>
      );
    }

    case "stats": {
      const c = content as unknown as StatsContent;
      return (
        <div>
          <Field label="Заголовок">
            <TextInput value={c.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <ListEditor<StatItem>
            items={c.items ?? []}
            onChange={(items) => update({ items })}
            addLabel="Добавить показатель"
            newItem={{ label: "Показатель", value: "0" }}
            renderItem={(item, upd) => (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Значение">
                  <TextInput value={item.value} onChange={(e) => upd({ value: e.target.value })} />
                </Field>
                <Field label="Подпись">
                  <TextInput value={item.label} onChange={(e) => upd({ label: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </div>
      );
    }

    case "rules": {
      const c = content as unknown as RulesContent;
      return (
        <div>
          <Field label="Заголовок">
            <TextInput value={c.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Подзаголовок">
            <TextInput value={c.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
          </Field>
          <ListEditor<RuleItem>
            items={c.items ?? []}
            onChange={(items) => update({ items })}
            addLabel="Добавить правило"
            newItem={{ title: "Новое правило", description: "Описание правила" }}
            renderItem={(item, upd) => (
              <div>
                <Field label="Заголовок">
                  <TextInput value={item.title} onChange={(e) => upd({ title: e.target.value })} />
                </Field>
                <Field label="Описание">
                  <TextArea value={item.description} onChange={(e) => upd({ description: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </div>
      );
    }

    case "news": {
      const c = content as unknown as NewsContent;
      return (
        <div>
          <Field label="Заголовок">
            <TextInput value={c.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <ListEditor<NewsItem>
            items={c.items ?? []}
            onChange={(items) => update({ items })}
            addLabel="Добавить новость"
            newItem={{ date: new Date().toLocaleDateString("ru-RU"), title: "Заголовок новости", text: "Текст новости" }}
            renderItem={(item, upd) => (
              <div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Дата">
                    <TextInput value={item.date} onChange={(e) => upd({ date: e.target.value })} />
                  </Field>
                  <Field label="Заголовок">
                    <TextInput value={item.title} onChange={(e) => upd({ title: e.target.value })} />
                  </Field>
                </div>
                <Field label="Текст">
                  <TextArea value={item.text} onChange={(e) => upd({ text: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </div>
      );
    }

    case "gallery": {
      const c = content as unknown as GalleryContent;
      return (
        <div>
          <Field label="Заголовок">
            <TextInput value={c.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <ListEditor<GalleryImage>
            items={c.images ?? []}
            onChange={(images) => update({ images })}
            addLabel="Добавить изображение"
            newItem={{ url: "", caption: "" }}
            renderItem={(item, upd) => (
              <div className="grid grid-cols-2 gap-3">
                <Field label="URL изображения">
                  <TextInput value={item.url} onChange={(e) => upd({ url: e.target.value })} />
                </Field>
                <Field label="Подпись">
                  <TextInput value={item.caption} onChange={(e) => upd({ caption: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </div>
      );
    }

    case "text": {
      const c = content as unknown as TextContent;
      return (
        <div>
          <Field label="Заголовок">
            <TextInput value={c.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Текст">
            <TextArea className="min-h-[160px]" value={c.body ?? ""} onChange={(e) => update({ body: e.target.value })} />
          </Field>
        </div>
      );
    }

    case "cta": {
      const c = content as unknown as CtaContent;
      return (
        <div>
          <Field label="Заголовок">
            <TextInput value={c.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Подзаголовок">
            <TextInput value={c.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Текст кнопки">
              <TextInput value={c.buttonText ?? ""} onChange={(e) => update({ buttonText: e.target.value })} />
            </Field>
            <Field label="Ссылка кнопки">
              <TextInput value={c.buttonLink ?? ""} onChange={(e) => update({ buttonLink: e.target.value })} />
            </Field>
          </div>
        </div>
      );
    }

    case "contacts": {
      const c = content as unknown as ContactsContent;
      return (
        <div>
          <Field label="Заголовок">
            <TextInput value={c.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Подзаголовок">
            <TextInput value={c.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
          </Field>
          <ListEditor<ContactItem>
            items={c.items ?? []}
            onChange={(items) => update({ items })}
            addLabel="Добавить контакт"
            newItem={{ label: "Название", value: "Значение", link: "" }}
            renderItem={(item, upd) => (
              <div className="grid grid-cols-3 gap-3">
                <Field label="Название">
                  <TextInput value={item.label} onChange={(e) => upd({ label: e.target.value })} />
                </Field>
                <Field label="Значение">
                  <TextInput value={item.value} onChange={(e) => upd({ value: e.target.value })} />
                </Field>
                <Field label="Ссылка">
                  <TextInput value={item.link} onChange={(e) => upd({ link: e.target.value })} />
                </Field>
              </div>
            )}
          />
        </div>
      );
    }

    default:
      return null;
  }
}
