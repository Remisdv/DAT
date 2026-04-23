"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

export function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [active, setActive] = useState<string>("");
    const t = useTranslations();

    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll("main h2, main h3")) as HTMLElement[];
        const list: Heading[] = nodes
            .filter((n) => n.id)
            .map((n) => ({ id: n.id, text: n.textContent?.trim() ?? "", level: Number(n.tagName[1]) }));
        setHeadings(list);

        const io = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length > 0) {
                    const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                    setActive((top.target as HTMLElement).id);
                }
            },
            { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] }
        );
        nodes.forEach((n) => io.observe(n));
        return () => io.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <nav className="no-print sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-auto pb-10 pl-6 text-xs xl:block">
            <div className="mb-3 font-semibold uppercase tracking-widest text-[var(--fg-subtle)]">
                {t("toc.title")}
            </div>
            <ul className="space-y-1.5 border-l border-[var(--border)]">
                {headings.map((h) => (
                    <li key={h.id} style={{ paddingLeft: h.level === 2 ? 12 : 24 }}>
                        <a
                            href={`#${h.id}`}
                            className={cn(
                                "-ml-px block border-l-2 border-transparent py-0.5 pl-3 leading-tight transition",
                                active === h.id
                                    ? "border-[var(--color-brand)] text-[var(--color-brand)] font-medium"
                                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                            )}
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
