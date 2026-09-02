# Local Coding Agent MCP

Serveur MCP pour Perplexity - agent de codage local avec acces fichiers, shell et git.

## Deploiement en 1 clic

### Option 1 : Railway (recommande)

1. Fork ce repo ou clique sur Deploy to Railway
2. Connecte ton compte Railway : https://railway.app
3. Deploie:
   npm i -g @railway/cli
   railway login
   railway init
   railway up
4. Copie lURL HTTPS fournie par Railway

### Option 2 : Autre serveur

npm install
npm run build
npm start

Puis expose avec ngrok/cloudflare:
ngrok http 3000

## Ajouter dans Perplexity

1. Va dans Settings -> Connectors
2. Clique sur + Custom connector -> Remote
3. Remplis:
   - Name : Local Coding Agent
   - MCP Server URL : https://ton-url-railway.app
   - Transport : Streamable HTTP
   - Authentification : None
4. Sauvegarde et active

## Outils disponibles

### Fichiers
- read_file(path) - Lire un fichier
- write_file(path, content) - Ecrire un fichier
- list_files(path) - Lister un dossier
- delete_file(path) - Supprimer un fichier

### Shell
- run_command(command) - Executer commande (npm, git, etc.)

### Git
- git_status() - Voir statut
- git_commit(message, all) - Commit
- git_push() - Push

## Variables denvironnement

| Variable | Valeur par defaut | Description |
|----------|-------------------|-------------|
| WORKSPACE_PATH | /app/workspace | Dossier de travail |

## Exemple dusage dans Perplexity

Lis le fichier src/index.ts
Modifie la fonction main pour ajouter un log
Commit avec le message feat: add log
Push vers GitHub

## Securite

- Tous les chemins sont sandboxes dans WORKSPACE_PATH
- Impossible de sortir du workspace
- Commandes shell executees dans le workspace uniquement

---

Repo : https://github.com/spiderpaj1209-web/local-coding-agent-mcp
