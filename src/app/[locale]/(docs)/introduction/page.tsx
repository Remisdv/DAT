import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Glossary } from "@/components/glossary";
import { Callout } from "@/components/callout";

export default async function IntroductionPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§1 · Introduction"
                title="Contexte du projet CYNA"
                description="Plateforme e-commerce spécialisée dans la distribution de produits et services de cybersécurité, conçue pour un public mixte B2B et B2C."
            />

            <h2 id="vision">Vision & positionnement</h2>
            <p>
                Le secteur de la cybersécurité connaît une croissance soutenue, portée par la multiplication des cybermenaces et
                la prise de conscience des entreprises. <strong>CYNA</strong> répond à ce besoin en proposant un espace de
                commerce en ligne dédié aux produits et services de cybersécurité, accessible aux entreprises comme aux
                particuliers avertis.
            </p>

            <p>
                La plateforme propose un catalogue mixte comprenant d'une part des produits physiques, d'autre part des
                services à abonnement comme le <strong>SOC</strong> (Security Operations Center), l'<strong>EDR</strong>{" "}
                (Endpoint Detection and Response) et le <strong>XDR</strong> (Extended Detection and Response). Ces services
                sont accessibles en formule mensuelle ou annuelle.
            </p>

            <h2 id="deux-interfaces">Deux interfaces distinctes</h2>
            <div className="my-6 grid gap-4 md:grid-cols-2 not-prose">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--color-brand)]">Webapp client</div>
                    <h3 className="mb-2 text-lg font-semibold">Parcours d'achat grand public</h3>
                    <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                        De la consultation du catalogue au paiement Stripe, en passant par la création de compte, la gestion du
                        panier et le suivi des abonnements.
                    </p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-[var(--color-brand-2)]">Back-office</div>
                    <h3 className="mb-2 text-lg font-semibold">Administration interne</h3>
                    <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                        Gestion du catalogue, suivi des commandes, gestion des utilisateurs et consultation de statistiques de
                        vente, avec 2FA email obligatoire.
                    </p>
                </div>
            </div>

            <h2 id="architecture-macro">Architecture macro</h2>
            <p>
                Le projet repose sur une <strong>architecture monolithe modulaire distribué</strong> : quatre APIs NestJS
                indépendantes communiquent entre elles derrière une API Gateway unique, le tout entièrement containerisé avec
                Docker. Ce choix architectural offre un équilibre entre la simplicité de déploiement d'un monolithe et la
                séparation des responsabilités propre aux micro-services.
            </p>

            <Callout kind="info" title="Rôle de ce document">
                Ce livrable regroupe le Dossier d'Architecture Technique (DAT — vision macro) et le Dossier de Conception
                Technique (DCT — vision micro) afin de servir de référence unique pour la maintenance et l'évolution du projet.
            </Callout>

            <h2 id="perimetre">Périmètre fonctionnel</h2>
            <h3>Côté client</h3>
            <ul>
                <li>Navigation dans un catalogue structuré par catégories</li>
                <li>Recherche de produit ou service via Elasticsearch</li>
                <li>Ajout au panier avec réservation de stock temporaire (1 heure)</li>
                <li>Paiement sécurisé par carte bancaire ou abonnement récurrent</li>
                <li>Gestion du compte : historique des commandes, téléchargement de factures PDF</li>
            </ul>
            <h3>Côté administration</h3>
            <ul>
                <li>Gestion complète du catalogue produits et services</li>
                <li>Gestion du contenu éditorial (carrousel, FAQ, textes promotionnels)</li>
                <li>Suivi des commandes avec mise à jour des statuts</li>
                <li>Gestion des utilisateurs back-office avec contrôle d'accès par rôles</li>
                <li>Consultation de tableaux de bord statistiques</li>
            </ul>

            <h2 id="glossaire">Glossaire technique</h2>
            <p>
                Les termes techniques récurrents sont définis ci-dessous. Ces définitions s'appliquent dans l'intégralité du
                document. Utilisez le champ de recherche pour filtrer.
            </p>
            <div className="not-prose">
                <Glossary />
            </div>
        </>
    );
}
