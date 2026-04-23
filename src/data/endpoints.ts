export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type AuthLevel = "Public" | "Auth" | "Admin";

export type Endpoint = {
    method: Method;
    path: string;
    auth: AuthLevel;
    module: "bo-auth" | "bo-catalog" | "bo-content" | "bo-users" | "bo-orders" | "bo-stats" | "webapp-auth" | "webapp-cart" | "webapp-payment" | "webapp-orders" | "webapp-account" | "webapp-contact" | "public";
    description: string;
    codes?: string;
};

export const endpoints: Endpoint[] = [
    // Auth BO
    { method: "POST", path: "/api/bo/auth/login", auth: "Public", module: "bo-auth", description: "Login admin (étape 1, déclenche 2FA email)", codes: "200, 401, 429" },
    { method: "POST", path: "/api/bo/auth/2fa/verify", auth: "Public", module: "bo-auth", description: "Vérification du code 2FA, retourne JWT", codes: "200, 401, 410" },
    { method: "POST", path: "/api/bo/auth/2fa/resend", auth: "Public", module: "bo-auth", description: "Renvoi du code 2FA (cooldown 60s)", codes: "200, 429" },
    { method: "POST", path: "/api/bo/auth/refresh", auth: "Public", module: "bo-auth", description: "Refresh des tokens access + refresh", codes: "200, 401" },
    { method: "POST", path: "/api/bo/auth/logout", auth: "Public", module: "bo-auth", description: "Déconnexion (suppression cookie)", codes: "200" },

    // Catalog BO
    { method: "GET", path: "/api/bo/categories", auth: "Public", module: "bo-catalog", description: "Liste de toutes les catégories" },
    { method: "GET", path: "/api/bo/categories/:id", auth: "Public", module: "bo-catalog", description: "Détail d'une catégorie par identifiant" },
    { method: "POST", path: "/api/bo/categories", auth: "Admin", module: "bo-catalog", description: "Création d'une nouvelle catégorie" },
    { method: "PUT", path: "/api/bo/categories/:id", auth: "Admin", module: "bo-catalog", description: "Modification d'une catégorie existante" },
    { method: "DELETE", path: "/api/bo/categories/:id", auth: "Admin", module: "bo-catalog", description: "Suppression d'une catégorie" },
    { method: "GET", path: "/api/bo/services", auth: "Admin", module: "bo-catalog", description: "Liste des services du catalogue" },
    { method: "POST", path: "/api/bo/services", auth: "Admin", module: "bo-catalog", description: "Création d'un nouveau service" },

    // Content BO
    { method: "GET", path: "/api/bo/carousel", auth: "Public", module: "bo-content", description: "Liste des slides du carrousel" },
    { method: "POST", path: "/api/bo/carousel", auth: "Admin", module: "bo-content", description: "Ajout d'un slide au carrousel" },
    { method: "PUT", path: "/api/bo/carousel/:id", auth: "Admin", module: "bo-content", description: "Modification d'un slide" },
    { method: "DELETE", path: "/api/bo/carousel/:id", auth: "Admin", module: "bo-content", description: "Suppression d'un slide" },
    { method: "POST", path: "/api/bo/upload", auth: "Admin", module: "bo-content", description: "Upload d'image (max 5 Mo, jpeg/png/gif/webp)" },

    // Webapp auth
    { method: "POST", path: "/api/webapp/auth/register", auth: "Public", module: "webapp-auth", description: "Inscription d'un nouveau client" },
    { method: "POST", path: "/api/webapp/auth/login", auth: "Public", module: "webapp-auth", description: "Connexion client (avec ou sans 2FA TOTP)" },
    { method: "POST", path: "/api/webapp/auth/forgot-password", auth: "Public", module: "webapp-auth", description: "Demande de réinitialisation de mot de passe" },
    { method: "POST", path: "/api/webapp/auth/reset-password", auth: "Public", module: "webapp-auth", description: "Réinitialisation avec token UUID" },

    // Webapp cart
    { method: "GET", path: "/api/webapp/cart", auth: "Auth", module: "webapp-cart", description: "Récupération du panier de l'utilisateur" },
    { method: "POST", path: "/api/webapp/cart", auth: "Auth", module: "webapp-cart", description: "Ajout d'un article (réservation stock 1h)" },
    { method: "PUT", path: "/api/webapp/cart/:id", auth: "Auth", module: "webapp-cart", description: "Modification de la quantité d'un article" },
    { method: "DELETE", path: "/api/webapp/cart/:id", auth: "Auth", module: "webapp-cart", description: "Suppression d'un article du panier" },

    // Webapp payment
    { method: "POST", path: "/api/webapp/payment/create-intent", auth: "Auth", module: "webapp-payment", description: "Création d'un PaymentIntent Stripe" },
    { method: "POST", path: "/api/webapp/payment/stripe/webhook", auth: "Public", module: "webapp-payment", description: "Réception webhook Stripe (signature HMAC vérifiée)" },

    // Webapp orders
    { method: "GET", path: "/api/webapp/orders", auth: "Auth", module: "webapp-orders", description: "Liste des commandes du client connecté" },
    { method: "GET", path: "/api/webapp/orders/:id", auth: "Auth", module: "webapp-orders", description: "Détail d'une commande spécifique" },
    { method: "GET", path: "/api/webapp/orders/:id/invoice", auth: "Auth", module: "webapp-orders", description: "Téléchargement de la facture PDF" },

    // Webapp account
    { method: "GET", path: "/api/webapp/account", auth: "Auth", module: "webapp-account", description: "Consultation du profil utilisateur" },
    { method: "PUT", path: "/api/webapp/account", auth: "Auth", module: "webapp-account", description: "Modification du profil utilisateur" },

    // Contact
    { method: "POST", path: "/api/webapp/contact", auth: "Public", module: "webapp-contact", description: "Envoi d'un message via le formulaire de contact" },

    // BO orders / stats / users
    { method: "GET", path: "/api/bo/orders", auth: "Admin", module: "bo-orders", description: "Consultation des commandes (synchronisées depuis la webapp)" },
    { method: "PUT", path: "/api/bo/orders/:id/status", auth: "Admin", module: "bo-orders", description: "Mise à jour du statut (pending, confirmed, shipped, delivered)" },
    { method: "GET", path: "/api/bo/stats/dashboard", auth: "Admin", module: "bo-stats", description: "Tableau de bord : CA, nombre de commandes, répartition catégories" },
    { method: "GET", path: "/api/bo/users", auth: "Admin", module: "bo-users", description: "Liste des utilisateurs back-office" },
    { method: "POST", path: "/api/bo/users", auth: "Admin", module: "bo-users", description: "Création d'un utilisateur USER (admin réservé au super-admin)" },

    // Public catalog
    { method: "GET", path: "/api/public/categories", auth: "Public", module: "public", description: "Catégories publiques actives" },
    { method: "GET", path: "/api/public/products", auth: "Public", module: "public", description: "Catalogue (filtres, pagination, recherche full-text Elasticsearch)" },
    { method: "GET", path: "/api/public/products/:slug", auth: "Public", module: "public", description: "Fiche produit par slug SEO-friendly" },
    { method: "GET", path: "/api/public/services", auth: "Public", module: "public", description: "Liste des services publiés" },
    { method: "GET", path: "/api/public/carousel", auth: "Public", module: "public", description: "Slides du carrousel de la page d'accueil" },
];

export const moduleLabels: Record<Endpoint["module"], string> = {
    "bo-auth": "BO · Auth",
    "bo-catalog": "BO · Catalogue",
    "bo-content": "BO · Contenu",
    "bo-users": "BO · Utilisateurs",
    "bo-orders": "BO · Commandes",
    "bo-stats": "BO · Statistiques",
    "webapp-auth": "Webapp · Auth",
    "webapp-cart": "Webapp · Panier",
    "webapp-payment": "Webapp · Paiement",
    "webapp-orders": "Webapp · Commandes",
    "webapp-account": "Webapp · Compte",
    "webapp-contact": "Webapp · Contact",
    public: "Public · Catalogue",
};
