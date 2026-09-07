import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const sections = pgTable("sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  content: jsonb("content").notNull().default({}),
  position: integer("position").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  siteName: text("site_name").notNull().default("Управление кадров"),
  tagline: text("tagline").notNull().default("Администрация президента Тверской области"),
  logoEmoji: text("logo_emoji").notNull().default("🏛️"),
  accentColor: text("accent_color").notNull().default("#9b1c31"),
  serverIp: text("server_ip").notNull().default(""),
  discordLink: text("discord_link").notNull().default("https://discord.gg/"),
  vkLink: text("vk_link").notNull().default("https://vk.com/"),
  telegramLink: text("telegram_link").notNull().default("https://t.me/"),
  youtubeLink: text("youtube_link").notNull().default(""),
  footerText: text("footer_text").notNull().default("© Управление кадров Администрации президента Тверской области"),
  adminPassword: text("admin_password").notNull().default("tver2024"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
