import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { Mermaid } from "@/components/mermaid";
import { TradeoffTabs } from "@/components/tradeoff-tabs";

export default async function AuthPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.1 · Authentification & 2FA"
                title="Trois stratégies, un point d'entrée unique"
                description="BO avec 2FA email obligatoire, Webapp avec 2FA TOTP optionnel, Service-API en session interne. Toutes passent par la Gateway."
            />

            <h2 id="valeur-metier">Valeur métier</h2>
            <p>
                L'authentification est la porte d'entrée du système : elle protège les données sensibles des administrateurs et
                des clients, et conditionne l'accès aux fonctionnalités payantes. La <strong>double authentification</strong>{" "}
                vise spécifiquement à prévenir les compromissions par vol de mot de passe, notamment pour les comptes à
                privilèges élevés.
            </p>

            <h2 id="exigences">Exigences</h2>
            <ul>
                <li><strong>RG-01</strong> : 2FA email obligatoire pour tout accès back-office</li>
                <li><strong>RG-02</strong> : cooldown 60 s entre deux envois de code</li>
                <li><strong>RG-03</strong> : JWT transportable via cookie HTTP-only <em>ou</em> header Bearer</li>
                <li><strong>RG-08</strong> : hash SHA-256 des mots de passe (voir dette technique)</li>
                <li><strong>RG-09</strong> : reset password via token UUID à usage unique, valide 1 h</li>
            </ul>

            <h2 id="conception">Conception retenue</h2>
            <Mermaid
                chart={`sequenceDiagram
    actor U as Utilisateur
    participant G as Gateway
    participant A as API cible (BO/Webapp)
    participant DB as PostgreSQL
    participant M as Mail

    U->>G: POST /auth/login (email + pwd)
    G->>A: Proxy
    A->>DB: findByEmail + compare SHA-256
    alt 2FA activé (BO systématique, Webapp si TOTP activé)
      A->>A: Génère code (email) OU attend TOTP
      A->>M: Email code (si BO)
      A-->>U: 202 { require2FA: true }
      U->>G: POST /auth/2fa/verify
      G->>A: Proxy
      A->>DB: Vérifie code + unicité + expiration
    end
    A->>A: Signe JWT (HMAC-SHA256)
    A-->>U: 200 + Set-Cookie HttpOnly + body { accessToken }`}
                caption="Flux unifié : les deux méthodes 2FA (email et TOTP) convergent vers la même émission de JWT."
            />

            <h3>JwtAuthGuard : vérification manuelle</h3>
            <p>
                La Gateway vérifie les JWT <strong>manuellement</strong> avec le module <code>crypto</code> natif de Node.js
                plutôt que d'utiliser <code>@nestjs/jwt</code>. Ce choix, apparemment redondant, permet une extraction parallèle
                depuis le cookie <code>access_token</code> et le header <code>Authorization Bearer</code>, une gestion fine des
                erreurs d'expiration et une meilleure lisibilité du pipeline.
            </p>

            <h2 id="alternatives">Alternatives écartées</h2>
            <div className="not-prose">
                <TradeoffTabs
                    defaultValue="sessions"
                    panels={[
                        {
                            value: "sessions",
                            label: "Sessions serveur",
                            content: (
                                <div className="mt-4 space-y-3 text-sm text-[var(--fg-muted)]">
                                    <p>
                                        Les sessions côté serveur (avec store Redis) auraient nécessité une infrastructure supplémentaire et
                                        créé un <strong>point de contention</strong> entre les 4 APIs. JWT stateless permet à chaque API de
                                        valider de manière autonome sans aller-retour.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            value: "oauth",
                            label: "OAuth2 tiers (Auth0, Keycloak)",
                            content: (
                                <div className="mt-4 space-y-3 text-sm text-[var(--fg-muted)]">
                                    <p>
                                        Auth0 ou Keycloak apportent des fonctionnalités avancées (SSO, flux SAML). Écartés pour le coût, la
                                        dépendance externe et le fait que CYNA n'a pas de besoin de fédération d'identité. La complexité
                                        ajoutée n'est pas justifiée pour l'usage.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            value: "passport",
                            label: "@nestjs/passport",
                            content: (
                                <div className="mt-4 space-y-3 text-sm text-[var(--fg-muted)]">
                                    <p>
                                        Passport est la solution <em>standard</em> NestJS, mais elle introduit une couche d'abstraction sur
                                        des vérifications JWT triviales. L'équipe a préféré un code explicite de 30 lignes dans la Gateway,
                                        plus auditable.
                                    </p>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <h2 id="dette">Dette technique</h2>
            <Callout kind="danger" title="SHA-256 vs bcrypt/Argon2">
                SHA-256 est un algorithme rapide, non conçu pour le stockage de mots de passe. Sans salt adaptatif, il est
                vulnérable aux attaques par tables arc-en-ciel et aux GPU. <strong>Migration bcrypt ou Argon2id planifiée</strong>{" "}
                (priorité 1 dans la roadmap sécurité).
            </Callout>

            <Callout kind="warning" title="Secret TOTP en clair">
                Le secret <code>totpSecret</code> est actuellement stocké en base en clair. Un chiffrement applicatif
                (<code>crypto.createCipheriv</code> AES-256-GCM) est prévu.
            </Callout>
        </>
    );
}
