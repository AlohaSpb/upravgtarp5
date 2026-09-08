# Управление кадров — Тверская область

## База данных на Vercel

Проект использует Neon Postgres через Vercel Marketplace. В панели Vercel откройте проект → **Storage** → **Browse Marketplace** → **Neon Postgres** → **Add Integration**. Выберите этот проект и окружения Production, Preview и Development.

Интеграция автоматически добавит `DATABASE_URL`. В **Settings → Environment Variables** добавьте `ADMIN_SESSION_SECRET` — длинную случайную строку. На следующем деплое Vercel применит миграции и создаст таблицы. Начальные данные создаются при первом запросе к сайту.

Для локальной работы после `vercel env pull .env.local`:

```bash
npm run db:migrate
npm run dev
```
