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

export interface SectionNavigationFields {
  navLabel?: string;
  navLink?: string;
  showInNav?: boolean;
}

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
  link?: string;
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
  hero: HeroContent & SectionNavigationFields;
  features: FeaturesContent & SectionNavigationFields;
  stats: StatsContent & SectionNavigationFields;
  rules: RulesContent & SectionNavigationFields;
  news: NewsContent & SectionNavigationFields;
  gallery: GalleryContent & SectionNavigationFields;
  text: TextContent & SectionNavigationFields;
  cta: CtaContent & SectionNavigationFields;
  contacts: ContactsContent & SectionNavigationFields;
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

export const DEFAULT_NAVIGATION: Record<SectionType, { label: string; link: string; show: boolean }> = {
  hero: { label: "Главная", link: "/", show: true },
  features: { label: "Меню", link: "/menu", show: true },
  stats: { label: "Показатели", link: "/stats", show: true },
  rules: { label: "Положения", link: "/rules", show: true },
  news: { label: "Объявления", link: "/news", show: true },
  gallery: { label: "Материалы", link: "/gallery", show: true },
  text: { label: "Об управлении", link: "/about", show: true },
  cta: { label: "", link: "/cta", show: false },
  contacts: { label: "Контакты", link: "/contacts", show: true },
};

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

export function getSectionNavigation(section: SectionRecord) {
  const content = section.content as SectionNavigationFields;
  const fallback = DEFAULT_NAVIGATION[section.type];
  return {
    label: content.navLabel?.trim() || fallback.label,
    link: content.navLink?.trim() || fallback.link,
    show: content.showInNav ?? fallback.show,
  };
}

export function defaultContentFor<T extends SectionType>(type: T): SectionContentMap[T] {
  const navigation = DEFAULT_NAVIGATION[type];
  const nav = {
    navLabel: navigation.label,
    navLink: navigation.link,
    showInNav: navigation.show,
  };

  const defaults: SectionContentMap = {
    hero: {
      ...nav,
      eyebrow: "АДМИНИСТРАЦИЯ ПРЕЗИДЕНТА",
      title: "Управление кадров",
      subtitle:
        "Добро пожаловать на информационный портал Управления кадров Администрации президента Тверской области. Здесь собраны документы, порядок работы и полезная информация для сотрудников.",
      primaryButtonText: "Войти в меню",
      primaryButtonLink: "/menu",
      secondaryButtonText: "",
      secondaryButtonLink: "",
      backgroundImage: "",
      showServerIp: false,
    },
    features: {
      ...nav,
      title: "Меню управления",
      subtitle: "Выберите необходимый раздел",
      items: [
        { icon: "👥", title: "Руководство и состав", description: "Информация о руководстве и действующих сотрудниках управления.", link: "" },
        { icon: "📜", title: "Устав и регламент", description: "Основные документы, обязанности и порядок работы отдела.", link: "/rules" },
        { icon: "📝", title: "Заявления", description: "Формы заявлений на трудоустройство, отпуск и перевод.", link: "" },
        { icon: "📊", title: "Отчётность", description: "Требования к отчётам сотрудников и сроки их предоставления.", link: "/stats" },
      ],
    },
    stats: {
      ...nav,
      title: "Управление в цифрах",
      items: [
        { label: "Сотрудников", value: "—" },
        { label: "Открытых заявлений", value: "—" },
        { label: "Документов", value: "—" },
        { label: "Обновлено", value: "2026" },
      ],
    },
    rules: {
      ...nav,
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
      ...nav,
      title: "Объявления отдела",
      items: [
        { date: "01.03.2026", title: "Информационный портал открыт", text: "Актуальные объявления и изменения в работе отдела будут публиковаться в этом разделе." },
      ],
    },
    gallery: {
      ...nav,
      title: "Материалы отдела",
      images: [],
    },
    text: {
      ...nav,
      title: "Об Управлении кадров",
      body: "Управление кадров отвечает за комплектование кадрового состава, ведение кадровой документации, контроль деятельности сотрудников и организацию профессиональной подготовки.\n\nИнформация на портале поддерживается руководством отдела в актуальном состоянии.",
    },
    cta: {
      ...nav,
      title: "Нужна помощь?",
      subtitle: "Обратитесь к руководству Управления кадров по служебным каналам связи.",
      buttonText: "Перейти к контактам",
      buttonLink: "/contacts",
    },
    contacts: {
      ...nav,
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
