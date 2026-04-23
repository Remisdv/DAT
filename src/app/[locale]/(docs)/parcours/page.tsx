import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Timeline } from "@/components/timeline";
import { Mermaid } from "@/components/mermaid";
import { TradeoffTabs } from "@/components/tradeoff-tabs";

export default async function ParcoursPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§2.5 · Parcours utilisateurs"
                title="Trois parcours, trois flux de sécurité"
                description="Visualisation étape par étape des parcours clés : inscription client, achat complet avec paiement Stripe, et authentification administrateur."
            />

            <div className="not-prose">
                <TradeoffTabs
                    defaultValue="inscription"
                    panels={[
                        { value: "inscription", label: "Inscription & login client", content: <Inscription /> },
                        { value: "achat", label: "Achat complet", content: <Achat /> },
                        { value: "admin", label: "Authentification admin", content: <Admin /> },
                    ]}
                />
            </div>
        </>
    );
}

function Inscription() {
    return (
        <div className="mt-4 grid gap-8 xl:grid-cols-[1fr_1.2fr]">
            <Timeline
                steps={[
                    {
                        actor: "Client",
                        title: "Saisie du formulaire d'inscription",
                        description:
                            "Nom, prénom, email, mot de passe. Validation côté client via Zod et côté serveur via ValidationPipe NestJS.",
                    },
                    {
                        actor: "Webapp-API",
                        title: "Vérification d'unicité de l'email",
                        description: "Recherche dans la table WebappUser. Rejet avec HTTP 409 si l'email est déjà enregistré.",
                    },
                    {
                        actor: "Webapp-API",
                        title: "Hash SHA-256 du mot de passe",
                        description: "Création du compte avec statut ACTIVE. Aucun mot de passe en clair ne transite ni n'est persisté.",
                    },
                    {
                        actor: "Client",
                        title: "Connexion & détection du 2FA TOTP",
                        description:
                            "Si le 2FA TOTP est activé, le serveur renvoie une réponse intermédiaire demandant le code temporaire Google Authenticator.",
                    },
                    {
                        actor: "Webapp-API",
                        title: "Vérification TOTP & émission des JWT",
                        description:
                            "La bibliothèque speakeasy vérifie le code. Le serveur émet access + refresh tokens, transmis via cookie HTTP-only.",
                    },
                ]}
            />
            <Mermaid
                chart={`sequenceDiagram
    autonumber
    actor C as Client
    participant F as Webapp Front
    participant G as Gateway
    participant A as Webapp-API
    participant DB as PostgreSQL

    C->>F: Saisie email + mot de passe
    F->>G: POST /api/webapp/auth/login
    G->>A: Proxy + X-Request-Id
    A->>DB: Vérifie user + hash
    alt 2FA TOTP activé
      A-->>F: 202 { require2FA: true }
      C->>F: Saisie code TOTP
      F->>G: POST /auth/2fa/verify
      G->>A: Proxy
      A->>A: speakeasy.verify()
    end
    A-->>F: 200 + Set-Cookie (JWT HTTP-only)
    F-->>C: Redirection espace client`}
                caption="Figure 2 — Authentification client avec 2FA TOTP optionnel."
            />
        </div>
    );
}

function Achat() {
    return (
        <div className="mt-4 grid gap-8 xl:grid-cols-[1fr_1.2fr]">
            <Timeline
                steps={[
                    {
                        actor: "Client",
                        title: "Navigation & recherche catalogue",
                        description: "Le client explore les catégories ou utilise la barre de recherche Elasticsearch (BM25).",
                    },
                    {
                        actor: "Webapp-API",
                        title: "Ajout au panier",
                        description:
                            "Si non connecté → localStorage. Si connecté → POST /api/webapp/cart, persistance en DB et réservation de stock d'1h auprès du service-api.",
                    },
                    {
                        actor: "Client",
                        title: "Checkout en 4 étapes",
                        description:
                            "Adresse livraison → adresse facturation → carte bancaire (Stripe Elements, iframe Stripe) → confirmation.",
                    },
                    {
                        actor: "Webapp-API",
                        title: "Création PaymentIntent + commande pending",
                        description:
                            "Le serveur crée ou récupère le Stripe Customer, crée le PaymentIntent, crée la CustomerOrder en statut pending et synchronise vers service-api.",
                    },
                    {
                        actor: "Stripe",
                        title: "Webhook asynchrone de confirmation",
                        description:
                            "Stripe envoie l'événement signé HMAC. Le webhook met à jour le statut (paid/failed), déclenche l'email de confirmation et vide le panier.",
                    },
                ]}
            />
            <Mermaid
                chart={`sequenceDiagram
    autonumber
    actor C as Client
    participant F as Webapp Front
    participant G as Gateway
    participant W as Webapp-API
    participant S as Stripe
    participant Svc as Service-API
    participant M as Mail

    C->>F: Valide checkout
    F->>G: POST /payment/create-intent
    G->>W: Proxy + X-User-Id
    W->>S: Create PaymentIntent
    W->>W: Create CustomerOrder (pending)
    W->>Svc: OrderSyncService.sync()
    W-->>F: { clientSecret }
    F->>S: stripe.confirmPayment(clientSecret)
    S-->>F: 3DS / validation
    S-->>W: Webhook payment_intent.succeeded (signed)
    W->>W: Update status = paid
    W->>M: Send confirmation email
    W->>W: Clear cart`}
                caption="Figure 3 — Parcours d'achat : la confirmation est asynchrone via le webhook Stripe signé."
            />
        </div>
    );
}

function Admin() {
    return (
        <div className="mt-4 grid gap-8 xl:grid-cols-[1fr_1.2fr]">
            <Timeline
                steps={[
                    {
                        actor: "Admin",
                        title: "Accès bo.localhost",
                        description: "Saisie des identifiants (email + mot de passe) dans l'interface back-office.",
                    },
                    {
                        actor: "BO-API",
                        title: "Vérification identifiants & génération code 2FA",
                        description:
                            "Si valides, génération d'un code 6 chiffres, stockage en DB avec expiration 5 min, envoi par email via Nodemailer.",
                    },
                    {
                        actor: "Admin",
                        title: "Réception email & saisie du code",
                        description: "En dev : visible sur MailHog (port 8025). En prod : serveur SMTP réel.",
                    },
                    {
                        actor: "BO-API",
                        title: "Vérification du code 2FA",
                        description:
                            "Contrôle usage unique + expiration. Suppression du code après utilisation. Émission access + refresh tokens.",
                    },
                    {
                        actor: "Admin",
                        title: "Accès au dashboard",
                        description: "CA, nombre de commandes, répartition par catégorie, évolution temporelle. Navigation vers les modules de gestion.",
                    },
                ]}
            />
            <Mermaid
                chart={`sequenceDiagram
    autonumber
    actor A as Admin
    participant F as BO Front
    participant G as Gateway
    participant B as BO-API
    participant DB as PostgreSQL
    participant M as MailHog / SMTP

    A->>F: Login (email + pwd)
    F->>G: POST /api/bo/auth/login
    G->>B: Proxy
    B->>DB: Vérifie user + hash SHA-256
    B->>B: Génère code 6 chiffres
    B->>DB: Persist code + expiry
    B->>M: Send 2FA email
    B-->>F: 200 { require2FA: true }
    A->>F: Saisie code
    F->>G: POST /auth/2fa/verify
    G->>B: Proxy
    B->>DB: Vérifie code (unique, non expiré)
    B->>DB: Delete code
    B-->>F: 200 + Set-Cookie (JWT)
    F-->>A: Dashboard`}
                caption="Figure 4 — Authentification administrateur avec 2FA email obligatoire."
            />
        </div>
    );
}
