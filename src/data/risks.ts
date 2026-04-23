export type Level = "Très faible" | "Faible" | "Moyen" | "Élevé" | "Critique";

export type Risk = {
    threat: string;
    impact: Level;
    probability: Level;
    prevention: string;
    response: string;
    category: "Applicatif" | "Réseau" | "Authentification" | "Données" | "Infrastructure";
};

export const risks: Risk[] = [
    {
        threat: "Injection SQL",
        impact: "Élevé",
        probability: "Faible",
        category: "Applicatif",
        prevention: "ORM TypeORM avec requêtes préparées, ValidationPipe whitelist:true, aucune requête SQL brute.",
        response: "Correction immédiate, audit des logs, patch de sécurité.",
    },
    {
        threat: "XSS (Cross-Site Scripting)",
        impact: "Élevé",
        probability: "Moyen",
        category: "Applicatif",
        prevention: "CSP via HelmetMiddleware, échappement natif React (JSX), header X-XSS-Protection.",
        response: "Désactivation de la fonctionnalité, correctif, test de non-régression.",
    },
    {
        threat: "CSRF (Cross-Site Request Forgery)",
        impact: "Moyen",
        probability: "Faible",
        category: "Applicatif",
        prevention: "JWT en cookie HTTP-only, SameSite implicite, absence de formulaires HTML classiques.",
        response: "Audit, ajout explicite de SameSite=Strict.",
    },
    {
        threat: "DDoS / Flood",
        impact: "Moyen",
        probability: "Moyen",
        category: "Réseau",
        prevention: "RateLimitMiddleware (100 req/min/IP), Nginx rate limit, infrastructure Docker scalable.",
        response: "Blocage IP au niveau Nginx, protection réseau du fournisseur.",
    },
    {
        threat: "Brute force authentification",
        impact: "Élevé",
        probability: "Moyen",
        category: "Authentification",
        prevention: "2FA obligatoire BO, rate limit /auth/login, code à usage unique avec expiration, cooldown 60 s.",
        response: "Blocage temporaire du compte, alerte administrateur.",
    },
    {
        threat: "Fuite de données Stripe",
        impact: "Critique",
        probability: "Très faible",
        category: "Données",
        prevention: "Aucune donnée carte stockée, Stripe Elements côté client, PCI-DSS délégué à Stripe.",
        response: "Notification CNIL sous 72 h, audit, communication clients.",
    },
    {
        threat: "Vol de token JWT",
        impact: "Élevé",
        probability: "Faible",
        category: "Authentification",
        prevention: "Cookie HTTP-only, durée de vie limitée, rotation refresh token.",
        response: "Invalidation de session, réauthentification obligatoire.",
    },
    {
        threat: "Accès non autorisé au back-office",
        impact: "Élevé",
        probability: "Faible",
        category: "Authentification",
        prevention: "Décorateur @Roles('admin'), 2FA email obligatoire, JWT signé HMAC-SHA256.",
        response: "Révocation du token, audit des accès.",
    },
    {
        threat: "Perte de données BDD",
        impact: "Critique",
        probability: "Très faible",
        category: "Données",
        prevention: "Volume Docker persistant, backup planifié en production, schéma versionné.",
        response: "Restauration depuis le dernier backup, audit d'intégrité.",
    },
    {
        threat: "Exposition de ports internes",
        impact: "Moyen",
        probability: "Faible",
        category: "Infrastructure",
        prevention: "Port 80 Nginx unique exposé, services internes sur cyna-network uniquement.",
        response: "Audit docker-compose, correction immédiate.",
    },
    {
        threat: "Dépendances vulnérables",
        impact: "Moyen",
        probability: "Moyen",
        category: "Infrastructure",
        prevention: "Audit npm régulier, mise à jour des dépendances, surveillance des CVE.",
        response: "Patch de la dépendance, évaluation de l'impact, mise à jour forcée.",
    },
    {
        threat: "SSRF via proxy Gateway",
        impact: "Élevé",
        probability: "Faible",
        category: "Applicatif",
        prevention: "URLs de proxy hard-codées dans les variables d'environnement, pas de résolution dynamique.",
        response: "Audit du code de proxy, renforcement de la validation des URLs.",
    },
    {
        threat: "Escalade de privilèges",
        impact: "Critique",
        probability: "Faible",
        category: "Authentification",
        prevention: "RBAC strict via RolesGuard, vérification du rôle dans le JWT signé, pas de self-service.",
        response: "Révocation des tokens, audit des actions effectuées.",
    },
    {
        threat: "Contournement du rate limiting",
        impact: "Moyen",
        probability: "Moyen",
        category: "Réseau",
        prevention: "Clé rate limit IP + User-Agent, stockage in-memory, headers X-RateLimit dans les réponses.",
        response: "Migration vers Redis pour stockage distribué, ajout de captcha.",
    },
    {
        threat: "Bypass 2FA",
        impact: "Élevé",
        probability: "Faible",
        category: "Authentification",
        prevention: "Code à usage unique, expiration 5 min, stockage BDD, validation serveur uniquement.",
        response: "Blocage du compte, investigation, renforcement du mécanisme.",
    },
];

export const levelOrder: Record<Level, number> = {
    "Très faible": 1,
    Faible: 2,
    Moyen: 3,
    Élevé: 4,
    Critique: 5,
};

export const levelColors: Record<Level, string> = {
    "Très faible": "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    Faible: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    Moyen: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    Élevé: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    Critique: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};
