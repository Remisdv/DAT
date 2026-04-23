import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";

export default async function TestsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§6 · Tests"
                title="Trois niveaux, une seule stack"
                description="Tests unitaires Jest, tests fonctionnels via docker-compose.test.yml, tests de sécurité ciblés sur les règles critiques."
            />

            <h2 id="unitaires">Tests unitaires</h2>
            <p>
                Chaque API NestJS possède sa suite Jest. Les dépendances (TypeORM, services externes) sont mockées pour
                isoler la logique métier. Objectif de couverture : <strong>80% sur la logique critique</strong> (auth,
                paiement, RBAC).
            </p>
            <table>
                <thead><tr><th>Module</th><th>Couverture visée</th><th>Focus</th></tr></thead>
                <tbody>
                    <tr><td>Auth / JWT / 2FA</td><td>90%</td><td>Vérification JWT, rotation, 2FA TOTP & email</td></tr>
                    <tr><td>Payment</td><td>85%</td><td>PaymentIntent, webhook HMAC, statuts</td></tr>
                    <tr><td>RBAC Guards</td><td>100%</td><td>Résolution des rôles, refus d'accès</td></tr>
                    <tr><td>Services métier</td><td>70%</td><td>Orders, Cart, Catalog</td></tr>
                </tbody>
            </table>

            <h2 id="fonctionnels">Tests fonctionnels</h2>
            <p>
                Un <code>docker-compose.test.yml</code> démarre un environnement dédié (base de données seed, pas de MailHog,
                Elasticsearch single-node). Les tests lancent des requêtes HTTP réelles contre la Gateway et vérifient les
                effets sur la base.
            </p>
            <pre><code className="language-bash">{`# Lancer la suite fonctionnelle
docker compose -f docker-compose.test.yml up --abort-on-container-exit`}</code></pre>

            <h3>Scénarios clés couverts</h3>
            <ul>
                <li>Inscription client + login + accès panier</li>
                <li>Création commande + webhook Stripe succès → status = paid</li>
                <li>Login admin + 2FA email + CRUD catégorie</li>
                <li>Accès refusé sur route admin avec un JWT user</li>
                <li>Rate limit : 101 requêtes/min → HTTP 429</li>
            </ul>

            <h2 id="securite">Tests de sécurité</h2>
            <Callout kind="warning" title="Périmètre défensif">
                Les tests de sécurité automatisés ciblent spécifiquement les règles de gestion critiques, ils ne remplacent pas
                un audit d'intrusion externe mais fournissent une première ligne de vérification continue.
            </Callout>
            <ul>
                <li>Tentative de bypass 2FA (appel direct à une route post-2FA avec JWT pré-2FA)</li>
                <li>Webhook Stripe sans signature ou avec signature invalide → HTTP 400</li>
                <li>Injection SQL via champs de recherche (TypeORM prépare les requêtes)</li>
                <li>XSS via champs de description (ValidationPipe + échappement côté React)</li>
                <li>CSRF : vérification de la présence du <code>SameSite=strict</code> sur les cookies</li>
            </ul>
        </>
    );
}
