import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { EndpointExplorer } from "@/components/endpoint-explorer";
import { Callout } from "@/components/callout";

export default async function ApiPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.11 · API & endpoints"
                title="Explorer les 40+ endpoints"
                description="Toutes les routes sont exposées via la Gateway sous /api/bo/*, /api/webapp/*, /api/service/*. Filtrez par méthode, niveau d'authentification ou module."
            />

            <Callout kind="info" title="Conventions">
                Toutes les réponses sont en JSON. En cas d'erreur, le body respecte la forme{" "}
                <code>{`{ statusCode, message, error, requestId }`}</code>. Les endpoints <strong>Admin</strong> nécessitent
                un JWT valide + rôle admin. Les endpoints <strong>Auth</strong> nécessitent un JWT valide (client ou admin).
            </Callout>

            <div className="not-prose">
                <EndpointExplorer />
            </div>

            <h2 id="swagger">Documentation OpenAPI</h2>
            <p>
                La Gateway expose une documentation OpenAPI/Swagger générée automatiquement à partir des décorateurs{" "}
                <code>@ApiProperty</code>, <code>@ApiTags</code> et <code>@ApiResponse</code> des contrôleurs. En dev :
                <code> http://api.localhost/api/docs</code>.
            </p>
        </>
    );
}
