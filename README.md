# CYNA — Documentation technique interactive

Site de documentation interactive pour le projet CYNA (plateforme e-commerce de cybersécurité). Porte le **DAT** (Dossier d'Architecture Technique) et le **DCT** (Dossier de Conception Technique) sous forme d'un site Next.js statique, riche en visualisations (diagrammes Mermaid, matrices de risques, explorateur d'endpoints, timelines animées…).

## Stack

- **Next.js 15** (App Router, static export)
- **React 19** + TypeScript strict
- **Tailwind CSS 4** (CSS-first `@theme`)
- **next-intl** — bilingue FR/EN
- **Framer Motion** — animations
- **Mermaid** — diagrammes rendus côté client
- **Radix UI** + **cmdk** — dialogs, tabs, search palette
- **GitHub Pages** — déploiement statique

## Démarrer en local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build de production

```bash
npm run build        # génère out/
npm run preview      # sert out/ en local via npx serve
```

## Déploiement

Le workflow `.github/workflows/deploy.yml` construit le site avec `NEXT_PUBLIC_BASE_PATH=/DAT` et le publie automatiquement sur GitHub Pages à chaque push sur `main`.

Activer GitHub Pages :
1. Settings → Pages → Source : **GitHub Actions**
2. Premier push sur `main` → le site apparaît sur `https://<owner>.github.io/DAT/`

## Structure

- `src/app/[locale]/` — pages (landing + `(docs)` route group)
- `src/components/` — composants interactifs réutilisables
- `src/data/` — données typées (endpoints, risques, ADR, glossaire)
- `src/i18n/` — configuration next-intl
- `messages/` — traductions FR / EN

## Contenu

16 pages couvrant l'intégralité du DAT/DCT :
- Landing (hero animé, stats, highlights)
- Introduction, Besoins, Parcours utilisateurs
- Solution, Architecture, Sécurité
- Conception (hub) + 9 fiches détaillées
- API (explorateur), Données, Tests, Infrastructure, RGPD, ADR, Équipe

## Raccourcis

- <kbd>Ctrl/⌘</kbd> + <kbd>K</kbd> — palette de recherche
- <kbd>T</kbd> — toggle thème clair/sombre (via bouton header)
- <kbd>P</kbd> — impression (via bouton header)

## Licence

Documentation projet étudiant — tous droits réservés.
