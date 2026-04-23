"use client";

import { Printer } from "lucide-react";
import { useTranslations } from "next-intl";

export function PrintButton() {
    const t = useTranslations();
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-3 text-xs font-medium text-[var(--fg-muted)] transition hover:text-[var(--fg)] hover:border-[var(--color-brand)]"
        >
            <Printer className="h-3.5 w-3.5" />
            {t("print.label")}
        </button>
    );
}
