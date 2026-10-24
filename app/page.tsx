import { SiteHeader } from "./components/site-header";
import { Reveal } from "./components/reveal";
import { Logo } from "./components/logo";
import { ContactForm } from "./components/contact-form";
import { ArrowIcon, CheckIcon, ServiceIcon } from "./components/icons";
import { HeroNetwork } from "./components/charts/hero-network";
import { CapabilityRadar } from "./components/charts/capability-radar";
import { GrowthChart } from "./components/charts/growth-chart";
import { ServiceDonut } from "./components/charts/service-donut";
import {
  capabilities,
  growth,
  heroStats,
  marquee,
  navLinks,
  process,
  projects,
  serviceMix,
  services,
  testimonials,
} from "./lib/site-content";

const accentText = {
  "brand-1": "text-brand-1",
  "brand-2": "text-brand-2",
  "brand-3": "text-brand-3",
  "brand-4": "text-brand-4",
} as const;

const accentBg = {
  "brand-1": "bg-brand-1/12",
  "brand-2": "bg-brand-2/12",
  "brand-3": "bg-brand-3/12",
  "brand-4": "bg-brand-4/12",
} as const;

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: React.ReactNode; text?: string }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{text}</p> : null}
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        پرش به محتوای اصلی
      </a>
      <SiteHeader />

      <main id="main">
        {/* Hero */}
        <section id="top" className="relative overflow-hidden">
          <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0" />
          <div aria-hidden className="pointer-events-none absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full blur-3xl" style={{ background: "var(--glow-1)" }} />
          <div aria-hidden className="pointer-events-none absolute top-40 left-[-12%] h-[24rem] w-[24rem] rounded-full blur-3xl" style={{ background: "var(--glow-2)" }} />

          <div className="shell relative grid items-center gap-10 pt-10 pb-16 lg:grid-cols-[1.05fr_1fr] lg:pt-16 lg:pb-24">
            <div className="animate-rise">
              <span className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-5" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-5" />
                </span>
                پذیرش پروژه‌های جدید پاییز ۱۴۰۵
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl lg:text-6xl">
                برندی بسازید که
                <br />
                <span className="accent-text">دیده شود، به یاد بماند</span>
                <br />
                و بفروشد.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
                پویان هاب استودیوی خلاق تولید محتوا، طراحی سایت و برندینگ است. ما استراتژی، طراحی و داده را به هم وصل
                می‌کنیم تا حضور دیجیتال شما به رشد واقعی تبدیل شود.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact" className="btn btn-primary">
                  مشاوره رایگان
                  <ArrowIcon />
                </a>
                <a href="#work" className="btn btn-ghost">
                  مشاهده نمونه‌کارها
                </a>
              </div>

              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="border-r-2 border-border-strong pr-3">
                    <dt className="text-xs text-muted">{stat.label}</dt>
                    <dd className="mt-1 text-2xl font-black">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="card relative overflow-hidden p-2 sm:p-4">
                <HeroNetwork />
                <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] text-muted">
                  گره‌ها را بکشید ✦
                </p>
              </div>
            </div>
          </div>

          {/* Marquee */}
          <div className="relative border-y border-border bg-surface/50 py-4" aria-hidden>
            <div className="flex overflow-hidden [mask-image:linear-gradient(to_left,transparent,#000_10%,#000_90%,transparent)]">
              <div className="flex shrink-0 animate-marquee gap-10 pl-10" dir="ltr">
                {[...marquee, ...marquee].map((item, index) => (
                  <span key={index} className="flex items-center gap-10 text-lg font-bold whitespace-nowrap text-muted">
                    {item}
                    <span className="text-brand-1">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="shell scroll-mt-24 py-20 sm:py-28">
          <SectionHeading
            eyebrow="خدمات ما"
            title={
              <>
                همه‌چیز برای <span className="accent-text">رشد برند شما</span>، زیر یک سقف
              </>
            }
            text="چهار تخصص مکمل که با هم کار می‌کنند؛ از اولین ایده تا آخرین پیکسل و پست."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 90} as="article" className="card card-hover flex flex-col p-6">
                <div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${accentBg[service.accent]} ${accentText[service.accent]}`}>
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{service.description}</p>
                <ul className="mt-5 grid gap-2 border-t border-border pt-5 text-sm">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckIcon className={`h-4 w-4 shrink-0 ${accentText[service.accent]}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Capabilities radar + mix donut */}
        <section className="relative border-y border-border bg-surface/40 py-20 sm:py-28">
          <div className="shell grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="eyebrow">چرا پویان هاب</span>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                تیمی متوازن، <span className="accent-text">بدون نقطه کور</span>
              </h2>
              <p className="mt-4 leading-8 text-muted">
                بیشتر آژانس‌ها در یک حوزه قوی‌اند. ما استراتژیست، طراح، توسعه‌دهنده و تولیدکننده محتوا را در یک تیم جمع
                کرده‌ایم تا برندتان یکپارچه رشد کند.
              </p>
              <div className="card mt-8 p-6">
                <h3 className="mb-5 text-sm font-bold text-muted">سهم خدمات در پروژه‌های ۱۴۰۴</h3>
                <ServiceDonut data={serviceMix} centerLabel="پروژه" />
              </div>
            </Reveal>

            <Reveal delay={150} className="mx-auto w-full max-w-lg">
              <CapabilityRadar data={capabilities} caption="امتیاز توانمندی تیم (بر اساس نظرسنجی مشتریان)" />
            </Reveal>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="shell scroll-mt-24 py-20 sm:py-28">
          <SectionHeading eyebrow="فرآیند کار" title="از ایده تا رشد، در چهار گام شفاف" />
          <ol className="relative grid gap-5 md:grid-cols-4">
            <span aria-hidden className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-brand-1 opacity-30 md:block" />
            {process.map((item, index) => (
              <Reveal key={item.step} as="li" delay={index * 110} className="relative">
                <div className="relative z-10 mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-background text-xl font-black text-brand-1 shadow-sm">
                  {item.step}
                </div>
                <div className="text-center">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Results */}
        <section id="results" className="scroll-mt-24 py-20 sm:py-28">
          <div className="shell">
            <SectionHeading
              eyebrow="نتایج قابل‌اندازه‌گیری"
              title={
                <>
                  ما فقط زیبا نمی‌سازیم؛ <span className="accent-text">رشد می‌سازیم</span>
                </>
              }
              text="میانگین دسترسی ارگانیک ماهانه (هزار نفر) برای مشتریانی که همکاری را از فروردین آغاز کردند."
            />
            <Reveal className="card p-4 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-1 w-6 rounded-full bg-chart-1" />
                    با پویان هاب
                  </span>
                  <span className="flex items-center gap-2 text-muted">
                    <span className="h-0 w-6 border-t-2 border-dashed border-muted" />
                    پیش از همکاری
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-black text-brand-5">+۳۶۲٪</div>
                  <div className="text-xs text-muted">رشد در ۸ ماه</div>
                </div>
              </div>
              <GrowthChart data={growth} />
            </Reveal>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="shell scroll-mt-24 pb-20 sm:pb-28">
          <SectionHeading eyebrow="نمونه‌کارها" title="پروژه‌هایی که به آن‌ها افتخار می‌کنیم" />
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.title} as="article" delay={index * 90} className="card card-hover group overflow-hidden">
                <div className={`relative h-48 overflow-hidden sm:h-56 ${accentBg[project.accent]}`}>
                  <div aria-hidden className="grid-backdrop absolute inset-0 opacity-70" />
                  <div
                    aria-hidden
                    className={`absolute -bottom-10 -left-10 h-48 w-48 rounded-full opacity-40 blur-2xl transition-transform duration-700 group-hover:scale-125 ${accentText[project.accent]}`}
                    style={{ background: "currentColor" }}
                  />
                  <span className={`absolute top-5 right-5 rounded-full bg-surface/90 px-3 py-1 text-xs font-bold ${accentText[project.accent]}`}>
                    {project.tag}
                  </span>
                  <span className="absolute bottom-5 right-5 text-3xl font-black text-foreground/90 sm:text-4xl">{project.result}</span>
                </div>
                <div className="flex items-center justify-between p-5">
                  <h3 className="font-bold">{project.title}</h3>
                  <ArrowIcon className="h-5 w-5 text-muted transition-transform group-hover:-translate-x-1" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-y border-border bg-surface/40 py-20 sm:py-28">
          <div className="shell">
            <SectionHeading eyebrow="نظر مشتریان" title="آن‌ها درباره ما چه می‌گویند" />
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <Reveal key={item.name} as="article" delay={index * 100} className="card flex flex-col p-6">
                  <span aria-hidden className="text-5xl leading-none font-black text-brand-1/40">”</span>
                  <blockquote className="mt-2 flex-1 leading-8">{item.quote}</blockquote>
                  <footer className="mt-6 border-t border-border pt-4">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-sm text-muted">{item.role}</div>
                  </footer>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="shell scroll-mt-24 py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal>
              <span className="eyebrow">شروع همکاری</span>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                بیایید برند بعدی را <span className="accent-text">با هم</span> بسازیم
              </h2>
              <p className="mt-4 leading-8 text-muted">
                فرم را پر کنید تا یک جلسه مشاوره رایگان ۳۰ دقیقه‌ای هماهنگ کنیم. بدون تعهد، فقط گفت‌وگو درباره رشد کسب‌وکار شما.
              </p>
              <ul className="mt-8 grid gap-4 text-sm">
                {[
                  ["ایمیل", "PouyanHub@proton.me"],
                  ["تلفن", "0902-8038063"],
                  ["آدرس", "آبادان"],
                ].map(([label, value]) => (
                  <li key={label} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                    <span className="text-muted">{label}</span>
                    <span className="font-semibold" dir={label === "آدرس" ? undefined : "ltr"}>
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="shell flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm leading-7 text-muted">استودیوی تولید محتوا، طراحی سایت و برندینگ.</p>
          </div>
          <nav aria-label="منوی پانویس">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted">
          © ۱۴۰۵ پویان هاب. تمامی حقوق محفوظ است.
        </div>
      </footer>
    </>
  );
}
