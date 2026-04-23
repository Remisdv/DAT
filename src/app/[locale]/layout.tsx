import { notFound } from "next/navigation";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { locales, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!locales.includes(locale as Locale)) return {};
    const t = await getTranslations({ locale, namespace: "meta" });
    return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!locales.includes(locale as Locale)) notFound();
    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ThemeProvider>
                        <div className="flex min-h-screen flex-col">
                            <Header />
                            <div className="flex flex-1">
                                <aside className="no-print hidden w-64 shrink-0 border-r border-[var(--border)] lg:block">
                                    <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto pl-6 pr-2">
                                        <Sidebar />
                                    </div>
                                </aside>
                                <div className="flex-1 min-w-0">{children}</div>
                            </div>
                            <Footer />
                        </div>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

async function Footer() {
    return (
        <footer className="site-footer no-print mt-16 border-t border-[var(--border)] bg-[var(--bg-elev)]/50 py-8">
            <div className="mx-auto max-w-6xl px-6 text-center text-xs text-[var(--fg-subtle)]">
                <p className="mb-1 font-medium text-[var(--fg-muted)]">
                    CYNA · Plateforme e-commerce de cybersécurité · Version 1.0 — Avril 2026
                </p>
                <p>Sup de Vinci — Bachelor Coordinateur de Projets Informatiques · Rémi Lhuillier · Lucas Eveillard · Titouan Bouvier</p>
            </div>
        </footer>
    );
}
