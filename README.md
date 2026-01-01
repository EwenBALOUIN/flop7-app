# Flip 7 - Gestionnaire de Parties

Application mobile React Native avec Expo pour gérer les parties du jeu de société Flip 7 en mode hors ligne.

## 🎯 Fonctionnalités

- ✅ Création de parties avec un nombre illimité de joueurs
- ✅ Suivi des scores par tour avec interface intuitive
- ✅ Calcul automatique des totaux
- ✅ Tri automatique des joueurs par score
- ✅ Historique des tours avec possibilité de modification
- ✅ Suppression de parties avec confirmation
- ✅ Mode clair/sombre automatique
- ✅ Persistance locale avec AsyncStorage (fonctionne hors ligne)
- ✅ Animations légères pour les mises à jour de scores

## 🚀 Installation

```bash
npm install
```

## 📱 Démarrage

```bash
# Démarrer l'application
npm start

# Lancer sur iOS
npm run ios

# Lancer sur Android
npm run android
```

## 🏗️ Architecture

```
flop7-app/
├── app/
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Écran d'accueil avec liste des parties
│   │   ├── NewGameScreen.tsx    # Création d'une nouvelle partie
│   │   └── GameScreen.tsx       # Suivi des scores d'une partie
│   └── _layout.tsx              # Configuration de la navigation
├── components/
│   ├── ui/                      # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Text.tsx
│   └── game/                    # Composants spécifiques au jeu
│       ├── GameCard.tsx
│       ├── PlayerRow.tsx
│       ├── ScoreInput.tsx
│       └── TotalRow.tsx
├── store/
│   └── gameStore.ts             # Store Zustand pour la gestion des données
├── types/
│   └── index.ts                 # Types TypeScript
├── utils/
│   └── calculations.ts          # Fonctions utilitaires pour les calculs
└── theme/
    ├── colors.ts                # Couleurs du thème
    └── useTheme.ts              # Hook pour utiliser le thème
```

## 🛠️ Technologies

- **Expo** ~54.0.30
- **React Native** 0.81.5
- **TypeScript** ~5.9.2
- **Zustand** - Gestion d'état
- **AsyncStorage** - Persistance locale
- **Expo Router** - Navigation

## 📝 Utilisation

1. **Créer une partie** : Appuyez sur "Nouvelle partie" depuis l'écran d'accueil
2. **Ajouter des joueurs** : Saisissez les noms des joueurs (nombre illimité)
3. **Enregistrer les scores** : Pour chaque tour, entrez les scores de chaque joueur
4. **Consulter l'historique** : Les tours précédents sont accessibles en haut de l'écran de jeu
5. **Modifier un tour** : Cliquez sur un tour dans l'historique pour le modifier
6. **Supprimer un tour** : Appuyez longuement sur un tour dans l'historique

## 🎨 Design

L'application utilise un système de thème personnalisé qui s'adapte automatiquement au mode clair/sombre du système. Les couleurs sont optimisées pour une bonne lisibilité et une expérience utilisateur agréable.

## 📦 Stockage

Toutes les données sont stockées localement sur l'appareil via AsyncStorage. Aucune connexion internet n'est requise pour utiliser l'application.

## 🔄 Mises à jour futures

- Export PDF de la feuille de score
- Capture d'écran de la partie
- Statistiques détaillées par joueur
- Mode multijoueur en ligne (optionnel)

