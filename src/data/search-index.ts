export type SearchItem = {
    title: string;
    href: string;
    section: string;
    keywords: string[];
};

export const searchIndex: SearchItem[] = [
    { title: "Introduction & contexte", href: "introduction", section: "Vue d'ensemble", keywords: ["contexte", "cyna", "présentation", "périmètre"] },
    { title: "Glossaire technique", href: "introduction#glossaire", section: "Vue d'ensemble", keywords: ["jwt", "totp", "rbac", "pci-dss", "soc", "edr", "xdr"] },
    { title: "Analyse du besoin", href: "besoins", section: "Vue d'ensemble", keywords: ["acteurs", "contraintes", "règles de gestion", "rgpd"] },
    { title: "Parcours utilisateurs", href: "parcours", section: "Vue d'ensemble", keywords: ["inscription", "achat", "checkout", "admin", "stripe", "2fa"] },
    { title: "Solution & choix technologiques", href: "solution", section: "Technique", keywords: ["nestjs", "postgresql", "elasticsearch", "docker", "benchmark", "stack"] },
    { title: "Architecture technique", href: "architecture", section: "Technique", keywords: ["gateway", "monorepo", "docker-compose", "réseau", "déploiement"] },
    { title: "Sécurité & matrice des risques", href: "securite", section: "Technique", keywords: ["helmet", "rate limit", "xss", "sql injection", "défense en profondeur"] },
    { title: "Conception détaillée", href: "conception", section: "Technique", keywords: ["jwt", "proxy", "rbac", "stripe", "elasticsearch", "email", "upload", "monitoring"] },
    { title: "Authentification JWT & 2FA", href: "conception/auth", section: "Conception", keywords: ["jwt", "2fa", "totp", "email code"] },
    { title: "Proxying Gateway", href: "conception/proxy", section: "Conception", keywords: ["gateway", "proxy", "x-user-id", "header"] },
    { title: "Rôles & autorisations (RBAC)", href: "conception/rbac", section: "Conception", keywords: ["roles", "guard", "public", "auth", "admin"] },
    { title: "Paiement Stripe", href: "conception/stripe", section: "Conception", keywords: ["stripe", "webhook", "paymentintent", "subscription"] },
    { title: "Recherche Elasticsearch", href: "conception/search", section: "Conception", keywords: ["elasticsearch", "bm25", "facettes", "fallback"] },
    { title: "Emails transactionnels", href: "conception/emails", section: "Conception", keywords: ["mailhog", "nodemailer", "smtp", "2fa email"] },
    { title: "Upload de fichiers", href: "conception/uploads", section: "Conception", keywords: ["multer", "path traversal", "upload"] },
    { title: "Health checks & monitoring", href: "conception/monitoring", section: "Conception", keywords: ["health", "healthcheck", "pg_isready"] },
    { title: "Explorateur d'API", href: "api", section: "Technique", keywords: ["endpoints", "swagger", "routes", "méthodes"] },
    { title: "Modèle de données", href: "donnees", section: "Technique", keywords: ["typeorm", "entités", "schéma", "uml"] },
    { title: "Tests & validation", href: "tests", section: "Opérations", keywords: ["jest", "unit", "functional", "security"] },
    { title: "Infrastructure Docker", href: "infrastructure", section: "Opérations", keywords: ["docker", "healthcheck", "compose", "volumes"] },
    { title: "RGPD & données sensibles", href: "rgpd", section: "Opérations", keywords: ["rgpd", "gdpr", "données personnelles", "chiffrement"] },
    { title: "ADR — Architecture Decision Records", href: "adr", section: "Annexes", keywords: ["adr", "décisions", "architecture"] },
    { title: "Équipe projet", href: "equipe", section: "Annexes", keywords: ["équipe", "contacts", "rémi", "lucas", "titouan"] },
];
