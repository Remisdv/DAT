import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { AdrGrid } from "@/components/adr-grid";

export default async function AdrPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§9 · Architecture Decision Records"
                title="Sept décisions, sept justifications"
                description="Chaque décision structurante du projet est documentée sous forme d'ADR : contexte, décision prise, conséquences assumées. Cliquez sur une carte pour le détail."
            />

            <div className="not-prose">
                <AdrGrid />
            </div>
        </>
    );
}
