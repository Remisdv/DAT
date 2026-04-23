import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { TradeoffTabs } from "@/components/tradeoff-tabs";

export default async function RbacPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.3 · RBAC & Guards"
                title="Contrôle d'accès à deux niveaux"
                description="Deux rôles — ADMIN et USER — appliqués via JwtAuthGuard puis RolesGuard au niveau Gateway, sans duplication dans les APIs internes."
            />

            <h2 id="valeur-metier">Valeur métier</h2>
            <p>
                Le <strong>RBAC</strong> (Role-Based Access Control) empêche un utilisateur client d'accéder aux fonctions
                d'administration (gestion catalogue, consultation des commandes d'autres utilisateurs), et garantit que seuls
                les administrateurs authentifiés avec 2FA peuvent modifier le catalogue en production.
            </p>

            <h2 id="conception">Conception retenue — Décorateur + Guards</h2>
            <p>
                Le décorateur <code>@Roles('admin')</code> associe à chaque route un rôle minimum. Un <code>RolesGuard</code>{" "}
                NestJS applique la vérification après <code>JwtAuthGuard</code>. L'ordre est garanti par l'ordre de déclaration
                des guards au niveau du contrôleur.
            </p>

            <pre><code className="language-typescript">{`@Controller('api/bo/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class BoUsersController {
  @Get() findAll() { /* … */ }
  @Delete(':id') remove() { /* … */ }
}`}</code></pre>

            <h3>Implémentation RolesGuard</h3>
            <pre><code className="language-typescript">{`@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>('roles', context.getHandler());
    if (!required) return true;
    const { user } = context.switchToHttp().getRequest();
    return required.some(r => user?.roles?.includes(r));
  }
}`}</code></pre>

            <h2 id="routes">Typologie des routes</h2>
            <table>
                <thead>
                    <tr><th>Protection</th><th>Exemples</th><th>Traitement Gateway</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400">Public</span></td>
                        <td>Catalogue, login, register</td>
                        <td>Pipeline complet sauf auth</td>
                    </tr>
                    <tr>
                        <td><span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-xs font-bold text-cyan-400">Auth</span></td>
                        <td>Panier, commandes, profil</td>
                        <td>JwtAuthGuard uniquement</td>
                    </tr>
                    <tr>
                        <td><span className="rounded bg-violet-500/10 px-2 py-0.5 font-mono text-xs font-bold text-violet-400">Admin</span></td>
                        <td>BO complet, stats</td>
                        <td>JwtAuthGuard + RolesGuard('admin')</td>
                    </tr>
                </tbody>
            </table>

            <h2 id="alternatives">Alternatives écartées</h2>
            <div className="not-prose">
                <TradeoffTabs
                    defaultValue="abac"
                    panels={[
                        { value: "abac", label: "ABAC (permissions fines)", content: <p className="mt-4 text-sm text-[var(--fg-muted)]">CASL/Oso offrent du contrôle attribut par attribut. Écarté : deux rôles suffisent pour CYNA, le surcoût de maintenance n'est pas justifié. Migration facile vers CASL si le besoin apparaît.</p> },
                        { value: "db-roles", label: "Rôles en base (table Roles)", content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Nécessite une requête DB par check. Le rôle est mieux placé dans le JWT : validé une fois à l'émission, vérifié sans I/O ensuite.</p> },
                        { value: "duplic", label: "Vérification dans chaque API", content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Aurait dupliqué la logique RBAC dans 4 APIs. La centralisation Gateway élimine le risque de divergence.</p> },
                    ]}
                />
            </div>

            <Callout kind="info" title="Évolution future">
                L'ajout d'un rôle SUPER_ADMIN (gestion des admins) est déjà prévu et ne demandera qu'un enum et quelques
                annotations <code>@Roles('super_admin')</code>.
            </Callout>
        </>
    );
}
