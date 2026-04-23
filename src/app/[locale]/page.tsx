import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Shield, Boxes, CreditCard, SearchCode, Sparkles, Layers, BookOpen, Network } from "lucide-react";
import { HeroAnimation } from "@/components/hero-animation";
import type { Locale } from "@/i18n/routing";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();
    const l = locale as Locale;

    return (
        <div className="no-print">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="hero-glow absolute inset-0 opacity-40" />
                <div className="hero-grid absolute inset-0" />
                <HeroAnimation />
                <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 sm:pt-32">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-brand)]">
                        <Sparkles className="h-3 w-3" />
                        {t("landing.badge")}
                    </div>
                    <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        <span className="bg-gradient-to-br from-[var(--fg)] via-[var(--fg)] to-[var(--fg-muted)] bg-clip-text text-transparent">
                            {t("landing.title")}
                        </span>
                    </h1>
                    <p className="mt-3 text-xl font-medium text-[var(--color-brand)] sm:text-2xl">
                        {t("landing.subtitle")}
                    </p>
                    <p className="mt-6 max-w-2xl text-base text-[var(--fg-muted)] leading-relaxed sm:text-lg">
                        {t("landing.description")}
                    </p>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <Link
                            href={`/${l}/introduction`}
                            className="group inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-[#07090f] transition hover:bg-[var(--accent)] shadow-lg shadow-[var(--color-brand)]/30"
                        >
                            {t("landing.cta")}
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                            href={`/${l}/architecture`}
                            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-5 py-3 text-sm font-semibold text-[var(--fg)] transition hover:border-[var(--color-brand)]/60"
                        >
                            <Network className="h-4 w-4" />
                            {t("landing.ctaSecondary")}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="relative mx-auto max-w-6xl px-6 pb-16">
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:grid-cols-4 sm:p-8">
                    <Stat value="4" label={t("landing.stats.apis")} />
                    <Stat value="10" label={t("landing.stats.containers")} />
                    <Stat value="7" label={t("landing.stats.adr")} />
                    <Stat value="40+" label={t("landing.stats.endpoints")} />
                </div>
            </section>

            {/* Highlights */}
            <section className="mx-auto max-w-6xl px-6 py-16">
                <h2 className="mb-10 text-2xl font-bold sm:text-3xl">{t("landing.highlights.title")}</h2>
                <div className="grid gap-5 md:grid-cols-2">
                    <Highlight
                        icon={<Shield className="h-5 w-5" />}
                        title={t("landing.highlights.security.title")}
                        desc={t("landing.highlights.security.desc")}
                        href={`/${l}/securite`}
                        accent="--color-brand"
                    />
                    <Highlight
                        icon={<Boxes className="h-5 w-5" />}
                        title={t("landing.highlights.architecture.title")}
                        desc={t("landing.highlights.architecture.desc")}
                        href={`/${l}/architecture`}
                        accent="--color-brand-2"
                    />
                    <Highlight
                        icon={<CreditCard className="h-5 w-5" />}
                        title={t("landing.highlights.payments.title")}
                        desc={t("landing.highlights.payments.desc")}
                        href={`/${l}/conception/stripe`}
                        accent="--color-accent"
                    />
                    <Highlight
                        icon={<SearchCode className="h-5 w-5" />}
                        title={t("landing.highlights.search.title")}
                        desc={t("landing.highlights.search.desc")}
                        href={`/${l}/conception/search`}
                        accent="--color-brand"
                    />
                </div>
            </section>

            {/* Quick nav */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="grid gap-4 sm:grid-cols-3">
                    <QuickCard
                        icon={<BookOpen className="h-4 w-4" />}
                        title="Commencer par l'intro"
                        desc="Contexte, périmètre, glossaire technique interactif."
                        href={`/${l}/introduction`}
                    />
                    <QuickCard
                        icon={<Layers className="h-4 w-4" />}
                        title="Explorer la conception"
                        desc="9 fiches détaillées : auth, proxy, Stripe, recherche…"
                        href={`/${l}/conception`}
                    />
                    <QuickCard
                        icon={<Network className="h-4 w-4" />}
                        title="Consulter les ADR"
                        desc="7 décisions d'architecture documentées."
                        href={`/${l}/adr`}
                    />
                </div>
            </section>
        </div>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {value}
            </div>
            <div className="mt-1 text-xs font-medium text-[var(--fg-subtle)] sm:text-sm">{label}</div>
        </div>
    );
}

function Highlight({
    icon,
    title,
    desc,
    href,
    accent,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    href: string;
    accent: string;
}) {
    return (
        <Link
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--color-brand)]/40 hover:shadow-xl hover:shadow-[var(--color-brand)]/5"
        >
            <div
                className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
                style={{ background: `var(${accent})` }}
            />
            <div
                className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border"
                style={{
                    borderColor: `color-mix(in oklab, var(${accent}) 40%, transparent)`,
                    background: `color-mix(in oklab, var(${accent}) 12%, transparent)`,
                    color: `var(${accent})`,
                }}
            >
                {icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-brand)] opacity-0 transition group-hover:opacity-100">
                Explorer <ArrowRight className="h-3 w-3" />
            </div>
        </Link>
    );
}

function QuickCard({ icon, title, desc, href }: { icon: React.ReactNode; title: string; desc: string; href: string }) {
    return (
        <Link
            href={href}
            className="group flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 transition hover:border-[var(--color-brand)]/50"
        >
            <div className="flex items-center gap-2 text-[var(--color-brand)]">
                {icon}
                <span className="text-sm font-semibold text-[var(--fg)]">{title}</span>
            </div>
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed">{desc}</p>
        </Link>
    );
}
