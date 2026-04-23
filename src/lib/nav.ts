import type { Locale } from "@/i18n/routing";

export type NavItem = {
    href: string;
    key: string;
    icon?: string;
};

export type NavSection = {
    titleKey: string;
    items: NavItem[];
};

export const navSections: NavSection[] = [
    {
        titleKey: "nav.sections.overview",
        items: [
            { href: "", key: "nav.home", icon: "home" },
            { href: "introduction", key: "nav.introduction", icon: "book-open" },
            { href: "besoins", key: "nav.besoins", icon: "clipboard-list" },
            { href: "parcours", key: "nav.parcours", icon: "route" },
        ],
    },
    {
        titleKey: "nav.sections.technical",
        items: [
            { href: "solution", key: "nav.solution", icon: "layers" },
            { href: "architecture", key: "nav.architecture", icon: "network" },
            { href: "securite", key: "nav.securite", icon: "shield" },
            { href: "conception", key: "nav.conception", icon: "cpu" },
            { href: "api", key: "nav.api", icon: "plug" },
            { href: "donnees", key: "nav.donnees", icon: "database" },
        ],
    },
    {
        titleKey: "nav.sections.operations",
        items: [
            { href: "tests", key: "nav.tests", icon: "flask-conical" },
            { href: "infrastructure", key: "nav.infrastructure", icon: "container" },
            { href: "rgpd", key: "nav.rgpd", icon: "lock" },
        ],
    },
    {
        titleKey: "nav.sections.appendix",
        items: [
            { href: "adr", key: "nav.adr", icon: "file-text" },
            { href: "equipe", key: "nav.equipe", icon: "users" },
        ],
    },
];

export function buildHref(locale: Locale, href: string) {
    return href === "" ? `/${locale}` : `/${locale}/${href}`;
}
