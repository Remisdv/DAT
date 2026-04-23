import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { Mermaid } from "@/components/mermaid";

const regles = [
    ["RG-01", "Authentification BO avec 2FA email obligatoire. Code 6 chiffres, expire 5 min, usage unique."],
    ["RG-02", "Renvoi du code 2FA soumis à un cooldown de 60 secondes pour prévenir le flooding."],
    ["RG-03", "JWT transmis via cookie HTTP-only ou header Authorization Bearer. Access token court, refresh token pour renouvellement."],
    ["RG-04", "Ajout au panier déclenche une réservation de stock d'1h. Libération automatique par un job cron toutes les 30 min."],
    ["RG-05", "Commande créée en statut 'pending' à la création du PaymentIntent. Transition vers 'paid' ou 'failed' exclusivement via webhook Stripe."],
    ["RG-06", "Commandes synchronisées webapp → service-api pour visibilité dans le back-office."],
    ["RG-07", "Abonnement service = WebappSubscription locale + Subscription Stripe, cohérence garantie."],
    ["RG-08", "Mots de passe hashés en SHA-256. Aucun mot de passe en clair."],
    ["RG-09", "Reset password : token UUID unique, valide 1h, marqué utilisé après usage."],
    ["RG-10", "RBAC à deux niveaux : ADMIN et USER. Routes protégées par @Roles('admin') au niveau Gateway."],
    ["RG-11", "Rate limiting : 100 req/min par couple IP + User-Agent. HTTP 429 au-delà."],
    ["RG-12", "Webhook Stripe validé par vérification HMAC avant tout traitement."],
    ["RG-13", "Catégories gérées indépendamment entre BO (Category), service-api (CategoryEntity) et produits (varchar)."],
    ["RG-14", "ValidationPipe configuré whitelist:true, forbidNonWhitelisted:true. Champs non déclarés rejetés."],
    ["RG-15", "Chaque requête reçoit un X-Request-Id unique pour la traçabilité bout en bout."],
];

export default async function BesoinsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§2 · Analyse du besoin"
                title="Besoins, contraintes & règles de gestion"
                description="Identification des acteurs, des contraintes techniques, réglementaires et de performance, puis formulation du contrat fonctionnel du système."
            />

            <h2 id="acteurs">Quatre profils d'acteurs</h2>
            <Mermaid
                chart={`graph TD
    V[👤 Visiteur anonyme] -->|consulte| Cat[Catalogue public]
    C[🛒 Client enregistré] -->|hérite de| V
    C -->|achète, gère son panier| Ach[Transactions]
    A[🛡 Administrateur] -->|hérite de| C
    A -->|gère| Bo[Back-office]
    SA[👑 Super-administrateur] -->|hérite de| A
    SA -->|gère les admins| Ges[Gestion admins]

    style V fill:#0b1220,stroke:#64748b
    style C fill:#0b1220,stroke:#06b6d4
    style A fill:#0b1220,stroke:#a78bfa
    style SA fill:#0b1220,stroke:#ef4444`}
                caption="Figure 1 — Hiérarchie des rôles : chaque rôle hérite des capacités du rôle inférieur."
            />

            <h2 id="contraintes">Contraintes du projet</h2>
            <h3>Techniques</h3>
            <p>
                TypeScript strict de bout en bout (NestJS + React), déploiement 100% Docker + Docker Compose pour la
                reproductibilité des environnements, PostgreSQL + TypeORM imposés, seul le port 80 (Nginx) exposé publiquement.
            </p>
            <h3>Réglementaires</h3>
            <p>
                Conformité <strong>RGPD</strong> pour les données personnelles manipulées (identité, adresses, historique
                d'achats). Traitement des paiements par carte bancaire entièrement délégué à Stripe ({" "}
                <strong>PCI-DSS</strong>), aucune donnée de carte stockée côté serveur. Génération et conservation de factures
                PDF pour chaque transaction.
            </p>
            <h3>Performance</h3>
            <p>
                Charge cible : 1 000 à 5 000 utilisateurs simultanés. Rate limiting 100 req/min/IP au niveau Gateway. Recherche
                catalogue &lt; 200 ms via Elasticsearch. Cohérence des données lors d'accès concurrents sur le stock.
            </p>

            <h2 id="besoins-tableau">Besoins fonctionnels & non fonctionnels</h2>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Besoin</th>
                        <th>Priorité</th>
                    </tr>
                </thead>
                <tbody>
                    <BesoinRow type="F" desc="Catalogue produits et services avec recherche full-text" prio="Haute" />
                    <BesoinRow type="F" desc="Panier avec réservation de stock temporaire (1 heure)" prio="Haute" />
                    <BesoinRow type="F" desc="Paiement sécurisé par carte via Stripe (one-shot et abonnement)" prio="Haute" />
                    <BesoinRow type="F" desc="Authentification 2FA obligatoire pour le back-office" prio="Haute" />
                    <BesoinRow type="F" desc="Génération de factures PDF à la demande" prio="Moyenne" />
                    <BesoinRow type="F" desc="Gestion du contenu éditorial (carrousel, FAQ, promotions)" prio="Moyenne" />
                    <BesoinRow type="F" desc="Tableau de bord statistiques (CA, commandes, clients)" prio="Moyenne" />
                    <BesoinRow type="F" desc="Formulaire de contact avec suivi des messages" prio="Basse" />
                    <BesoinRow type="NF" desc="Temps de réponse < 200 ms pour la recherche catalogue" prio="Haute" />
                    <BesoinRow type="NF" desc="Disponibilité cible 99,5% en production" prio="Haute" />
                    <BesoinRow type="NF" desc="Conformité RGPD sur toutes les données personnelles" prio="Haute" />
                    <BesoinRow type="NF" desc="Isolation réseau des services internes" prio="Haute" />
                    <BesoinRow type="NF" desc="Scalabilité horizontale via Docker" prio="Moyenne" />
                </tbody>
            </table>

            <h2 id="regles-gestion">Règles de gestion</h2>
            <p>
                Les 15 règles de gestion ci-dessous définissent le comportement attendu du système et constituent le contrat
                fonctionnel entre l'équipe de développement et les parties prenantes.
            </p>

            <div className="not-prose my-6 space-y-2">
                {regles.map(([id, desc]) => (
                    <div
                        key={id}
                        className="group flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-brand)]/5"
                    >
                        <div className="shrink-0 rounded bg-[var(--color-brand)]/10 px-2 py-1 font-mono text-xs font-bold text-[var(--color-brand)]">
                            {id}
                        </div>
                        <div className="text-sm text-[var(--fg-muted)]">{desc}</div>
                    </div>
                ))}
            </div>

            <Callout kind="tip" title="Lecture associée">
                Les règles de gestion sont mises en œuvre dans les fiches de conception détaillées (section §5) : chaque règle
                est rattachée à une implémentation concrète.
            </Callout>
        </>
    );
}

function BesoinRow({ type, desc, prio }: { type: "F" | "NF"; desc: string; prio: string }) {
    const prioColor =
        prio === "Haute" ? "text-rose-400" : prio === "Moyenne" ? "text-amber-400" : "text-emerald-400";
    return (
        <tr>
            <td>
                <span className="rounded bg-[var(--color-brand)]/10 px-2 py-0.5 font-mono text-xs font-bold text-[var(--color-brand)]">
                    {type === "F" ? "F" : "NF"}
                </span>
            </td>
            <td>{desc}</td>
            <td>
                <span className={`font-medium ${prioColor}`}>{prio}</span>
            </td>
        </tr>
    );
}
