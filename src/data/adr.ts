export type ADRStatus = "Accepté" | "Proposé" | "Remplacé";

export type ADR = {
    id: string;
    title: string;
    status: ADRStatus;
    context: string;
    decision: string;
    consequences: string;
};

export const adrs: ADR[] = [
    {
        id: "ADR-01",
        title: "Node.js + NestJS pour le backend",
        status: "Accepté",
        context:
            "Le backend doit gérer des APIs REST sécurisées, l'authentification JWT avec 2FA, l'intégration de services externes (Stripe, Elasticsearch) et une charge modérée de 1 000 à 5 000 utilisateurs.",
        decision:
            "Le backend est développé avec Node.js et NestJS en TypeScript, pour une cohérence technologique avec le frontend React/TypeScript, une structuration claire du code grâce aux décorateurs NestJS, et une intégration rapide via l'écosystème NPM.",
        consequences:
            "Développement rapide et structuré, code maintenable grâce au typage TypeScript, bonne intégration avec les outils modernes. En contrepartie, la performance est inférieure aux langages compilés et le modèle single-thread de Node.js nécessite une attention particulière pour la scalabilité.",
    },
    {
        id: "ADR-02",
        title: "Docker pour la conteneurisation",
        status: "Accepté",
        context:
            "Le projet nécessite des environnements cohérents entre développement, test et production, un déploiement simplifié et une capacité d'évolution vers l'orchestration.",
        decision:
            "L'application est entièrement conteneurisée avec Docker Compose. Chaque composant (4 APIs, 2 frontends, base de données, moteur de recherche, reverse proxy, serveur email) s'exécute dans un conteneur dédié au sein du réseau bridge cyna-network.",
        consequences:
            "Reproductibilité totale des environnements, isolation des services, déploiement en une commande, préparation à une migration future vers Kubernetes. La complexité initiale est compensée par la fiabilité opérationnelle.",
    },
    {
        id: "ADR-03",
        title: "Gateway unique comme point d'entrée API",
        status: "Accepté",
        context:
            "Le système comporte 4 APIs NestJS dont 3 sont des services internes. La question est de savoir si ces APIs doivent être exposées individuellement ou fédérées.",
        decision:
            "Une Gateway NestJS unique constitue le seul point d'entrée public. Elle centralise l'authentification JWT, l'autorisation par rôles, le rate limiting, la journalisation et le proxy HTTP vers les services internes.",
        consequences:
            "Surface d'attaque réduite, politiques de sécurité uniformes, documentation Swagger centralisée. En contrepartie, la Gateway devient un SPOF nécessitant une attention particulière à sa disponibilité.",
    },
    {
        id: "ADR-04",
        title: "PostgreSQL comme base de données principale",
        status: "Accepté",
        context:
            "Le système nécessite le stockage de données relationnelles avec des besoins ACID, JSONB, UUID et génération automatique.",
        decision:
            "PostgreSQL 16 est retenu comme base unique, partagée entre les 4 APIs via un schéma commun. Support natif JSONB, UUID, enum, compatibilité TypeORM et pg_isready pour les healthchecks.",
        consequences:
            "Robustesse ACID pour les opérations critiques, flexibilité JSONB pour les données variables, écosystème mature. Le partage d'un schéma unique crée un couplage identifié comme dette technique.",
    },
    {
        id: "ADR-05",
        title: "Elasticsearch pour la recherche catalogue",
        status: "Accepté",
        context:
            "Le catalogue nécessite une fonctionnalité de recherche full-text performante et pertinente au-delà des capacités SQL.",
        decision:
            "Elasticsearch 8.12.0 en single-node pour indexation et recherche. BM25 fournit un scoring par pertinence, filtrage à facettes. Fallback PostgreSQL ILIKE implémenté.",
        consequences:
            "Résultats pertinents et rapides, capacités d'agrégation avancées. Cohérence PostgreSQL/Elasticsearch à surveiller, résolue par une commande de ré-indexation complète.",
    },
    {
        id: "ADR-06",
        title: "Stripe pour le paiement",
        status: "Accepté",
        context:
            "La plateforme doit traiter des paiements par carte bancaire (ponctuels et récurrents) en conformité PCI-DSS.",
        decision:
            "Stripe est retenu comme prestataire de paiement exclusif. Stripe Elements côté client dans des iframes sécurisées, SDK serveur v22 pour PaymentIntents et Subscriptions, webhooks signés pour confirmation asynchrone.",
        consequences:
            "Aucune donnée de carte stockée ni transitée par nos serveurs, support natif des abonnements, SDK TypeScript bien typé. Dépendance à un prestataire unique maîtrisée par la maturité de Stripe.",
    },
    {
        id: "ADR-07",
        title: "Vérification JWT manuelle dans la Gateway",
        status: "Accepté",
        context:
            "La Gateway doit vérifier les tokens JWT pour chaque requête, mais ne génère pas de tokens (responsabilité de bo-api et webapp-api).",
        decision:
            "Vérification JWT implémentée manuellement via le module crypto natif de Node.js (HMAC-SHA256), sans utiliser @nestjs/jwt dans la Gateway.",
        consequences:
            "Élimination d'une dépendance externe dans le composant le plus critique, contrôle total sur la logique de vérification, performance optimale. Le JWT_SECRET doit être partagé via variables d'environnement entre la Gateway et les services générateurs.",
    },
];
