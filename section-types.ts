// Central place describing every "block" type available in the site constructor.

export type SectionType =
  | "hero"
  | "features"
  | "stats"
  | "rules"
  | "news"
  | "gallery"
  | "text"
  | "cta"
  | "contacts";

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImage: string;
  showServerIp: boolean;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}
export interface FeaturesContent {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface StatItem {
  label: string;
  value: string;
}
export interface StatsContent {
  title: string;
  items: StatItem[];
}

export interface RuleItem {
  title: string;
  description: string;
}
export interface RulesContent {
  title: string;
  subtitle: string;
  items: RuleItem[];
}

export interface NewsItem {
  date: string;
  title: string;
  text: string;
}
export interface NewsContent {
  title: string;
  items: NewsItem[];
}

export interface GalleryImage {
  url: string;
  caption: string;
}
export interface GalleryContent {
  title: string;
  images: GalleryImage[];
}

export interface TextContent {
  title: string;
  body: string;
}

export interface CtaContent {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface ContactItem {
  label: string;
  value: string;
  link: string;
}
export interface ContactsContent {
  title: string;
  subtitle: string;
  items: ContactItem[];
}

export type SectionContentMap = {
  hero: HeroContent;
  features: FeaturesContent;
  stats: StatsContent;
  rules: RulesContent;
  news: NewsContent;
  gallery: GalleryContent;
  text: TextContent;
  cta: CtaContent;
  contacts: ContactsContent;
};

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Обложка (Hero)",
  features: "Преимущества",
  stats: "Статистика",
  rules: "Правила",
  news: "Новости",
  gallery: "Галерея",
  text: "Текстовый блок",
  cta: "Призыв к действию",
  contacts: "Контакты",
};

export const SECTION_ICONS: Record<SectionType, string> = {
  hero: "🖼️",
  features: "⭐",
  stats: "📊",
  rules: "📜",
  news: "📰",
  gallery: "🖼",
  text: "📝",
  cta: "📢",
  contacts: "☎️",
};

export const SECTION_TYPES: SectionType[] = [
  "hero",
  "features",
  "stats",
  "rules",
  "news",
  "gallery",
  "text",
  "cta",
  "contacts",
];

export interface SectionRecord {
  id: string;
  type: SectionType;
  content: Record<string, unknown>;
  position: number;
  visible: boolean;
}

export interface SiteSettingsRecord {
  siteName: string;
  tagline: string;
  logoEmoji: string;
  accentColor: string;
  serverIp: string;
  discordLink: string;
  vkLink: string;
  telegramLink: string;
  youtubeLink: string;
  footerText: string;
}

export function defaultContentFor<T extends SectionType>(type: T): SectionContentMap[T] {
  const defaults: SectionContentMap = {
    hero: {
      eyebrow: "АДМИНИСТРАЦИЯ ПРЕЗИДЕНТА",
      title: "Управление кадров",
      subtitle:
        "Добро пожаловать на информационный портал Управления кадров Администрации президента Тверской области. Здесь собраны документы, порядок работы и полезная информация для сотрудников.",
      primaryButtonText: "Войти в меню",
      primaryButtonLink: "#menu",
      secondaryButtonText: "",
      secondaryButtonLink: "",
      backgroundImage: "",
      showServerIp: false,
    },
    features: {
      title: "Меню управления",
      subtitle: "Выберите необходимый раздел",
      items: [
        { icon: "👥", title: "Руководство и состав", description: "Информация о руководстве и действующих сотрудниках управления." },
        { icon: "📜", title: "Устав и регламент", description: "Основные документы, обязанности и порядок работы отдела." },
        { icon: "📝", title: "Заявления", description: "Формы заявлений на трудоустройство, отпуск и перевод." },
        { icon: "📊", title: "Отчётность", description: "Требования к отчётам сотрудников и сроки их предоставления." },
      ],
    },
    stats: {
      title: "Управление в цифрах",
      items: [
        { label: "Сотрудников", value: "—" },
        { label: "Открытых заявлений", value: "—" },
        { label: "Документов", value: "—" },
        { label: "Обновлено", value: "2026" },
      ],
    },
    rules: {
      title: "Основные положения",
      subtitle: "Правила работы Управления кадров",
      items: [
        { title: "Соблюдение субординации", description: "Каждый сотрудник обязан соблюдать служебную этику и субординацию." },
        { title: "Исполнение обязанностей", description: "Поручения руководства выполняются своевременно и в полном объёме." },
        { title: "Ведение отчётности", description: "Сотрудники предоставляют отчёты в установленной форме и в указанные сроки." },
        { title: "Конфиденциальность", description: "Служебная информация не подлежит разглашению посторонним лицам." },
      ],
    },
    news: {
      title: "Объявления отдела",
      items: [
        { date: "01.03.2026", title: "Информационный портал открыт", text: "Актуальные объявления и изменения в работе отдела будут публиковаться в этом разделе." },
      ],
    },
    gallery: {
      title: "Материалы отдела",
      images: [],
    },
    text: {
      title: "Об Управлении кадров",
      body: "Управление кадров отвечает за комплектование кадрового состава, ведение кадровой документации, контроль деятельности сотрудников и организацию профессиональной подготовки.\n\nИнформация на портале поддерживается руководством отдела в актуальном состоянии.",
    },
    cta: {
      title: "Нужна помощь?",
      subtitle: "Обратитесь к руководству Управления кадров по служебным каналам связи.",
      buttonText: "Перейти к контактам",
      buttonLink: "#contacts",
    },
    contacts: {
      title: "Контакты руководства",
      subtitle: "Служебные каналы связи Управления кадров",
      items: [
        { label: "Начальник управления", value: "Не указано", link: "" },
        { label: "Заместитель начальника", value: "Не указано", link: "" },
        { label: "Приёмная", value: "Не указано", link: "" },
      ],
    },
  };

  return defaults[type];
}
