"use client";

import { useEffect, useRef, useState, useId } from "react";
import { useTheme } from "next-themes";
import { Maximize2, Minimize2 } from "lucide-react";

type Props = { chart: string; caption?: string };

export function Mermaid({ chart, caption }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const id = useId().replace(/:/g, "-");
    const { resolvedTheme } = useTheme();
    const [svg, setSvg] = useState<string>("");
    const [full, setFull] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const mermaid = (await import("mermaid")).default;
            mermaid.initialize({
                startOnLoad: false,
                theme: resolvedTheme === "dark" ? "dark" : "default",
                themeVariables:
                    resolvedTheme === "dark"
                        ? {
                            background: "#0f172a",
                            primaryColor: "#0b1220",
                            primaryTextColor: "#e2e8f0",
                            primaryBorderColor: "#06b6d4",
                            lineColor: "#64748b",
                            secondaryColor: "#1e293b",
                            tertiaryColor: "#0b1220",
                            noteBkgColor: "#1e293b",
                            noteTextColor: "#e2e8f0",
                            noteBorderColor: "#06b6d4",
                            actorBkg: "#0b1220",
                            actorBorder: "#06b6d4",
                            actorTextColor: "#e2e8f0",
                            signalColor: "#94a3b8",
                            signalTextColor: "#e2e8f0",
                            labelBoxBkgColor: "#0b1220",
                            labelBoxBorderColor: "#06b6d4",
                            labelTextColor: "#e2e8f0",
                        }
                        : {
                            primaryColor: "#f8fafc",
                            primaryTextColor: "#0f172a",
                            primaryBorderColor: "#0891b2",
                            lineColor: "#475569",
                        },
                fontFamily: "Inter, system-ui, sans-serif",
                securityLevel: "loose",
                flowchart: { curve: "basis", padding: 14 },
                sequence: { actorMargin: 40, messageMargin: 35 },
            });
            try {
                const { svg } = await mermaid.render(`m-${id}`, chart);
                if (!cancelled) setSvg(svg);
            } catch (e) {
                if (!cancelled) setSvg(`<pre style="color:#ef4444;font-size:12px">Mermaid error: ${(e as Error).message}</pre>`);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [chart, resolvedTheme, id]);

    return (
        <figure className={full ? "fixed inset-4 z-[80] m-0" : "my-6"}>
            <div
                className={
                    "mermaid-wrapper relative group " +
                    (full ? "h-full w-full overflow-auto" : "")
                }
            >
                <button
                    type="button"
                    onClick={() => setFull(!full)}
                    className="no-print absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-muted)] opacity-0 transition hover:text-[var(--fg)] group-hover:opacity-100"
                    aria-label="Fullscreen"
                >
                    {full ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
                <div ref={ref} dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
            {caption && (
                <figcaption className="mt-2 text-center text-xs text-[var(--fg-subtle)] italic">{caption}</figcaption>
            )}
        </figure>
    );
}
