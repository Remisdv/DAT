import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";

export default async function SessionsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.9 · Sessions & cookies"
                title="Stateless côté serveur, sécurisé côté client"
                description="Cookies HTTP-only, SameSite strict, refresh token rotatif. Les JWT sont idempotents et auto-portants, aucune session serveur."
            />

            <h2 id="cookies">Configuration des cookies</h2>
            <pre><code className="language-typescript">{`res.cookie('access_token', token, {
  httpOnly: true,            // bloque XSS
  secure: isProd,            // HTTPS only en prod
  sameSite: 'strict',        // bloque CSRF cross-origin
  maxAge: 15 * 60 * 1000,    // 15 min
  path: '/',
});`}</code></pre>

            <h2 id="refresh">Refresh token & rotation</h2>
            <p>
                L'<code>access_token</code> a une durée de vie courte (15 min), minimisant l'impact d'un vol. Le{" "}
                <code>refresh_token</code> (7 jours) permet de générer un nouvel access token sans redemander les identifiants.
                À chaque refresh, un nouveau refresh token est émis et l'ancien invalidé (rotation).
            </p>

            <h2 id="deconnexion">Déconnexion</h2>
            <p>
                La déconnexion efface les cookies côté client via <code>res.clearCookie()</code>. Comme les JWT sont
                stateless, la vraie protection contre la réutilisation d'un token volé repose sur sa courte durée de vie et sur
                une éventuelle <strong>blocklist</strong> (prévue en Redis pour la production).
            </p>

            <Callout kind="warning" title="Stateful vs Stateless">
                Tant que la blocklist n'est pas en place, un access token volé reste valide jusqu'à son expiration naturelle (15
                min max). C'est un compromis assumé en MVP.
            </Callout>
        </>
    );
}
