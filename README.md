## Installing backend

1. Clone this project
2. Run:
```
cd backend
npm install
```
3. Rename `.env.template` file to `.env` in backend folder

## Running the database
1. Install Docker Desktop on your computer (https://docs.docker.com/desktop/)
2. On project root level run:

```
docker compose up --build --renew-anon-volumes -d
```

## To test DB connection
```
cd backend
npx tsx script.ts
```
If authentication fails, make sure a local installation of PostgreSQL isn't running on the port 5432.