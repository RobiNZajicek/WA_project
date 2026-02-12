# JecnaGames Backend

Symfony 8 API pro JecnaGames.

## Setup

```bash
# 1. Install dependencies
composer install

# 2. Generate JWT keys
php bin/console lexik:jwt:generate-keypair

# 3. Create database
php bin/console doctrine:database:create

# 4. Run migrations
php bin/console doctrine:migrations:migrate

# 5. Start server
symfony server:start
```

## API Endpoints

### Auth
- `POST /api/register` - registrace
- `POST /api/login` - přihlášení
- `GET /api/me` - info o uživateli (auth required)

### Leaderboard
- `GET /api/leaderboard?type=players` - top hráči
- `GET /api/leaderboard?type=classes` - top třídy

### Scores
- `POST /api/scores` - odeslat skóre
- `GET /api/scores` - moje skóre (auth required)
- `GET /api/daily` - dnešní stav her

## Environment

Uprav `.env.local`:
```
DATABASE_URL="mysql://user:pass@host:3306/jecnagames"
```
