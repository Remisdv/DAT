import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";

export default async function MonitoringPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.8 · Monitoring & observabilité"
                title="Logs JSON corrélés, healthchecks, métriques"
                description="X-Request-Id pour la traçabilité bout en bout, healthchecks Docker pour la résilience, logs structurés exploitables par n'importe quel agrégateur."
            />

            <h2 id="request-id">Corrélation via X-Request-Id</h2>
            <p>
                Chaque requête qui entre dans la Gateway reçoit un UUID v4 unique, propagé via l'en-tête{" "}
                <code>X-Request-Id</code> jusqu'aux APIs internes. Toutes les lignes de log produites pendant le traitement de
                la requête incluent cet identifiant, ce qui permet de reconstituer le parcours complet d'une requête à travers
                plusieurs services.
            </p>

            <pre><code className="language-json">{`{
  "timestamp": "2025-01-15T14:23:45.123Z",
  "level": "info",
  "service": "webapp-api",
  "requestId": "a8f2e1b4-…",
  "userId": "usr_abc123",
  "message": "Order created",
  "orderId": "ord_xyz789",
  "amount": 4999
}`}</code></pre>

            <h2 id="healthchecks">Healthchecks Docker</h2>
            <p>
                Chaque conteneur déclare un <code>HEALTHCHECK</code> Docker qui est interrogé périodiquement. Docker Compose
                utilise ces checks pour orchestrer le démarrage en chaîne (PostgreSQL et Elasticsearch doivent être healthy
                avant que les APIs démarrent).
            </p>
            <table>
                <thead><tr><th>Service</th><th>Check</th><th>Interval</th></tr></thead>
                <tbody>
                    <tr><td>Postgres</td><td><code>pg_isready -U postgres</code></td><td>10 s</td></tr>
                    <tr><td>Elasticsearch</td><td><code>curl -s http://localhost:9200/_cluster/health</code></td><td>30 s</td></tr>
                    <tr><td>APIs NestJS</td><td><code>GET /health</code></td><td>30 s</td></tr>
                    <tr><td>Nginx</td><td><code>nginx -t</code></td><td>30 s</td></tr>
                </tbody>
            </table>

            <h2 id="metriques">Métriques métier</h2>
            <p>
                Au-delà des logs techniques, des compteurs métier sont exposés sur un endpoint <code>/metrics</code>{" "}
                (format Prometheus) : nombre de commandes payées, nombre d'échecs 2FA, latence P95 par route. Un
                Grafana est prévu en prod.
            </p>

            <Callout kind="tip" title="Tracing distribué">
                L'intégration d'<strong>OpenTelemetry</strong> est planifiée pour compléter la corrélation par X-Request-Id
                avec des traces distribuées complètes (spans parent/enfant, propagation automatique).
            </Callout>
        </>
    );
}
