# Aegis

## Description

It will provide APIs for the frontend to do following things:

- Create and manage wallet accounts.
- Record all balance changes to each of the wallet accounts. So every time some money is added to or subtracted from the account, an account entry record will be created.

## Getting Started

To start working with this repository first `fork this repository` and clone `forked project` to your machine. Before any execution make sure to `add this remote repository`

```
$ git remote add [name for this remote i.e ariefro] git@github.com:ariefro/aegis-server.git
```

Check remote list for this repository and make sure there are at least 2 of it, 1 is origin (yours) and 1 is parent (i.e ariefro)

```
$ git remote -v
```

```
origin    git@github.com:[yours]/aegis-server.git
ariefro  git@github.com:ariefro/aegis-server.git
```

Now you can start to install the dependencies, this project is pinned with [Volta](https://volta.sh/) and using [pnpm](https://pnpm.io/) as package manager, if you are trying to install node manually please refer to `package.json` to see what's the engine version this project

```
$ pnpm install
```

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [make](https://linuxhint.com/install-make-ubuntu/)

### Environment Parameter

| Key            | Desc                        |
| -------------- | --------------------------- |
| APP_PORT       | Application Port            |
| DB_CONNECTION  | Type of Database Connection |
| DB_USERNAME    | Postgres Username           |
| DB_PASSWORD    | Postgres Password           |
| DB_DATABASE    | Postgres Database Name      |
| DB_PORT        | Postgres Port               |
| CONTAINER_PORT | Docker Port                 |
| CONTAINER_NAME | Docker Container Name       |
| DOCKER_IMAGE   | Docker Image Postgres       |

### Run the development server:

- Run server

```
make dev
```

- Created db

```
make createdb
```

- Drop database:

```
make dropdb
```

- Run db migration up all versions:

```
make migrateup
```

- Run db migration down all versions:

```
make migratedown
```

## Documentation

### API Documentation

- Access the API documentation at [this address](https://documenter.getpostman.com/view/16991559/2s8YekREej).

### DB Documentation

- Install dbdocs

  ```
  pnpm install -g dbdocs
  ```

- Generate DB documentation:

  ```
  make dbdocs
  ```

- Access the DB documentation at [this address](https://dbdocs.io/ariefromadhon/aegis). Password: `secret`.

## Development Flow

Make sure to `fetch` the repository whenever you are starting to work to know the update for each remote repositories. And for any `new feature / bug fix` make sure to create branch from `develop` branch as it is for staging, `main` branch only used for production and `hot fix`

### New Feature and Bug Fix

Create branch from `develop` branch and name it as the feature suppose to be for example:

```bash
feature/login-page
# or
feature/add-account
# or
bugfix/login-page
```

### Commit

To create the best comit is to separate between work you've been done and use identifier below as your commit prefix

```
Add
Remove
Change
Fix
```

### Push changes

PUSHING CHANGES TO YOUR REMOTE ONLY, NOT PARENT OR OTHER REPOSITORIES

### Pull Request

After pushing your work, if it is `new feature / bug fix` create pull request to parent repo and target marge to `develop` branch

```
pull request
from feature/some-feature -> parent develop
```

if it is `hot fix` create pull request to parent repo and target merge to `main` branch

```
pull request
from hotfix/some-hotfix -> parent main
```

### PR Review & Merge

Make sure to ask review to all other members and the last member to approve the pull request have to merge it.
