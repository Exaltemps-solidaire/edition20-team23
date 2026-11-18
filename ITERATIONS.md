# Plan d'itérations — L'BURN (squad ABJRQQ)

**Plan validé le 2026-11-18 par le développeur** (go donné pour `/iteration 1` ; validation cadreurs non confirmée séparément — ⚠️ à faire confirmer au premier tour de test).

- **Source du plan** : proposé par l'agent. La passation contient un ordre de livraison par fonctionnalité (`cadrage/6-plan-de-livraison.md`) mais pas de plan d'itérations chiffré (pas de fichier `*iteration*`, pas de clé `iterations` dans `passation.json`) — son ordre (timeline → historique → suggestions → notifications) est repris tel quel comme ordre de priorité.
- **Temps restant annoncé** : 120 minutes (réponse du développeur, 2026-11-18).
- **Durée d'un tour de test** : 10 minutes (valeur par défaut, développeur sans réponse précise).
- **Capacité estimée** : une itération dure au plus 10 min de codage + ~5 min de publication + 10 min de tour de test = ~25 min. Sur 120 min : ~4 itérations complètes tiennent confortablement, une 5ᵉ (stabilisation) si le codage reste court. ⚠️ Estimation à revérifier à chaque itération, le temps restant peut bouger.
- **Hors périmètre du hackathon** (posé par la passation, pas par l'agent) : connexion/comptes/mot de passe (sélection de persona simulée uniquement), paiement et adhésion, back-office équipe, parcours ACTIV' et Sentinelle, modules 5 et 6 de BIB, contenu médical ou juridique, contenu des ateliers (vidéos/supports), validation d'activité par antenne.

---

## Itération 1 : Le tableau de bord démarre et montre la timeline (données en dur)

- **Dans le périmètre** :
  - Contrat de déployabilité : `.env.example` et `DEPLOIEMENT.md` (le reste — `Dockerfile`, `/health`, `/sante` sur `api/` et `frontend/` — est déjà posé par le gabarit).
  - Écran unique « Tableau de bord » : un sélecteur de persona en haut (liste des personae du scénario, pas d'authentification) et, en dessous, la timeline verticale (réalisé, module en cours avec ses thématiques et le bouton « Reprendre ce module », module suivant en opacité réduite), à partir de données en dur.
- **Hors périmètre** : historique, suggestions, notifications ; toute donnée venant d'une vraie API métier (l'API ne sert que `/health` et `/sante` à ce stade).
- **Critères d'acceptation** :
  - Étant donné l'application déployée, quand on ouvre l'URL publique, alors l'écran « Tableau de bord » s'affiche avec un sélecteur de persona et une persona sélectionnée par défaut.
  - Étant donné une persona sélectionnée, quand la page est chargée, alors la timeline montre le réalisé, le module en cours (bouton « Reprendre ce module ») et le module suivant en opacité réduite.
  - Étant donné l'application déployée, quand on appelle `GET /health` et `GET /sante` sur le front et sur l'API, alors les quatre réponses sont `200`.
- **Hypothèse de l'équipe couverte** : aucune mesurée à ce stade — les données sont en dur, la mesure réelle (« 1 clic pour retrouver son avancement ») suppose un état qui évolue, posé à partir de l'itération où l'API sert ces données.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `.env.example`, `DEPLOIEMENT.md`, `frontend/src/app/page.tsx` (remplace le placeholder Next.js), `frontend/src/components/Timeline.tsx` (nouveau), `frontend/src/data/personae.ts` (données en dur, nouveau).
- **Tests unitaires prévus** : 1 à 3, sur la fonction pure qui dérive l'état de chaque module (réalisé / en cours / suivant) à partir des données en dur et de la persona choisie.
- **Étapes ajoutées à la démo** : ouvrir l'URL publique, vérifier l'affichage du sélecteur de persona et de la timeline.
- **Bilan** :
  - Codage réel : ~5 minutes, sous le budget de 10 minutes annoncé. Pas d'alarme à 8 minutes déclenchée.
  - Les 3 critères d'acceptation sont satisfaits : sélecteur de persona avec persona par défaut, timeline (réalisé / en cours avec bouton / suivant en opacité réduite), `/health` et `/sante` en `200` sur les deux services.
  - Fichiers modifiés/créés : `frontend/src/data/personae.ts` (données + fonctions pures, nouveau), `frontend/src/data/personae.test.ts` (4 tests, nouveau), `frontend/src/components/Timeline.tsx` + `.module.css` (nouveau), `frontend/src/app/page.tsx` (remplace le placeholder), `frontend/src/app/page.module.css`, `frontend/src/app/layout.tsx` et `globals.css` (polices et couleurs de marque), `.env.example`, `DEPLOIEMENT.md`, `podman-compose.yml` (nouveau, spécifique à cette machine), `frontend/nginx.conf` (en-têtes de sécurité de base ajoutés), `api/Dockerfile` et `frontend/Dockerfile` (images de base qualifiées en `docker.io/library/...`, sinon échec de résolution de nom court sous Podman non interactif).
  - Déployé et vérifié localement : `localhost:8080/`, `/health`, `/sante` et `localhost:8081/health`, `/sante` répondent tous `200`. Version 1 signalée à PM Lab avec succès.
  - Reporté / hors périmètre volontaire : base `team23`, bucket S3 et secrets OpenBao non provisionnés — l'application ne lit encore aucune variable `DB_*`/`VAULT_ADDR`/`S3_*`, ce sera fait à l'itération qui en a réellement besoin. La `Content-Security-Policy` du gabarit plateforme n'a pas été reprise (elle référence `localhost:8501`/`:9000`, injoignables depuis le navigateur du visiteur, et ne déclare pas de `script-src` adapté à l'export Next.js) — à vérifier/adapter avant de l'ajouter, pas bloquant pour cette itération.
  - Rien bloqué par le harnais.

## Itération 2 : Historique doux sous la timeline

- **Dans le périmètre** : sous la timeline, un bloc historique — dernière date de connexion, parcours terminés, parcours en cours — avec une formulation sans culpabilisation, à partir des mêmes données en dur. Modifie l'écran existant « Tableau de bord », n'en crée pas un nouveau.
- **Hors périmètre** : suggestions, notifications, vraie donnée API.
- **Critères d'acceptation** :
  - Étant donné le tableau de bord affiché, quand on regarde sous la timeline, alors l'historique montre la dernière connexion, les parcours terminés et le parcours en cours.
  - Étant donné les libellés de l'historique, quand on les relit, alors aucun ne formule de pression ou d'échec (pas de « en retard », « pas terminé depuis »).
  - Étant donné une autre persona sélectionnée, quand on la choisit, alors l'historique affiché change avec elle.
- **Hypothèse de l'équipe couverte** : aucune des 4 hypothèses formelles ne porte sur l'historique — répond à l'enjeu « avancer à son rythme, sans injonction » cité dans le PRD, sans mesure chiffrée associée.
- **Codage estimé** : 5 minutes.
- **Fichiers prévus** : `frontend/src/components/Historique.tsx` (nouveau), `frontend/src/data/personae.ts` (étoffé), `frontend/src/app/page.tsx` (intégration).
- **Tests unitaires prévus** : 1 à 2, sur la fonction qui dérive les trois champs de l'historique depuis les données personae.
- **Étapes ajoutées à la démo** : vérifier la présence de l'historique sous la timeline.
- **Bilan** :
  - Codage réel : <1 minute, largement sous le budget. Pas d'alarme déclenchée.
  - Les 3 critères d'acceptation sont satisfaits : bloc historique (dernière connexion, parcours terminés, parcours en cours) sous la timeline, libellés sans formulation de pression, change avec la persona sélectionnée (fonction pure dérivée des données).
  - Fichiers modifiés/créés : `frontend/src/data/personae.ts` (fonction pure `historiquePersona`, ajoutée), `frontend/src/data/personae.test.ts` (2 tests ajoutés, 8 au total), `frontend/src/components/Historique.tsx` + `.module.css` (nouveau), `frontend/src/app/page.tsx` (intégration).
  - Déployé (frontend seul rebuild, l'API n'a pas changé) et vérifié : `localhost:8080/` répond `200` et affiche le bloc historique ; `/health` et `/sante` toujours `200` sur les deux services. Version 2 signalée à PM Lab avec succès.
  - Reporté : rien. Note : la dernière connexion apparaît aussi dans le bloc « Bienvenue » (itération 1) — redondance mineure, pas retirée pour rester dans le périmètre de cette itération.
  - Rien bloqué par le harnais.

## Itération 3 : Suggestions en bas de la timeline

- **Dans le périmètre** : un bloc suggestions de modules/ateliers en bas de l'écran, choisi selon le parcours et le profil de la persona (règle simple, dérivée des données en dur). Modifie encore le même écran « Tableau de bord ».
- **Hors périmètre** : notifications, vraie donnée API, personnalisation fine au-delà de la règle simple.
- **Critères d'acceptation** :
  - Étant donné une persona sélectionnée, quand le tableau de bord se charge, alors au moins une suggestion pertinente s'affiche en bas de la timeline.
  - Étant donné une persona sans suggestion pertinente (cas limite), quand le tableau de bord se charge, alors un message neutre s'affiche, sans zone vide ni erreur.
  - Étant donné le tour de test de l'équipe, quand une testeuse lit la suggestion, alors elle l'identifie comme pertinente sans aide extérieure.
- **Hypothèse de l'équipe couverte** : « les suggestions aident la BURN'ette à choisir sa prochaine étape sans se sentir pressée » — mesure : suggestion identifiée sans aide (cible 100 %), testée au tour de test.
- **Codage estimé** : 7 minutes.
- **Fichiers prévus** : `frontend/src/components/Suggestions.tsx` (nouveau), `frontend/src/lib/suggestions.ts` (règle de sélection, pure et testable, nouveau), `frontend/src/data/personae.ts`, `frontend/src/app/page.tsx`.
- **Tests unitaires prévus** : 2 à 3, sur `frontend/src/lib/suggestions.ts` (règle de sélection, cas limite sans suggestion).
- **Étapes ajoutées à la démo** : vérifier la zone suggestions.
- **Bilan** :
  - Codage réel : <1 minute, largement sous le budget. Pas d'alarme déclenchée.
  - Les 3 critères d'acceptation sont satisfaits : au moins une suggestion pertinente par persona (module en cours → atelier suivant, sinon module suivant → thématique d'entrée), message neutre sans zone vide quand aucune suggestion ne s'applique (cas limite couvert par un test), suggestion lisible en langage clair sans jargon.
  - Fichiers modifiés/créés : `frontend/src/lib/suggestions.ts` (règle de sélection pure, nouveau), `frontend/src/lib/suggestions.test.ts` (3 tests, nouveau), `frontend/src/components/Suggestions.tsx` + `.module.css` (nouveau), `frontend/src/app/page.tsx` (intégration).
  - Déployé (frontend seul rebuild) et vérifié : `localhost:8080/` répond `200` et affiche le bloc « Pour toi » avec la suggestion attendue pour Sofia ; `/health`/`/sante` toujours `200` sur les deux services. Version 3 signalée à PM Lab avec succès.
  - Reporté : rien. Pas de personnalisation plus fine que la règle simple (hors périmètre explicite de l'itération).
  - Rien bloqué par le harnais.

## À venir

1. Panneau de notifications consenties (cloche en haut, activation/désactivation, envoi simulé sans action manuelle d'équipe) — couvre les deux hypothèses restantes (fil non perdu entre deux connexions ; 0 action manuelle d'équipe).
2. Stabilisation finale pour le pitch (si le temps restant ne permet plus qu'une itération).
