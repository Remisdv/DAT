import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { Mermaid } from "@/components/mermaid";
import { TradeoffTabs } from "@/components/tradeoff-tabs";

export default async function ProxyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.2 · API Gateway & Proxy"
                title="Un unique point d'entrée pour quatre APIs"
                description="La Gateway est le seul composant exposé via /api/*. Elle authentifie, autorise, rate-limite et proxifie."
            />

            <h2 id="valeur-metier">Valeur métier</h2>
            <p>
                Exposer plusieurs APIs directement crée une explosion de la surface d'attaque et complexifie la gestion
                transverse (CORS, rate limiting, logs). La <strong>Gateway</strong> centralise ces préoccupations et masque la
                topologie interne du système.
            </p>

            <h2 id="conception">Conception retenue — http-proxy-middleware</h2>
            <p>
                La Gateway utilise <code>http-proxy-middleware</code> configuré dynamiquement en fonction du préfixe d'URL.
                Après traversée du pipeline de sécurité, la requête est réécrite et relayée vers l'API interne.
            </p>

            <Mermaid
                chart={`flowchart LR
    U[Client] -->|/api/bo/*| NX[Nginx]
    U -->|/api/webapp/*| NX
    U -->|/api/service/*| NX
    NX --> G[Gateway :3000]
    G -->|Pipeline sécurité| D{Path?}
    D -->|/api/bo/*| BO[bo-api :3001]
    D -->|/api/webapp/*| WA[webapp-api :3002]
    D -->|/api/service/*| SV[service-api :3003]

    style G fill:#a78bfa,stroke:#a78bfa,color:#07090f`}
            />

            <h3>Injection d'en-têtes</h3>
            <ul>
                <li><code>X-User-Id</code> : ID de l'utilisateur authentifié (extrait du JWT)</li>
                <li><code>X-User-Role</code> : rôle (ADMIN / USER)</li>
                <li><code>X-Request-Id</code> : UUID unique pour la traçabilité bout en bout</li>
                <li><code>X-Forwarded-For</code> : IP client réelle</li>
            </ul>

            <h3>Gestion des cookies Set-Cookie</h3>
            <p>
                Les APIs internes émettent des cookies (login, logout). La Gateway doit les retransmettre sans altération. Une
                attention particulière est portée au <code>cookieDomainRewrite</code> pour que les cookies fonctionnent depuis
                n'importe quel sous-domaine (<code>localhost</code>, <code>bo.localhost</code>).
            </p>

            <h2 id="alternatives">Alternatives écartées</h2>
            <div className="not-prose">
                <TradeoffTabs
                    defaultValue="kong"
                    panels={[
                        {
                            value: "kong",
                            label: "Kong / Traefik",
                            content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Solutions dédiées, mais coûteuses en infra et en apprentissage pour un projet de cette taille. Peu d'intégration native avec la logique métier NestJS.</p>,
                        },
                        {
                            value: "nginx-only",
                            label: "Nginx seul (sans Gateway NestJS)",
                            content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Nginx peut proxy-pass vers les APIs, mais ne peut pas exécuter de logique applicative (vérif JWT, RBAC, RateLimit métier). Aurait dupliqué la logique dans chaque API.</p>,
                        },
                        {
                            value: "express-gateway",
                            label: "Express Gateway",
                            content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Projet peu maintenu depuis 2020. Écarté pour le risque de sécurité et l'incohérence avec la stack NestJS.</p>,
                        },
                    ]}
                />
            </div>

            <h2 id="tradeoffs">Trade-offs</h2>
            <Callout kind="tip" title="Avantage : DRY radical">
                Un seul endroit pour Helmet, JWT, rate limit, logs. Les APIs internes peuvent rester simples et se concentrer
                sur leur domaine.
            </Callout>
            <Callout kind="warning" title="Contrepartie : SPOF logique">
                Une panne Gateway = toutes les APIs inaccessibles. Mitigation : healthchecks Docker, restart automatique,
                déploiement derrière plusieurs instances possible.
            </Callout>
        </>
    );
}
