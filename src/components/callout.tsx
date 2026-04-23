import { AlertTriangle, Info, Lightbulb, ShieldAlert, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Kind = "info" | "warning" | "danger" | "tip" | "success";

const styles: Record<Kind, { border: string; bg: string; icon: ReactNode; label: string }> = {
    info: {
        border: "border-[var(--color-brand)]/40",
        bg: "bg-[var(--color-brand)]/8",
        icon: <Info className="h-4 w-4 text-[var(--color-brand)]" />,
        label: "Info",
    },
    tip: {
        border: "border-[#a78bfa]/40",
        bg: "bg-[#a78bfa]/8",
        icon: <Lightbulb className="h-4 w-4 text-[#a78bfa]" />,
        label: "Astuce",
    },
    warning: {
        border: "border-[#f59e0b]/40",
        bg: "bg-[#f59e0b]/8",
        icon: <AlertTriangle className="h-4 w-4 text-[#f59e0b]" />,
        label: "Attention",
    },
    danger: {
        border: "border-[#ef4444]/40",
        bg: "bg-[#ef4444]/8",
        icon: <ShieldAlert className="h-4 w-4 text-[#ef4444]" />,
        label: "Critique",
    },
    success: {
        border: "border-[#22c55e]/40",
        bg: "bg-[#22c55e]/8",
        icon: <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />,
        label: "Validé",
    },
};

export function Callout({
    kind = "info",
    title,
    children,
}: {
    kind?: Kind;
    title?: string;
    children: ReactNode;
}) {
    const s = styles[kind];
    return (
        <div className={cn("my-5 rounded-xl border px-5 py-4", s.border, s.bg)}>
            <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                {s.icon}
                <span>{title ?? s.label}</span>
            </div>
            <div className="text-sm text-[var(--fg)] leading-relaxed [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                {children}
            </div>
        </div>
    );
}
