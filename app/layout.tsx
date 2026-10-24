import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { THEME_STORAGE_KEY } from "./lib/theme";
import "./globals.css";

const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Tahoma", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "پویان هاب | تولید محتوا، طراحی سایت و برندینگ",
    template: "%s | پویان هاب",
  },
  description:
    "پویان هاب استودیوی دیجیتال است؛ از استراتژی برند و تولید محتوا تا طراحی و توسعه وب‌سایت‌هایی که برند شما را می‌سازند.",
  keywords: [
    "پویان هاب",
    "تولید محتوا",
    "طراحی سایت",
    "برندینگ",
    "هویت بصری",
    "دیجیتال مارکتینگ",
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "پویان هاب",
    title: "پویان هاب | تولید محتوا، طراحی سایت و برندینگ",
    description:
      "استراتژی برند، تولید محتوا و وب‌سایت‌هایی که کسب‌وکار شما را متمایز می‌کنند.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#07111f" },
  ],
};

// Runs synchronously in <head> before the first paint so the stored theme is
// applied without a flash. Mirrors THEME_STORAGE_KEY in theme-provider.
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme="light"
      className={`${vazirmatn.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground">{children}</body>
    </html>
  );
}
