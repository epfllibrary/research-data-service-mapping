# RDSN Map — Guide de maintenance

Carte interactive des services de données de recherche du campus EPFL.

---

## Lancer en local

```bash
cd rdsn-map
python3 -m http.server 8080
```

Ouvrir ensuite http://localhost:8080 dans un navigateur.

> ⚠️ Ne pas ouvrir `index.html` directement (double-clic) — la carte ne fonctionnera pas. Un serveur HTTP est requis pour charger le fichier `services.csv`.

---

## Modifier les services

Ouvrir **`services.csv`** dans Excel ou Numbers. Chaque ligne est un service.

### Colonnes disponibles

| Colonne     | Description                        | Exemple                        |
|-------------|------------------------------------|--------------------------------|
| `Service`   | Nom du service (affiché partout)   | `Infoscience`                  |
| `Unit`      | Unité ou équipe responsable        | `Library`                      |
| `Contact`   | Adresse e-mail de contact          | `infoscience@epfl.ch`          |
| `Audience`  | Public cible                       | `Researchers` / `Students` / `EPFL collaborators` |
| `Phase`     | Phase(s) du cycle de vie           | `Publication & Sharing`        |
| `URL`       | Lien vers le service               | `https://infoscience.epfl.ch`  |
| `Latitude`  | Coordonnée GPS (décimal)           | `46.51866`                     |
| `Longitude` | Coordonnée GPS (décimal)           | `6.56923`                      |
| `Office`    | Numéro de bureau EPFL              | `RLC D1 220`                   |

### Valeurs acceptées pour `Phase`

Un service peut appartenir à **une ou plusieurs** phases. Si plusieurs, les séparer par une virgule :

```
Data Collection, Processing & Analysis
```

Valeurs possibles :
- `Planning & Design`
- `Data Collection`
- `Processing & Analysis`
- `Use & Store`
- `Publication & Sharing`
- `Archiving`
- `Discover & Reuse`
- `All` *(apparaît dans toutes les phases)*

### Ajouter un service sans localisation

Laisser `Latitude`, `Longitude` et `Office` vides. Le service apparaîtra dans la liste et les vues Cycle de vie / Par unité, mais pas sur la carte.

### Trouver les coordonnées GPS d'un bâtiment

1. Ouvrir [plan.epfl.ch](https://plan.epfl.ch)
2. Chercher le bâtiment
3. Le numéro de salle (ex: `RLC D1 220`) peut être utilisé directement dans la colonne `Office`

---

## Structure des fichiers

```
rdsn-map/
├── index.html      ← Structure de la page, imports
├── style.css       ← Styles (charte EPFL)
├── map.js          ← Carte Leaflet, marqueurs, clusters
├── ui.js           ← Sidebar, filtres, recherche, kanban, vues, i18n runtime
├── i18n.js         ← Dictionnaires FR/EN et API de traduction
├── services.csv    ← ⬅ Données — éditer ici
└── README.md       ← Ce fichier
```

---

## Fonctionnalités

- **Vue Carte** — marqueurs sur le campus, clusters par bâtiment, popup au survol, indicateurs hors-écran (8 directions)
- **Vue Cycle de vie** — colonnes kanban par phase RDLC, titres traduits selon la langue active
- **Vue Par unité** — services regroupés par unité responsable
- **Filtres par phase** — barre de navigation avec compteurs dynamiques
- **Recherche** — par nom de service, unité, bureau ou contact, synchronisée entre header et panneau mobile
- **Fiche détaillée** — s'ouvre au clic sur un service, avec tags de phase traduits
- **Lien direct** — chaque service a une URL partageable (`?service=NomDuService`)
- **Langue** — bascule FR / EN dans le header ; le paramètre `?lang=en` est restauré depuis l'URL partagée
- **Plan EPFL** — le bureau est cliquable et ouvre plan.epfl.ch
- **Plein écran** — bouton dédié sur la carte

---

## Internationalisation (i18n)

Toutes les chaînes de l'interface sont gérées dans **`i18n.js`**. Pour ajouter ou modifier une traduction :

1. Ouvrir `i18n.js`
2. Localiser la clé dans le dictionnaire `fr` ou `en`
3. Modifier la valeur correspondante

Les clés utilisées dans le HTML portent l'attribut `data-i18n="nom.de.la.cle"`. Les placeholders et les `aria-label` utilisent respectivement `data-i18n-placeholder` et `data-i18n-aria`.

> ⚠️ Toute clé ajoutée dans `en` doit aussi être ajoutée dans `fr`, et vice-versa — sinon la clé brute s'affiche à la place du texte.

---

## Déploiement

Le projet est un site statique : aucun serveur applicatif requis. Il suffit de copier les **6 fichiers** sur n'importe quel hébergement web (serveur EPFL, GitHub Pages, etc.).

Pour toute question : **researchdata@epfl.ch**
