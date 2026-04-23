import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { Mermaid } from "@/components/mermaid";
import { RiskMatrix } from "@/components/risk-matrix";

export default async function SecuritePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§4.5 & §4.6 · Sécurité"
                title="Défense en profondeur & matrice des risques"
                description="Stratégie à quatre couches, pipeline de sécurité de la Gateway, et analyse quantitative des 15 principaux risques du système."
            />

            <h2 id="defense-profondeur">Principe de défense en profondeur</h2>
            <p>
                La stratégie de sécurité de CYNA s'appuie sur le <strong>principe de défense en profondeur</strong>, où
                plusieurs couches de protection se superposent pour qu'une défaillance à un niveau soit compensée par les
                niveaux adjacents.
            </p>

            <Mermaid
                chart={`graph LR
    U[🌐 Attaquant] -->|TLS| N[1️⃣ Nginx<br/>Rate limit + terminaison TLS]
    N --> G[2️⃣ Gateway<br/>JWT + RBAC + Rate limit]
    G --> A[3️⃣ APIs internes<br/>ValidationPipe strict]
    A --> D[4️⃣ PostgreSQL<br/>Requêtes préparées TypeORM]

    style N fill:#0b1220,stroke:#06b6d4
    style G fill:#0b1220,stroke:#a78bfa
    style A fill:#0b1220,stroke:#22d3ee
    style D fill:#0b1220,stroke:#22c55e`}
                caption="Quatre couches de protection successives, chacune indépendante des autres."
            />

            <h2 id="pipeline-gateway">Pipeline de sécurité de la Gateway</h2>
            <p>
                La Gateway exécute une chaîne de middlewares et de guards dans un <strong>ordre strict</strong> pour chaque
                requête entrante, sans exception.
            </p>

            <Mermaid
                chart={`flowchart LR
    R[📨 Requête] --> RI[RequestIdMiddleware<br/>X-Request-Id]
    RI --> H[HelmetMiddleware<br/>HSTS, CSP, X-Frame]
    H --> RL[RateLimitMiddleware<br/>100 req/min/IP]
    RL --> JA[JwtAuthGuard<br/>Vérif HMAC-SHA256]
    JA --> RG[RolesGuard<br/>RBAC]
    RG --> V[ValidationPipe<br/>whitelist strict]
    V --> P[🔀 Proxy vers API interne]

    style R fill:#06b6d4,color:#07090f
    style P fill:#22c55e,color:#07090f`}
                caption="Ordre d'exécution du pipeline de sécurité — le rate limit précède l'auth pour protéger même les routes protégées."
            />

            <Callout kind="info" title="Pourquoi cet ordre ?">
                Le rate limiting est appliqué <strong>avant</strong> l'authentification pour protéger contre les attaques par
                brute force y compris sur les routes protégées, et la compression est appliquée <strong>après</strong> pour ne
                pas gaspiller de CPU sur des requêtes qui seront rejetées.
            </Callout>

            <h2 id="couches">Détail des 4 couches</h2>
            <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
                <Couche num="1" title="Nginx" items={["Terminaison TLS (Let's Encrypt en prod)", "Rate limiting additionnel", "Filtrage requêtes malformées", "Unique point d'exposition publique"]} />
                <Couche num="2" title="Gateway API" items={["Pipeline middleware ordonné", "Vérification JWT manuelle (crypto natif)", "RBAC via @Roles()", "Journalisation X-Request-Id"]} />
                <Couche num="3" title="APIs internes" items={["ValidationPipe whitelist:true", "forbidNonWhitelisted:true", "Hash SHA-256 des mots de passe", "Codes 2FA à usage unique"]} />
                <Couche num="4" title="PostgreSQL" items={["Accessible uniquement via cyna-network", "Requêtes préparées TypeORM", "JSONB typé fort", "Volumes Docker persistants"]} />
            </div>

            <h2 id="matrice-risques">Matrice des risques</h2>
            <p>
                Les 15 menaces ci-dessous ont été identifiées, évaluées selon leur impact et leur probabilité, et associées à
                des mesures préventives et plans de réponse. Cliquez sur une ligne pour voir le détail.
            </p>
            <div className="not-prose">
                <RiskMatrix />
            </div>

            <Callout kind="warning" title="Axes d'amélioration identifiés">
                Migration SHA-256 → bcrypt/Argon2 pour les mots de passe. Migration du rate limiting in-memory vers Redis pour
                le multi-instance. Chiffrement du secret TOTP en base. Voir la conclusion pour la roadmap complète.
            </Callout>
        </>
    );
}

function Couche({ num, title, items }: { num: string; title: string; items: string[] }) {
    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--color-brand)] bg-[var(--color-brand)]/10 font-mono text-sm font-bold text-[var(--color-brand)]">
                    {num}
                </span>
                <h3 className="text-base font-semibold">{title}</h3>
            </div>
            <ul className="space-y-1.5 text-sm text-[var(--fg-muted)]">
                {items.map((i, idx) => (
                    <li key={idx} className="flex gap-2">
                        <span className="text-[var(--color-brand)]">›</span>
                        <span>{i}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
