import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { Mermaid } from "@/components/mermaid";
import { TradeoffTabs } from "@/components/tradeoff-tabs";

export default async function StripePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.4 · Paiement Stripe"
                title="Une intégration prête pour la production"
                description="PaymentIntent pour les paiements uniques, Subscription pour les abonnements, webhook signé HMAC pour la cohérence. Aucune donnée de carte ne transite côté serveur."
            />

            <h2 id="valeur-metier">Valeur métier</h2>
            <p>
                Stripe décharge CYNA de la <strong>conformité PCI-DSS</strong> : les numéros de carte ne transitent jamais côté
                serveur, ils sont capturés directement par l'iframe Stripe Elements. Les webhooks permettent de confirmer le
                paiement <strong>indépendamment</strong> du client, prévenant les manipulations par la partie cliente.
            </p>

            <h2 id="flux">Flux de paiement unique</h2>
            <Mermaid
                chart={`sequenceDiagram
    autonumber
    actor C as Client
    participant F as Front
    participant W as Webapp-API
    participant S as Stripe

    C->>F: Valide checkout
    F->>W: POST /payment/create-intent
    W->>S: stripe.customers.create() si nouveau
    W->>S: stripe.paymentIntents.create()
    W->>W: Create CustomerOrder (pending)
    W-->>F: { clientSecret }
    F->>S: stripe.confirmPayment(clientSecret)
    S-->>F: 3DS challenge
    C->>S: Validation 3DS
    S-->>W: Webhook payment_intent.succeeded (signé)
    W->>W: Vérifie HMAC signature
    W->>W: Update status = paid
    W->>W: Send email + clear cart`}
                caption="La mise à jour du statut commande se fait uniquement via webhook, jamais côté client."
            />

            <h2 id="webhook">Sécurité du webhook</h2>
            <Callout kind="warning" title="Vérification HMAC obligatoire">
                Toute requête arrivant sur <code>/payment/webhook</code> doit être validée via{" "}
                <code>stripe.webhooks.constructEvent()</code> avec le secret webhook. En cas d'échec, HTTP 400 immédiat, aucun
                traitement.
            </Callout>
            <pre><code className="language-typescript">{`@Post('webhook')
@HttpCode(200)
async handleWebhook(
  @Headers('stripe-signature') sig: string,
  @Req() req: RawBodyRequest<Request>,
) {
  const event = stripe.webhooks.constructEvent(
    req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET,
  );
  // Switch sur event.type …
}`}</code></pre>

            <h2 id="abonnements">Abonnements récurrents</h2>
            <p>
                Pour les services SOC / EDR / XDR, CYNA utilise les <strong>Subscriptions</strong> Stripe. Une entité locale{" "}
                <code>WebappSubscription</code> stocke l'ID Stripe pour la réconciliation. Les événements{" "}
                <code>customer.subscription.*</code> mettent à jour le statut local.
            </p>

            <h2 id="reconciliation">Réconciliation des données</h2>
            <p>
                Chaque <code>CustomerOrder</code> porte un champ <code>stripePaymentIntentId</code>. En cas d'incohérence
                (webhook perdu, race condition), un job de réconciliation quotidien peut être déclenché : listing des Payment
                Intents Stripe des dernières 24h et comparaison avec la base locale.
            </p>

            <h2 id="alternatives">Alternatives écartées</h2>
            <div className="not-prose">
                <TradeoffTabs
                    defaultValue="paypal"
                    panels={[
                        { value: "paypal", label: "PayPal", content: <p className="mt-4 text-sm text-[var(--fg-muted)]">SDK moins ergonomique, moins adapté aux abonnements SaaS, peu de support TypeScript natif.</p> },
                        { value: "redirect", label: "Checkout redirect (Stripe Checkout)", content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Plus simple mais moins flexible UX (redirection externe). Stripe Elements permet un parcours entièrement intégré sans perdre l'utilisateur.</p> },
                        { value: "direct", label: "Intégration bancaire directe", content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Responsabilité PCI-DSS totale sur CYNA : coûts, audits, risques inacceptables pour le projet.</p> },
                    ]}
                />
            </div>

            <Callout kind="tip" title="Mode test / prod">
                Les clés <code>sk_test_*</code> et <code>sk_live_*</code> sont strictement séparées par environnement. Aucune
                clé live n'est présente en dev ni en test.
            </Callout>
        </>
    );
}
