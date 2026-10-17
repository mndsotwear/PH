"use client";

import { useState } from "react";
import { CheckIcon } from "./icons";

const SERVICES = ["تولید محتوا", "طراحی سایت", "برندینگ", "شبکه‌های اجتماعی"];

/**
 * Lead form. It validates on the client and currently only shows a success
 * state; wire `onSubmit` to a Server Function, CRM or email service to receive leads.
 */
export function ContactForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const toggle = (service: string) =>
    setSelected((current) => (current.includes(service) ? current.filter((s) => s !== service) : [...current, service]));

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();

    if (name.length < 2) return setError("لطفاً نام خود را وارد کنید.");
    if (!/^(\+98|0)?9\d{9}$/.test(phone.replace(/[\s-]/g, "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))))) {
      return setError("شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).");
    }

    setError(null);
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="card grid min-h-80 place-items-center p-8 text-center" role="status">
        <div>
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-5/15 text-brand-5">
            <CheckIcon className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold">درخواست شما ثبت شد</h3>
          <p className="mt-2 text-muted">کارشناسان ما حداکثر تا یک روز کاری با شما تماس می‌گیرند.</p>
          <button type="button" className="btn btn-ghost mt-6" onClick={() => setStatus("idle")}>
            ارسال درخواست دیگر
          </button>
        </div>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-border-strong bg-background/60 px-4 py-3 text-foreground placeholder:text-muted/70 outline-none transition-colors focus:border-brand-1";

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6 sm:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          نام و نام خانوادگی
          <input name="name" autoComplete="name" className={field} placeholder="مثلاً سارا محمدی" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          شماره موبایل
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className={`${field} text-right`} placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹" />
        </label>
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-1.5 text-sm font-medium">به چه خدمتی نیاز دارید؟</legend>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((service) => {
            const active = selected.includes(service);
            return (
              <button
                key={service}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(service)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active ? "border-brand-1 bg-brand-1/12 text-brand-1" : "border-border-strong text-muted hover:text-foreground"
                }`}
              >
                {service}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="grid gap-1.5 text-sm font-medium">
        درباره پروژه
        <textarea name="message" rows={4} className={field} placeholder="کمی از کسب‌وکار و هدف‌تان بگویید…" />
      </label>

      {error ? (
        <p className="text-sm text-brand-4" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary w-full py-3.5 text-base sm:w-auto sm:justify-self-start">
        درخواست مشاوره رایگان
      </button>
    </form>
  );
}
