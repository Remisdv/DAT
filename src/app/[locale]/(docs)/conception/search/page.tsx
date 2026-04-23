import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { Mermaid } from "@/components/mermaid";
import { TradeoffTabs } from "@/components/tradeoff-tabs";

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.5 · Recherche Elasticsearch"
                title="BM25, facettes & synchronisation"
                description="Recherche full-text avec scoring par pertinence, agrégations à facettes, synchronisation DB → ES via event listeners TypeORM."
            />

            <h2 id="valeur">Valeur métier</h2>
            <p>
                Une recherche catalogue rapide et pertinente est un levier de conversion direct : un utilisateur qui ne trouve
                pas un produit quitte la plateforme. L'objectif est une <strong>latence &lt; 200 ms</strong> avec un scoring
                adapté (poids plus élevé sur le titre, fuzzy matching pour les typos).
            </p>

            <h2 id="indexation">Indexation</h2>
            <p>
                Deux index Elasticsearch : <code>products</code> et <code>services</code>. Le mapping déclare explicitement les
                champs <code>text</code> (analysés) et <code>keyword</code> (exacts, pour les facettes).
            </p>
            <pre><code className="language-typescript">{`{
  mappings: {
    properties: {
      name:        { type: 'text', analyzer: 'french' },
      description: { type: 'text', analyzer: 'french' },
      category:    { type: 'keyword' },
      price:       { type: 'float' },
      inStock:     { type: 'boolean' },
    }
  }
}`}</code></pre>

            <h3>Synchronisation DB ↔ ES</h3>
            <Mermaid
                chart={`flowchart LR
    A[Admin crée/modifie produit BO] --> DB[(PostgreSQL)]
    DB -->|AfterInsert / AfterUpdate| L[TypeORM listener]
    L --> Q[Queue in-memory]
    Q --> ES[Elasticsearch]
    ES --> S[Front : recherche]`}
                caption="Les listeners TypeORM garantissent la cohérence eventual entre la DB et l'index."
            />

            <Callout kind="warning" title="Limitation actuelle">
                La synchronisation est in-memory : en cas de crash pendant la propagation, un document peut manquer. Migration
                vers une vraie queue (BullMQ / Redis) prévue pour la production multi-instance.
            </Callout>

            <h2 id="query">Requête type</h2>
            <pre><code className="language-typescript">{`{
  query: {
    multi_match: {
      query: 'firewall entreprise',
      fields: ['name^3', 'description'],
      fuzziness: 'AUTO'
    }
  },
  aggs: {
    categories: { terms: { field: 'category' } },
    price_ranges: { range: { field: 'price', ranges: [...] } }
  }
}`}</code></pre>

            <h2 id="alternatives">Alternatives écartées</h2>
            <div className="not-prose">
                <TradeoffTabs
                    defaultValue="pgfts"
                    panels={[
                        { value: "pgfts", label: "PostgreSQL full-text (tsvector)", content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Suffisant pour un petit catalogue, mais scoring rudimentaire, pas de fuzzy matching, pas de facettes natives.</p> },
                        { value: "meili", label: "Meilisearch", content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Excellent pour le typo-tolerance out-of-the-box, mais écosystème plus jeune, agrégations moins riches, support TypeScript moins mature.</p> },
                        { value: "algolia", label: "Algolia (SaaS)", content: <p className="mt-4 text-sm text-[var(--fg-muted)]">Performant mais coûteux à l'échelle, création d'une dépendance externe non souhaitée pour un MVP auto-hébergé.</p> },
                    ]}
                />
            </div>
        </>
    );
}
