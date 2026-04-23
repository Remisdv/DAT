"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { locales, type Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
    const pathname = usePathname();
    const locale = useLocale() as Locale;
    const t = useTranslations();

    const swapLocale = (target: Locale) => {
        if (!pathname) return `/${target}`;
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length === 0) return `/${target}`;
        parts[0] = target;
        return "/" + parts.join("/");
    };

    return (
        <div className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-1 text-xs">
            <Languages className="ml-1 h-3.5 w-3.5 text-[var(--fg-subtle)]" />
            {locales.map((l) => (
                <Link
                    key={l}
                    href={swapLocale(l)}
                    aria-current={l === locale ? "page" : undefined}
                    className={
                        "rounded-md px-2 py-1 font-medium transition " +
                        (l === locale
                            ? "bg-[var(--color-brand)]/15 text-[var(--color-brand)]"
                            : "text-[var(--fg-muted)] hover:text-[var(--fg)]")
                    }
                >
                    {t(`locale.${l}`)}
                </Link>
            ))}
        </div>
    );
}
