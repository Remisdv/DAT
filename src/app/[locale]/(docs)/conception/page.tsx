import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import {
    ShieldCheck,
    Network,
    KeyRound,
    CreditCard,
    SearchCode,
    Mail,
    UploadCloud,
    Activity,
    Cookie,
} from "lucide-react";

const features = [
    { slug: "auth", title: "Authentification & 2FA", desc: "Triple stratégie : session BO (email), JWT TOTP Webapp, session interne Service-API.", icon: KeyRound, color: "--color-brand" },
    { slug: "proxy", title: "API Gateway & Proxy", desc: "Pipeline de sécurité, routage dynamique, injection X-User-Id, gestion Set-Cookie.", icon: Network, color: "--color-brand-2" },
    { slug: "rbac", title: "RBAC & Guards", desc: "Contrôle d'accès à deux niveaux, décorateur @Roles, JwtAuthGuard & RolesGuard.", icon: ShieldCheck, color: "--color-accent" },
    { slug: "stripe", title: "Paiement Stripe", desc: "PaymentIntent, webhook signé HMAC, abonnements, réconciliation commande.", icon: CreditCard, color: "--color-brand" },
    { slug: "search", title: "Recherche Elasticsearch", desc: "Indexation, BM25, facettes et agrégations, synchronisation DB ↔ ES.", icon: SearchCode, color: "--color-brand-2" },
    { slug: "emails", title: "Emails transactionnels", desc: "Nodemailer + Handlebars, MailHog en dev, confirmation commande & 2FA.", icon: Mail, color: "--color-accent" },
    { slug: "uploads", title: "Uploads fichiers", desc: "Multer + validation MIME + quota, servis via Nginx, noms hashés.", icon: UploadCloud, color: "--color-brand" },
    { slug: "monitoring", title: "Monitoring & Logs", desc: "Logs JSON corrélés X-Request-Id, healthchecks, métriques custom.", icon: Activity, color: "--color-brand-2" },
    { slug: "sessions", title: "Sessions & Cookies", desc: "Cookies HTTP-only, SameSite strict, refresh token rotation, expiration.", icon: Cookie, color: "--color-accent" },
];

export default async function ConceptionHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5 · Conception détaillée"
                title="Neuf fiches, neuf briques transversales"
                description="Chaque fiche suit la même structure : valeur métier, exigences, conception retenue, alternatives écartées, trade-offs et dette technique éventuelle."
            />

            <p>
                Cette section est le cœur du <strong>DCT</strong> (Dossier de Conception Technique). Elle documente en
                profondeur les choix d'implémentation des fonctionnalités transversales, celles qui traversent toutes les APIs
                et qui portent les décisions architecturales les plus structurantes.
            </p>

            <div className="not-prose my-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {features.map((f) => (
                    <Link
                        key={f.slug}
                        href={`/${locale}/conception/${f.slug}`}
                        className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--color-brand)]/50 hover:shadow-xl hover:shadow-[var(--color-brand)]/10"
                    >
                        <div
                            className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-10 blur-2xl transition group-hover:opacity-30"
                            style={{ background: `var(${f.color})` }}
                        />
                        <div
                            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border"
                            style={{
                                borderColor: `color-mix(in oklab, var(${f.color}) 40%, transparent)`,
                                background: `color-mix(in oklab, var(${f.color}) 12%, transparent)`,
                                color: `var(${f.color})`,
                            }}
                        >
                            <f.icon className="h-5 w-5" />
                        </div>
                        <h3 className="mb-1.5 text-base font-semibold">{f.title}</h3>
                        <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{f.desc}</p>
                    </Link>
                ))}
            </div>
        </>
    );
}
