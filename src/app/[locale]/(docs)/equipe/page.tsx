import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Github, Mail } from "lucide-react";

const team = [
    {
        name: "Rémi",
        role: "Lead Backend & API Gateway",
        focus: "NestJS, sécurité, pipeline Gateway, RBAC",
    },
    {
        name: "Lucas",
        role: "Frontend & UX",
        focus: "React, Webapp client, Back-office, intégration Stripe Elements",
    },
    {
        name: "Titouan",
        role: "Infrastructure & Data",
        focus: "Docker, PostgreSQL, Elasticsearch, CI/CD",
    },
];

export default async function EquipePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§10 · Équipe & contacts"
                title="Trois développeurs, une vision partagée"
                description="Le projet CYNA a été conçu et développé par une équipe de trois alternants en master cybersécurité."
            />

            <div className="not-prose my-8 grid gap-5 md:grid-cols-3">
                {team.map((m) => (
                    <div
                        key={m.name}
                        className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--color-brand)]/40 hover:shadow-xl"
                    >
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] text-xl font-bold text-[#07090f]">
                            {m.name[0]}
                        </div>
                        <h3 className="mb-1 text-lg font-semibold">{m.name}</h3>
                        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--color-brand)]">{m.role}</div>
                        <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{m.focus}</p>
                    </div>
                ))}
            </div>

            <h2 id="depot">Dépôt du projet</h2>
            <div className="not-prose my-6 flex flex-wrap gap-3">
                <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--color-brand)]/50"
                >
                    <Github className="h-4 w-4" />
                    Code source (GitHub)
                </a>
                <a
                    href="mailto:contact@cyna.example"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--color-brand)]/50"
                >
                    <Mail className="h-4 w-4" />
                    contact@cyna.example
                </a>
            </div>

            <h2 id="remerciements">Remerciements</h2>
            <p>
                À nos tuteurs pédagogiques pour leurs retours constructifs, à l'entreprise d'accueil pour la mise à disposition
                d'un contexte métier réaliste, et à la communauté open-source dont les bibliothèques (NestJS, TypeORM, React,
                Stripe SDK…) ont rendu ce projet possible.
            </p>
        </>
    );
}
