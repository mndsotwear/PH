import type { DonutSlice } from "../components/charts/service-donut";
import type { GrowthPoint } from "../components/charts/growth-chart";
import type { RadarDatum } from "../components/charts/capability-radar";

// NOTE: Numbers, projects and testimonials below are placeholders. Replace them
// with Pouyan Hub's real figures before launch.

export const navLinks = [
  { href: "#services", label: "خدمات" },
  { href: "#process", label: "فرآیند" },
  { href: "#results", label: "نتایج" },
  { href: "#work", label: "نمونه‌کارها" },
  { href: "#contact", label: "تماس" },
];

export const heroStats = [
  { value: "۱۲۰+", label: "پروژه تحویل‌شده" },
  { value: "۸ سال", label: "تجربه" },
  { value: "۹۶٪", label: "رضایت مشتری" },
];

export type Service = {
  id: string;
  title: string;
  description: string;
  items: string[];
  accent: "brand-1" | "brand-2" | "brand-3" | "brand-4";
  icon: "pen" | "code" | "spark" | "megaphone";
};

export const services: Service[] = [
  {
    id: "content",
    title: "تولید محتوا",
    description: "روایت‌هایی که دیده می‌شوند؛ از استراتژی محتوا تا تولید ویدیو، عکس و متن‌های سئو‌محور.",
    items: ["استراتژی و تقویم محتوا", "تولید ویدیو و موشن", "کپی‌رایتینگ و سئو", "عکاسی محصول"],
    accent: "brand-1",
    icon: "pen",
  },
  {
    id: "web",
    title: "طراحی و توسعه سایت",
    description: "وب‌سایت‌های سریع، واکنش‌گرا و قابل‌اندازه‌گیری که بازدیدکننده را به مشتری تبدیل می‌کنند.",
    items: ["طراحی UI/UX", "توسعه با Next.js", "فروشگاه اینترنتی", "بهینه‌سازی سرعت و سئو فنی"],
    accent: "brand-2",
    icon: "code",
  },
  {
    id: "brand",
    title: "برندینگ و هویت بصری",
    description: "از نام و لوگو تا زبان بصری کامل؛ برندی می‌سازیم که در ذهن مخاطب بماند.",
    items: ["استراتژی برند", "طراحی لوگو", "راهنمای هویت بصری", "طراحی بسته‌بندی"],
    accent: "brand-4",
    icon: "spark",
  },
  {
    id: "social",
    title: "مدیریت شبکه‌های اجتماعی",
    description: "حضور فعال و هدفمند در اینستاگرام، لینکدین و تلگرام با گزارش‌دهی شفاف.",
    items: ["مدیریت پیج", "کمپین‌های تبلیغاتی", "همکاری با اینفلوئنسر", "گزارش ماهانه عملکرد"],
    accent: "brand-3",
    icon: "megaphone",
  },
];

export const capabilities: RadarDatum[] = [
  { label: "استراتژی", value: 88 },
  { label: "محتوا", value: 94 },
  { label: "طراحی", value: 91 },
  { label: "توسعه", value: 86 },
  { label: "برندینگ", value: 92 },
  { label: "تبلیغات", value: 80 },
];

export const growth: GrowthPoint[] = [
  { month: "فروردین", before: 12, after: 14 },
  { month: "اردیبهشت", before: 13, after: 19 },
  { month: "خرداد", before: 12, after: 26 },
  { month: "تیر", before: 14, after: 34 },
  { month: "مرداد", before: 13, after: 41 },
  { month: "شهریور", before: 15, after: 52 },
  { month: "مهر", before: 14, after: 61 },
  { month: "آبان", before: 16, after: 74 },
];

export const serviceMix: DonutSlice[] = [
  { label: "تولید محتوا", value: 46 },
  { label: "طراحی سایت", value: 34 },
  { label: "برندینگ", value: 24 },
  { label: "شبکه‌های اجتماعی", value: 18 },
];

export const process = [
  { step: "۰۱", title: "کشف و شناخت", text: "کسب‌وکار، مخاطب و رقبا را عمیق می‌شناسیم و اهداف قابل‌اندازه‌گیری تعریف می‌کنیم." },
  { step: "۰۲", title: "استراتژی", text: "جایگاه برند، پیام کلیدی و نقشه راه محتوا و وب‌سایت را طراحی می‌کنیم." },
  { step: "۰۳", title: "طراحی و تولید", text: "هویت بصری، محتوا و تجربه کاربری را با بازخورد مستمر شما می‌سازیم." },
  { step: "۰۴", title: "اجرا و رشد", text: "منتشر می‌کنیم، می‌سنجیم و بر اساس داده بهینه می‌کنیم تا رشد ادامه داشته باشد." },
];

export const projects = [
  { title: "بازطراحی برند کافه‌زنجیره‌ای", tag: "برندینگ", result: "+۴۸٪ شناخت برند", accent: "brand-4" },
  { title: "فروشگاه آنلاین پوشاک", tag: "طراحی سایت", result: "+۳.۲× نرخ تبدیل", accent: "brand-2" },
  { title: "کمپین محتوایی استارتاپ فین‌تک", tag: "تولید محتوا", result: "۲.۱ میلیون بازدید", accent: "brand-1" },
  { title: "مدیریت پیج کلینیک زیبایی", tag: "شبکه‌های اجتماعی", result: "+۳۵ هزار فالوور", accent: "brand-3" },
] as const;

export const testimonials = [
  {
    quote: "پویان هاب فقط سایت طراحی نکرد؛ کمک کرد بفهمیم برندمان واقعاً چه می‌گوید. فروش آنلاین در سه ماه دو برابر شد.",
    name: "مدیر یک فروشگاه آنلاین",
    role: "خرده‌فروشی",
  },
  {
    quote: "تقویم محتوایی منظم، گزارش‌های شفاف و تیمی که همیشه در دسترس است. همکاری با آن‌ها واقعاً راحت است.",
    name: "مدیر بازاریابی یک استارتاپ",
    role: "فین‌تک",
  },
  {
    quote: "هویت بصری جدید ما در نمایشگاه بیشترین توجه را گرفت. جزئیات و دقت کارشان بی‌نظیر است.",
    name: "بنیان‌گذار یک برند غذایی",
    role: "صنایع غذایی",
  },
];

export const marquee = [
  "استراتژی برند",
  "طراحی لوگو",
  "Next.js",
  "موشن گرافیک",
  "سئو",
  "UI/UX",
  "تولید ویدیو",
  "کپی‌رایتینگ",
  "اینستاگرام",
  "فروشگاه اینترنتی",
];
