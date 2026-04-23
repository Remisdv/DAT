import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";

export default async function EmailsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.6 · Emails transactionnels"
                title="Nodemailer + Handlebars, MailHog en dev"
                description="Trois usages — codes 2FA, reset password, confirmation de commande — avec templates HTML partagés et capture intégrale en dev."
            />

            <h2 id="valeur">Valeur métier</h2>
            <p>
                Les emails transactionnels sont critiques : un email 2FA qui n'arrive pas = administrateur bloqué, une
                confirmation de commande qui n'arrive pas = support client saturé. Le système doit être observable en
                développement et robuste en production.
            </p>

            <h2 id="conception">Conception</h2>
            <ul>
                <li><strong>Nodemailer</strong> — client SMTP universel, compatible MailHog et serveurs réels.</li>
                <li><strong>Handlebars</strong> — templates HTML avec variables contextuelles (prénom, numéro commande, code).</li>
                <li><strong>MailHog</strong> — capture SMTP en dev, interface web <code>http://localhost:8025</code>.</li>
                <li><strong>Retry policy</strong> — 3 tentatives avec backoff exponentiel (1s, 2s, 4s).</li>
            </ul>

            <h3>Architecture du MailService</h3>
            <pre><code className="language-typescript">{`@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
  });

  async send2faCode(to: string, code: string) {
    const html = await this.render('2fa-code', { code });
    return this.sendWithRetry({ to, subject: 'Code CYNA', html });
  }
}`}</code></pre>

            <Callout kind="info" title="Séparation dev / prod">
                En dev : aucun email réel n'est envoyé, tous sont capturés par MailHog. En prod : fournisseur SMTP transactionnel
                (Resend, SendGrid, Mailjet). Le code reste identique.
            </Callout>

            <h2 id="templates">Templates disponibles</h2>
            <table>
                <thead><tr><th>Template</th><th>Déclencheur</th><th>Variables</th></tr></thead>
                <tbody>
                    <tr><td>2fa-code.hbs</td><td>Connexion BO</td><td>code, expiresIn</td></tr>
                    <tr><td>password-reset.hbs</td><td>Demande reset</td><td>firstName, resetUrl</td></tr>
                    <tr><td>order-confirmation.hbs</td><td>Webhook Stripe paid</td><td>orderNumber, items, total</td></tr>
                    <tr><td>contact-admin.hbs</td><td>Message de contact</td><td>from, subject, body</td></tr>
                </tbody>
            </table>
        </>
    );
}
