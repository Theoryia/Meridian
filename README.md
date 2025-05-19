# Meridian

Dockerised, all in one Pre-Flight decision app.

## Cloning the Repo

```bash
git clone https://github.com/Theoryia/Meridian
cd Meridian

git submodule init
git submodule update --recursive --remote

pnpm install
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
git submodule update --recursive --remote

# Database / Dev Dependencies
docker-compose -f dev-docker-compose.yml up -d

# Meririan
pnpm run dev
```

## Running

```bash
git submodule update --recursive --remote
docker compose up -d
```

To create a production version of your app:

```bash
npm run build
```
