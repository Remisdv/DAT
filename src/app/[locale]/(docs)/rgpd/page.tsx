import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";

export default async function RgpdPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§8 · Conformité RGPD"
                title="Données personnelles & droits des utilisateurs"
                description="Inventaire des traitements, mesures de protection techniques et organisationnelles, et processus d'exercice des droits."
            />

            <h2 id="inventaire">Inventaire des données personnelles</h2>
            <table>
                <thead>
                    <tr><th>Donnée</th><th>Finalité</th><th>Durée</th><th>Base légale</th></tr>
                </thead>
                <tbody>
                    <tr><td>Identité (nom, prénom)</td><td>Exécution contrat</td><td>3 ans après dernier achat</td><td>Contrat</td></tr>
                    <tr><td>Email</td><td>Compte + communications</td><td>3 ans après dernier achat</td><td>Contrat</td></tr>
                    <tr><td>Mot de passe (hash)</td><td>Authentification</td><td>Tant que compte actif</td><td>Contrat</td></tr>
                    <tr><td>Adresses (livraison, facturation)</td><td>Livraison, facturation</td><td>10 ans (obligations comptables)</td><td>Obligation légale</td></tr>
                    <tr><td>Historique commandes</td><td>Suivi client</td><td>10 ans (facturation)</td><td>Obligation légale</td></tr>
                    <tr><td>Stripe Customer ID</td><td>Paiement récurrent</td><td>Tant qu'abonnement actif</td><td>Contrat</td></tr>
                    <tr><td>IP + User-Agent (logs)</td><td>Sécurité</td><td>12 mois</td><td>Intérêt légitime</td></tr>
                    <tr><td>TOTP secret</td><td>2FA</td><td>Tant qu'activé</td><td>Consentement</td></tr>
                </tbody>
            </table>

            <h2 id="protection">Mesures de protection</h2>
            <h3>Techniques</h3>
            <ul>
                <li>Hash des mots de passe (SHA-256 → migration bcrypt prévue)</li>
                <li>TLS obligatoire en production (HSTS)</li>
                <li>Cookies HTTP-only + SameSite strict</li>
                <li>Aucune donnée bancaire stockée (Stripe PCI-DSS)</li>
                <li>Logs sans PII au niveau debug (anonymisation)</li>
                <li>Isolation réseau Docker, port 80 unique exposé</li>
            </ul>
            <h3>Organisationnelles</h3>
            <ul>
                <li>Accès back-office limité aux administrateurs, 2FA obligatoire</li>
                <li>Journalisation des actions admin (qui / quoi / quand)</li>
                <li>Charte informatique signée par les développeurs</li>
            </ul>

            <h2 id="droits">Exercice des droits utilisateurs</h2>
            <table>
                <thead><tr><th>Droit</th><th>Mise en œuvre</th></tr></thead>
                <tbody>
                    <tr><td>Accès</td><td>Export JSON de toutes les données depuis l'espace compte</td></tr>
                    <tr><td>Rectification</td><td>Édition directe dans l'espace compte (adresse, email, nom)</td></tr>
                    <tr><td>Effacement</td><td>Suppression du compte + anonymisation des commandes (obligation comptable)</td></tr>
                    <tr><td>Portabilité</td><td>Export JSON / CSV standardisé des commandes et profil</td></tr>
                    <tr><td>Opposition</td><td>Désinscription newsletter, retrait du consentement marketing</td></tr>
                </tbody>
            </table>

            <Callout kind="info" title="Anonymisation vs suppression">
                Les obligations comptables (10 ans) imposent de conserver les commandes. Lorsqu'un utilisateur demande
                l'effacement, son profil est supprimé, mais les <code>CustomerOrder</code> conservent le lien via un userId
                remplacé par <code>deleted-uuid</code> et les noms / adresses remplacés par des valeurs génériques.
            </Callout>

            <h2 id="sous-traitants">Sous-traitants (Art. 28 RGPD)</h2>
            <table>
                <thead><tr><th>Prestataire</th><th>Rôle</th><th>Localisation</th></tr></thead>
                <tbody>
                    <tr><td>Stripe</td><td>Paiement</td><td>Irlande / US (SCC)</td></tr>
                    <tr><td>Hébergeur (prod)</td><td>Infrastructure</td><td>UE</td></tr>
                    <tr><td>SMTP transactionnel</td><td>Envoi emails</td><td>UE</td></tr>
                </tbody>
            </table>
        </>
    );
}
