CREATE TABLE IF NOT EXISTS "sections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "type" text NOT NULL,
  "content" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "position" integer DEFAULT 0 NOT NULL,
  "visible" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
  "site_name" text DEFAULT 'Управление кадров' NOT NULL,
  "tagline" text DEFAULT 'Администрация президента Тверской области' NOT NULL,
  "logo_emoji" text DEFAULT '🏛️' NOT NULL,
  "accent_color" text DEFAULT '#9b1c31' NOT NULL,
  "server_ip" text DEFAULT '' NOT NULL,
  "discord_link" text DEFAULT 'https://discord.gg/' NOT NULL,
  "vk_link" text DEFAULT 'https://vk.com/' NOT NULL,
  "telegram_link" text DEFAULT 'https://t.me/' NOT NULL,
  "youtube_link" text DEFAULT '' NOT NULL,
  "footer_text" text DEFAULT '© Управление кадров Администрации президента Тверской области' NOT NULL,
  "admin_password" text DEFAULT 'tver2024' NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
