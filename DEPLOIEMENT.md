# Déploiement — L'BURN (squad ABJRQQ)

Ce dépôt suit le gabarit du serveur : deux services, construits et démarrés séparément.

## Construire et démarrer

```bash
docker build -t team23-api:dev api/
docker build -t team23-frontend:dev frontend/
docker run -d -p 8081:8081 team23-api:dev
docker run -d -p 8080:80 team23-frontend:dev
```

Ou, si un `docker-compose.yml`/`podman-compose.yml` est fourni par la recette du serveur, `docker compose up --build`.

## Services

| Service | Port conteneur | Port publié | Rôle |
|---|---|---|---|
| `api/` | 8081 | 8081 | API, routes `/api/v1/...`, `/health`, `/sante` |
| `frontend/` | 80 | 8080 | Next.js en export statique, servi par nginx, `/health` et `/sante` en fichiers statiques |

## Configuration

Toutes les variables lues par l'application sont dans [`.env.example`](./.env.example). Aucun secret n'est lu dans un fichier : la clé de contexte PM Lab (`CLE`) reste dans l'environnement du shell qui démarre la plateforme, jamais dans un fichier du dépôt.

## Vérifier que l'application est en ligne

```bash
curl -s http://localhost:8080/health
curl -s http://localhost:8080/sante
curl -s http://localhost:8081/health
curl -s http://localhost:8081/sante
```

Chacune des quatre réponses doit être `200`.

## Déploiement réel sur cette machine

La recette de déploiement effective (plateforme, ports, réseau) est celle du `/CLAUDE.md` à la racine du serveur, pas celle de ce fichier : voir [docs/guidelines-deploiement.md](./docs/guidelines-deploiement.md).
