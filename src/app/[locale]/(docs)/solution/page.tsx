import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";

const benchmark = [
    { brick: "Frontend", choice: "React 18 + Vite", reason: "Maîtrisé par l'équipe, écosystème mature, TypeScript natif, intégration Stripe Elements", alts: "Vue.js, Angular, Svelte" },
    { brick: "Backend", choice: "NestJS 10", reason: "Architecture modulaire, décorateurs TypeScript, DI, cohérence avec le front", alts: "Express nu, Fastify, Spring Boot, Laravel" },
    { brick: "Reverse Proxy", choice: "Nginx Alpine", reason: "Routing par sous-domaine, rate-limiting, TLS, faible empreinte mémoire", alts: "Traefik, HAProxy, Caddy" },
    { brick: "Containerisation", choice: "Docker Compose v2", reason: "Reproductibilité des environnements, isolation des services, CI/CD simplifié", alts: "VM, Nix, aucune" },
    { brick: "Recherche", choice: "Elasticsearch 8.12", reason: "Full-text BM25, scoring par pertinence, facettes et agrégations", alts: "PostgreSQL full-text, Meilisearch, Typesense" },
    { brick: "Base de données", choice: "PostgreSQL 16", reason: "ACID, JSONB natif, UUID, écosystème TypeORM, maturité éprouvée", alts: "MySQL, MongoDB, CockroachDB" },
    { brick: "ORM", choice: "TypeORM 0.3", reason: "Intégration native NestJS, décorateurs TypeScript, migrations, support JSONB", alts: "Prisma, Sequelize, MikroORM" },
    { brick: "Auth", choice: "JWT + 2FA (TOTP / email)", reason: "Stateless, multi-API, standard ouvert, compatible cookie et Bearer", alts: "Sessions serveur, OAuth2 tiers" },
    { brick: "Paiement", choice: "Stripe SDK v22", reason: "PCI-DSS délégué, webhooks, abonnements natifs, SDK TypeScript", alts: "PayPal, intégration bancaire directe" },
    { brick: "Tests", choice: "Jest + Docker", reason: "Cohérent avec le stack TypeScript, containerisation des tests fonctionnels", alts: "Cypress, Playwright, Mocha" },
];

export default async function SolutionPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§3 · Solution proposée"
                title="Choix technologiques & benchmark"
                description="Analyse comparative des briques techniques retenues pour CYNA, avec justifications et alternatives écartées."
            />

            <h2 id="philosophie">Monolithe modulaire distribué</h2>
            <p>
                La solution retenue repose sur une architecture qualifiée de <strong>monolithe modulaire distribué</strong>.
                Le code est organisé en modules métier clairement délimités, mais ces modules sont déployés dans des conteneurs
                séparés communiquant via des appels HTTP internes. Ce positionnement intermédiaire est délibéré : équipe de 3
                développeurs, délai contraint, périmètre fonctionnel justifiant une séparation des responsabilités sans
                nécessiter la machinerie complète d'une architecture micro-services.
            </p>

            <Callout kind="tip" title="Pourquoi ce compromis ?">
                Ce choix "micro-service ready" permet une évolution rapide et peu coûteuse vers une architecture micro-services
                complète (séparation des bases, event bus, orchestration Kubernetes) quand le besoin apparaîtra.
            </Callout>

            <h2 id="composition">Composition du système</h2>
            <ul>
                <li><strong>4 APIs NestJS</strong> indépendantes : <code>gateway-api</code>, <code>bo-api</code>, <code>webapp-api</code>, <code>service-api</code>.</li>
                <li><strong>2 frontends React</strong> : webapp client (<code>localhost</code>) et back-office (<code>bo.localhost</code>).</li>
                <li><strong>Nginx</strong> comme reverse proxy unique, routage par sous-domaine.</li>
                <li><strong>PostgreSQL</strong> partagé entre les APIs, <strong>Elasticsearch</strong> pour la recherche, <strong>MailHog</strong> en dev.</li>
            </ul>

            <h2 id="benchmark">Benchmark par brique</h2>
            <p>
                Chaque brique technologique a fait l'objet d'une analyse comparative avant d'être retenue. Le tableau
                ci-dessous synthétise les choix effectués.
            </p>

            <div className="not-prose my-6 space-y-3">
                {benchmark.map((b) => (
                    <div
                        key={b.brick}
                        className="group grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--color-brand)]/40 md:grid-cols-[180px_1fr]"
                    >
                        <div>
                            <div className="text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--fg-subtle)]">
                                {b.brick}
                            </div>
                            <div className="mt-1 text-base font-bold text-[var(--color-brand)]">{b.choice}</div>
                        </div>
                        <div>
                            <div className="text-sm text-[var(--fg)] leading-relaxed">{b.reason}</div>
                            <div className="mt-2 text-xs text-[var(--fg-subtle)]">
                                <span className="font-semibold">Alternatives écartées :</span> {b.alts}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 id="focus-nestjs">Focus NestJS</h2>
            <p>
                NestJS fournit une <strong>architecture modulaire native</strong> grâce à ses décorateurs TypeScript
                (<code>@Module</code>, <code>@Controller</code>, <code>@Injectable</code>), qui structurent naturellement le
                code en domaines métier. L'utilisation de TypeScript sur l'ensemble de la stack élimine les ruptures de typage
                entre les couches. L'écosystème intègre nativement TypeORM, JWT, la validation (class-validator), la
                planification (cron) et Swagger.
            </p>
            <p>
                <strong>Spring Boot</strong> (Java) a été considéré pour ses performances supérieures, mais écarté pour
                l'hétérogénéité qu'il aurait introduite avec le frontend TypeScript et la courbe d'apprentissage. <strong>Express nu</strong>{" "}
                a également été écarté : il ne fournit aucune structure architecturale, ce qui représente un risque sur un
                projet multi-développeurs.
            </p>

            <h2 id="focus-pg">Focus PostgreSQL</h2>
            <p>
                PostgreSQL a été retenu pour sa <strong>robustesse éprouvée</strong>, son support natif du type{" "}
                <strong>JSONB</strong> (adresses, items de commande), la génération d'<strong>UUID</strong> en colonne primaire,
                et sa compatibilité complète avec TypeORM. Le healthcheck Docker s'appuie sur <code>pg_isready</code>.
                <strong> MongoDB</strong> a été écarté car le modèle de données CYNA est fondamentalement relationnel, et
                l'absence de transactions ACID multi-documents dans les anciennes versions représentait un risque pour
                l'intégrité des paiements.
            </p>

            <h2 id="focus-es">Focus Elasticsearch</h2>
            <p>
                L'algorithme de scoring <strong>BM25</strong> offre des résultats de recherche bien plus adaptés qu'une simple
                recherche <code>LIKE</code> en SQL, et les capacités de filtrage à facettes permettent de proposer une
                navigation par critères (catégorie, type, fourchette de prix) avec compteurs dynamiques.
                <strong> Meilisearch</strong> a été écarté pour son écosystème moins mature et la moindre flexibilité de ses
                agrégations.
            </p>
        </>
    );
}
