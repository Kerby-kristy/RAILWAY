# ISO27001 Cert — MVP SaaS de certification ISO/IEC 27001

MVP autonome (Next.js 14 + Prisma/SQLite) simulant un parcours complet de certification
ISO/IEC 27001 pour des **particuliers** et des **entreprises**. Ce dossier est indépendant
du reste du dépôt (Evolution API) — aucune dépendance croisée.

## Fonctionnalités

- Landing page de présentation du service
- Inscription / connexion (compte particulier ou entreprise)
- Auto-évaluation ISO/IEC 27001 (14 domaines de contrôle inspirés de l'Annexe A)
- Soumission de dossier avec pièces justificatives (métadonnées de fichiers)
- Back-office auditeur : revue des dossiers, approbation / rejet avec commentaire
- Génération automatique d'un certificat PDF (numéro unique, QR code, validité 3 ans)
- Page publique de vérification de certificat (`/verify/[numero]`)
- Révocation de certificat par un administrateur

## Démarrage rapide

```bash
cd iso27001-saas
cp .env.example .env
npm install
npm run db:push     # crée la base SQLite locale (dev.db) à partir du schema Prisma
npm run db:seed      # crée un compte admin et un compte de démonstration
npm run dev           # http://localhost:3000
```

Comptes de démonstration créés par le seed :

| Rôle   | Email                        | Mot de passe  |
|--------|-------------------------------|---------------|
| Admin  | admin@iso27001-cert.test      | Admin1234!    |
| Client | demo@iso27001-cert.test       | Demo1234!     |

## Parcours de test suggéré

1. Se connecter avec le compte `demo` (ou créer un nouveau compte).
2. Aller sur *Mon espace* → *Nouvelle demande*, remplir le formulaire et répondre à
   l'auto-évaluation, puis soumettre.
3. Se déconnecter, se connecter avec le compte `admin`.
4. Aller dans *Back-office* → ouvrir le dossier soumis → l'approuver (ou le rejeter).
5. En cas d'approbation, un certificat est généré : le télécharger en PDF depuis le
   dossier ou depuis *Certificats émis*.
6. Copier le numéro de certificat et le vérifier via `/verify` (sans être connecté).
7. Depuis le back-office, tester la révocation du certificat et re-vérifier sa page
   publique (le statut passe à « Révoqué »).

## Limites connues du MVP

- Les documents joints ne sont pas réellement stockés (seuls le nom et la taille sont
  enregistrés) — une intégration S3/MinIO serait nécessaire pour un stockage réel.
- Base SQLite locale à but de démonstration ; à remplacer par PostgreSQL/MySQL en
  production (Prisma facilite la migration).
- Pas de paiement intégré (à ajouter, ex. Stripe, avant une mise en production réelle).
- Ce service est un **simulateur** : il ne délivre pas de certification ISO/IEC 27001
  accréditée.
