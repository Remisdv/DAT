"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations();
    useEffect(() => setMounted(true), []);
    const current = mounted ? resolvedTheme ?? theme : "dark";
    return (
        <button
            type="button"
            aria-label={t("theme.toggle")}
            onClick={() => setTheme(current === "dark" ? "light" : "dark")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-muted)] transition hover:text-[var(--fg)] hover:border-[var(--color-brand)]"
        >
            {current === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
    );
}
