import type { ReactNode } from "react";
import { TableOfContents } from "@/components/toc";

export default function DocsLayout({ children }: { children: ReactNode }) {
    return (
        <main className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-10 lg:px-10 lg:py-14">
            <article className="prose prose-lg min-w-0 flex-1 max-w-none">
                {children}
            </article>
            <TableOfContents />
        </main>
    );
}
