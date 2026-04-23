import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { Mermaid } from "@/components/mermaid";

export default async function ArchitecturePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§4 · Architecture technique"
                title="Vision macroscopique du système"
                description="Découpage monorepo, topologie réseau, déploiement Docker et modèle de données. Fondations sur lesquelles reposent toutes les décisions de conception."
            />

            <h2 id="vue-ensemble">Vue d'ensemble du système</h2>
            <Mermaid
                chart={`graph TB
    subgraph "Public"
      U[🌐 Navigateur]
    end
    subgraph "Docker Network — cyna-network"
      N[🔀 Nginx :80]
      subgraph "Frontends React"
        BF[cyna-bo-front :5173]
        WF[cyna-webapp-front :5174]
      end
      subgraph "APIs NestJS"
        GW[🛡 cyna-gateway-api]
        BO[cyna-bo-api]
        WA[cyna-webapp-api]
        SV[cyna-service-api]
      end
      subgraph "Data"
        PG[(🐘 PostgreSQL 16)]
        ES[(🔍 Elasticsearch 8.12)]
        MH[✉ MailHog]
      end
    end

    U -->|:80| N
    N --> BF
    N --> WF
    N -->|/api/*| GW
    GW -.->|proxy + X-User-Id| BO
    GW -.->|proxy| WA
    GW -.->|proxy| SV
    BO --> PG
    WA --> PG
    WA --> MH
    SV --> PG
    SV --> ES

    style N fill:#06b6d4,stroke:#06b6d4,color:#07090f
    style GW fill:#a78bfa,stroke:#a78bfa,color:#07090f
    style PG fill:#0b1220,stroke:#06b6d4
    style ES fill:#0b1220,stroke:#a78bfa`}
                caption="Figure 5 — Architecture globale : Nginx est le seul composant exposé publiquement."
            />

            <h2 id="monorepo">Découpage du monorepo</h2>
            <p>
                Le projet CYNA est organisé sous forme de monorepo contenant l'ensemble du code source, des configurations
                Docker et des scripts d'exploitation.
            </p>
            <ul>
                <li>
                    <code>service/api/</code> — 4 APIs NestJS : <code>cyna-gateway-api</code>,{" "}
                    <code>cyna-bo-api</code>, <code>cyna-webapp-api</code>, <code>cyna-service-api</code>
                </li>
                <li>
                    <code>service/front/</code> — 2 applications React : back-office et webapp
                </li>
                <li>
                    <code>docker/</code> — Docker Compose et fichiers associés pour les 3 environnements (dev, test, prod)
                </li>
            </ul>

            <h2 id="reseau">Architecture réseau</h2>
            <p>
                L'architecture réseau repose sur un principe fondamental d'<strong>isolation</strong> : seul le port 80 du
                conteneur Nginx est exposé à l'extérieur du réseau Docker. Tous les autres conteneurs (APIs, bases de données,
                moteur de recherche) communiquent exclusivement via le réseau bridge <code>cyna-network</code>, en utilisant la
                résolution DNS interne de Docker (127.0.0.11).
            </p>

            <h3>Virtual hosts Nginx</h3>
            <table>
                <thead>
                    <tr>
                        <th>Virtual Host</th>
                        <th>Destination</th>
                        <th>Usage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td><code>http://localhost</code></td><td>cyna-webapp-front :5174</td><td>Interface client</td></tr>
                    <tr><td><code>http://bo.localhost</code></td><td>cyna-bo-front :5173</td><td>Interface administration</td></tr>
                    <tr><td><code>http://api.localhost</code></td><td>cyna-gateway-api :3000</td><td>Accès direct API (Swagger)</td></tr>
                    <tr><td><code>.../api/*</code></td><td>cyna-gateway-api :3000</td><td>Proxy API</td></tr>
                    <tr><td><code>bo.localhost/uploads/*</code></td><td>cyna-gateway-api :3000</td><td>Fichiers uploadés</td></tr>
                </tbody>
            </table>

            <Callout kind="warning" title="Paramètres clés Nginx">
                <code>client_max_body_size 10M</code> pour les uploads d'images, <code>proxy_read_timeout 86400s</code> pour
                les WebSockets HMR de Vite en dev, résolution DNS dynamique pour gérer les redémarrages de conteneurs.
            </Callout>

            <h2 id="docker">Déploiement Docker</h2>
            <p>
                L'environnement de développement déploie <strong>10 conteneurs</strong> interconnectés au sein du réseau{" "}
                <code>cyna-network</code>. Chaque conteneur est défini dans le <code>docker-compose.yml</code> avec ses
                dépendances explicites, ses healthchecks et ses volumes de données.
            </p>

            <Mermaid
                chart={`graph LR
    subgraph Infrastructure
      PG[(PostgreSQL)]
      ES[(Elasticsearch)]
      MH[MailHog]
    end
    subgraph APIs
      GW[Gateway]
      BO[BO-API]
      WA[Webapp-API]
      SV[Service-API]
    end
    subgraph Front
      BF[BO-Front]
      WF[Webapp-Front]
    end
    NX[Nginx]

    PG -.->|healthcheck: pg_isready| GW
    PG -.-> BO
    PG -.-> WA
    PG -.-> SV
    ES -.->|cluster health| SV
    GW --> NX
    BF --> NX
    WF --> NX
    MH -.-> BO
    MH -.-> WA

    style NX fill:#06b6d4,color:#07090f`}
                caption="Figure 6 — Ordre de démarrage : PostgreSQL + Elasticsearch (healthchecks) → APIs → Nginx."
            />

            <h3>Tableau récapitulatif des conteneurs</h3>
            <table>
                <thead>
                    <tr>
                        <th>Conteneur</th>
                        <th>Image</th>
                        <th>Port</th>
                        <th>Dépendances</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>cyna-nginx</td><td>nginx:alpine</td><td>80 (public)</td><td>gateway, fronts</td></tr>
                    <tr><td>cyna-gateway-api</td><td>Node 20</td><td>Interne</td><td>Postgres, Elasticsearch</td></tr>
                    <tr><td>cyna-bo-api</td><td>Node 20</td><td>Interne</td><td>Postgres</td></tr>
                    <tr><td>cyna-webapp-api</td><td>Node 20</td><td>Interne</td><td>Postgres</td></tr>
                    <tr><td>cyna-service-api</td><td>Node 20</td><td>Interne</td><td>Postgres, Elasticsearch</td></tr>
                    <tr><td>cyna-bo-front</td><td>Node 20</td><td>5173 (interne)</td><td>-</td></tr>
                    <tr><td>cyna-webapp-front</td><td>Node 20</td><td>5174 (interne)</td><td>-</td></tr>
                    <tr><td>cyna-postgres</td><td>postgres:16-alpine</td><td>5432 (dev)</td><td>-</td></tr>
                    <tr><td>cyna-elasticsearch</td><td>8.12.0</td><td>9200, 9300 (dev)</td><td>-</td></tr>
                    <tr><td>cyna-mailhog</td><td>latest</td><td>1025, 8025 (dev)</td><td>-</td></tr>
                </tbody>
            </table>

            <h2 id="modele-donnees">Modèle de données</h2>
            <p>
                La base de données PostgreSQL est partagée entre les 4 APIs. En dev, <code>TypeORM synchronize: true</code>{" "}
                permet l'auto-sync du schéma. En prod, migrations manuelles uniquement. Le modèle se répartit en 3 agrégats :
            </p>
            <ul>
                <li>
                    <strong>BO-API</strong> — <code>User</code>, <code>Category</code>, <code>CarouselItem</code>,{" "}
                    <code>Faq</code>, <code>TextePromotionnel</code>
                </li>
                <li>
                    <strong>Webapp-API</strong> — <code>WebappUser</code>, <code>CartItem</code>, <code>CustomerOrder</code>,{" "}
                    <code>WebappSubscription</code>, <code>PasswordResetToken</code>, <code>ContactMessage</code>
                </li>
                <li>
                    <strong>Service-API</strong> — <code>ProductEntity</code>, <code>ServiceEntity</code>,{" "}
                    <code>OrderEntity</code>, <code>TrackingEventEntity</code>
                </li>
            </ul>

            <Callout kind="info" title="Clés étrangères logiques">
                Les relations entre entités de différents modules sont établies par des clés étrangères logiques (userId en
                varchar) plutôt que par des contraintes physiques. Ce choix permet à chaque API de gérer ses propres tables
                indépendamment, facilitant une migration vers des bases séparées.
            </Callout>

            <h2 id="environnements">Gestion des environnements</h2>
            <table>
                <thead>
                    <tr>
                        <th>Paramètre</th>
                        <th>Dev</th>
                        <th>Test</th>
                        <th>Prod</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>TypeORM synchronize</td><td>true</td><td>true (seed)</td><td>false (migrations)</td></tr>
                    <tr><td>Clés Stripe</td><td>sk_test_…</td><td>sk_test_…</td><td>sk_live_…</td></tr>
                    <tr><td>SMTP</td><td>MailHog</td><td>MailHog</td><td>Réel (Resend, etc.)</td></tr>
                    <tr><td>Ports exposés</td><td>80, 5432, 9200, 1025, 8025</td><td>80</td><td>80 / 443</td></tr>
                    <tr><td>Hot reload</td><td>nest start --watch</td><td>Désactivé</td><td>node dist/main</td></tr>
                    <tr><td>LOG_LEVEL</td><td>debug</td><td>info</td><td>warn</td></tr>
                </tbody>
            </table>
        </>
    );
}
