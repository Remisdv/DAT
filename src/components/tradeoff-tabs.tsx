"use client";

import * as Tabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

type Panel = { value: string; label: string; content: ReactNode };

export function TradeoffTabs({ panels, defaultValue }: { panels: Panel[]; defaultValue?: string }) {
    return (
        <Tabs.Root defaultValue={defaultValue ?? panels[0].value} className="my-6">
            <Tabs.List className="flex flex-wrap gap-1 border-b border-[var(--border)] mb-4">
                {panels.map((p) => (
                    <Tabs.Trigger
                        key={p.value}
                        value={p.value}
                        className="relative px-4 py-2 text-sm font-medium text-[var(--fg-muted)] transition data-[state=active]:text-[var(--color-brand)] hover:text-[var(--fg)] data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-[var(--color-brand)]"
                    >
                        {p.label}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
            {panels.map((p) => (
                <Tabs.Content
                    key={p.value}
                    value={p.value}
                    className="text-sm text-[var(--fg-muted)] leading-relaxed"
                >
                    {p.content}
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
