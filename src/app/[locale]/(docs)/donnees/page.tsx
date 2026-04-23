import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Mermaid } from "@/components/mermaid";
import { Callout } from "@/components/callout";

export default async function DonneesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <PageHeader
                eyebrow="§5.10 · Modèle de données"
                title="Trois agrégats, une base partagée"
                description="Le schéma PostgreSQL est logiquement divisé en trois domaines — BO, Webapp, Service — reliés par des clés étrangères logiques plutôt que physiques."
            />

            <h2 id="bo">Domaine BO-API</h2>
            <Mermaid
                chart={`classDiagram
    class User {
      +UUID id
      +string email
      +string passwordHash
      +string role
      +string? totpSecret
      +Date createdAt
    }
    class Category {
      +UUID id
      +string name
      +string slug
      +int order
    }
    class CarouselItem {
      +UUID id
      +string imagePath
      +string linkUrl
      +int order
      +bool active
    }
    class Faq {
      +UUID id
      +string question
      +text answer
      +int order
    }
    class TextePromotionnel {
      +UUID id
      +string location
      +text content
      +bool active
    }`}
                caption="Entités BO — administration du catalogue et du contenu éditorial."
            />

            <h2 id="webapp">Domaine Webapp-API</h2>
            <Mermaid
                chart={`classDiagram
    class WebappUser {
      +UUID id
      +string email
      +string passwordHash
      +string? stripeCustomerId
      +string? totpSecret
      +bool totpEnabled
    }
    class CartItem {
      +UUID id
      +string userId
      +string productId
      +int quantity
      +Date reservedUntil
    }
    class CustomerOrder {
      +UUID id
      +string userId
      +string status
      +JSONB items
      +JSONB shippingAddress
      +decimal total
      +string? stripePaymentIntentId
      +Date createdAt
    }
    class WebappSubscription {
      +UUID id
      +string userId
      +string serviceId
      +string stripeSubscriptionId
      +string status
    }
    class PasswordResetToken {
      +UUID id
      +string userId
      +string token
      +Date expiresAt
      +bool used
    }
    class ContactMessage {
      +UUID id
      +string email
      +string subject
      +text body
      +string status
    }
    WebappUser "1" --> "*" CartItem
    WebappUser "1" --> "*" CustomerOrder
    WebappUser "1" --> "*" WebappSubscription`}
                caption="Entités Webapp — comptes clients, panier, commandes, abonnements et messages."
            />

            <h2 id="service">Domaine Service-API</h2>
            <Mermaid
                chart={`classDiagram
    class ProductEntity {
      +UUID id
      +string name
      +text description
      +decimal price
      +int stock
      +string categoryId
      +JSONB images
    }
    class ServiceEntity {
      +UUID id
      +string name
      +text description
      +decimal monthlyPrice
      +decimal yearlyPrice
      +string categoryId
    }
    class OrderEntity {
      +UUID id
      +string webappOrderId
      +string userId
      +JSONB items
      +string status
      +Date syncedAt
    }
    class TrackingEventEntity {
      +UUID id
      +string orderId
      +string status
      +string? note
      +Date occurredAt
    }
    OrderEntity "1" --> "*" TrackingEventEntity`}
                caption="Entités Service — catalogue produits/services et réplica des commandes avec tracking."
            />

            <Callout kind="info" title="Pourquoi une base partagée ?">
                Pour accélérer le développement initial et éviter la complexité des jointures cross-databases. Les clés
                étrangères logiques permettent néanmoins une séparation future vers des bases distinctes sans refactoring
                majeur du modèle.
            </Callout>

            <h2 id="migrations">Migrations</h2>
            <p>
                En dev : <code>synchronize: true</code> pour l'agilité. En prod : <code>synchronize: false</code>, migrations
                manuelles via <code>typeorm migration:generate</code> et <code>typeorm migration:run</code>. Les migrations
                sont versionnées dans le monorepo et appliquées au démarrage du conteneur via un script d'entrée.
            </p>
        </>
    );
}
