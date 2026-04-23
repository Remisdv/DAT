import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";

export default async function InfrastructurePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§7 · Infrastructure"
                title="Docker, scripts & opérations"
                description="Stratégie multi-stage pour les images de production, scripts d'exploitation Bash, healthchecks et cycle de vie des conteneurs."
            />

            <h2 id="dockerfile">Dockerfile multi-stage</h2>
            <p>
                Chaque API NestJS utilise un Dockerfile multi-stage pour réduire la taille finale (env ~150 Mo contre ~1.2 Go
                en dev) et exclure les dépendances de build de l'image de production.
            </p>
            <pre><code className="language-dockerfile">{`# Stage 1 — Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — Runtime
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
HEALTHCHECK --interval=30s --timeout=3s CMD node healthcheck.js
CMD ["node", "dist/main"]`}</code></pre>

            <h2 id="healthchecks">Healthchecks</h2>
            <table>
                <thead><tr><th>Service</th><th>Commande</th><th>Conséquence</th></tr></thead>
                <tbody>
                    <tr><td>postgres</td><td><code>pg_isready -U postgres</code></td><td>APIs attendent healthy avant démarrage</td></tr>
                    <tr><td>elasticsearch</td><td><code>curl /_cluster/health</code></td><td>Service-API attend healthy</td></tr>
                    <tr><td>gateway-api</td><td><code>wget -qO- :3000/health</code></td><td>Nginx proxy après healthy</td></tr>
                    <tr><td>nginx</td><td><code>nginx -t</code></td><td>Restart on failure</td></tr>
                </tbody>
            </table>

            <h2 id="scripts">Scripts d'exploitation</h2>
            <ul>
                <li><code>scripts/start-dev.sh</code> — démarre tous les conteneurs, exécute les seeds, attend la disponibilité</li>
                <li><code>scripts/stop.sh</code> — arrêt propre avec drain des connexions actives</li>
                <li><code>scripts/backup-db.sh</code> — dump PostgreSQL + rotation 7 jours</li>
                <li><code>scripts/reindex-es.sh</code> — reconstruction de l'index Elasticsearch depuis la DB</li>
                <li><code>scripts/test.sh</code> — lance la suite fonctionnelle dans l'env de test</li>
            </ul>

            <Callout kind="tip" title="Convention de nommage">
                Tous les conteneurs sont préfixés <code>cyna-</code> et rejoignent le réseau <code>cyna-network</code> pour
                faciliter les scripts, les logs <code>docker logs cyna-*</code> et l'administration.
            </Callout>

            <h2 id="deploiement">Déploiement</h2>
            <p>
                La CI construit les images, les pousse sur un registre privé, puis un <code>docker compose pull &amp;&amp; up -d</code>{" "}
                sur la cible orchestre le déploiement avec <strong>zéro downtime</strong> grâce aux healthchecks et à la
                stratégie de mise à jour rolling.
            </p>
        </>
    );
}
