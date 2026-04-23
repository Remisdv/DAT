export type GlossaryEntry = {
    term: string;
    definition: string;
};

export const glossary: GlossaryEntry[] = [
    { term: "JWT", definition: "JSON Web Token. Standard ouvert (RFC 7519) permettant l'échange sécurisé de revendications entre deux parties sous forme de jeton signé numériquement." },
    { term: "2FA / MFA", definition: "Authentification à deux facteurs. Mécanisme exigeant deux preuves d'identité distinctes : mot de passe et code temporaire (email ou TOTP)." },
    { term: "TOTP", definition: "Time-based One-Time Password. Algorithme générant des codes temporaires à usage unique, synchronisés par horodatage (RFC 6238). Compatible Google Authenticator." },
    { term: "SOC", definition: "Security Operations Center. Service de surveillance continue des systèmes d'information pour détecter et répondre aux incidents de sécurité." },
    { term: "EDR", definition: "Endpoint Detection and Response. Solution de sécurité assurant la détection, l'investigation et la remédiation des menaces sur les terminaux." },
    { term: "XDR", definition: "Extended Detection and Response. Évolution de l'EDR étendant la détection et la réponse à l'ensemble de l'infrastructure (réseau, cloud, messagerie)." },
    { term: "Gateway / BFF", definition: "Backend For Frontend. Pattern architectural où un point d'entrée unique fait office de proxy intelligent entre les clients et les services internes." },
    { term: "ORM", definition: "Object-Relational Mapping. Technique de programmation établissant une correspondance entre les objets du code et les tables de la base de données." },
    { term: "CSP", definition: "Content Security Policy. Mécanisme de sécurité HTTP permettant de restreindre les sources de contenu autorisées dans une page web." },
    { term: "PCI-DSS", definition: "Payment Card Industry Data Security Standard. Norme de sécurité régissant le traitement des données de cartes bancaires." },
    { term: "RBAC", definition: "Role-Based Access Control. Modèle de contrôle d'accès où les permissions sont attribuées en fonction du rôle de l'utilisateur." },
    { term: "ACID", definition: "Atomicité, Cohérence, Isolation, Durabilité. Propriétés garantissant la fiabilité des transactions en base de données." },
    { term: "LIKE", definition: "Opérateur SQL permettant de rechercher des correspondances partielles dans une chaîne à l'aide de motifs (%, _)." },
    { term: "Cron", definition: "Command Run On. Planificateur de tâches permettant d'exécuter automatiquement des commandes ou scripts à des intervalles définis." },
    { term: "Schéma Zod", definition: "Schéma de validation et de typage permettant de définir la structure et les contraintes de données en JavaScript et TypeScript." },
];
