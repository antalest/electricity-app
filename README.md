# Electricity app

## Quick start
1. Clone this project

### Running the database
1. Install Docker Desktop on your computer (https://docs.docker.com/desktop/)
2. In root folder run:
```
docker compose up --build --renew-anon-volumes -d
```
### Installing and running the backend
1. Copy `.env.template` file to a new file `.env` in the backend folder
2. Run:
```
cd backend
npm install
npx prisma generate
npm run build
npm run start
```
In the browser open: http://localhost:3000/api/dailystatistics

### Installing and running the frontend
1. Run:
```
cd frontend
npm install
npm run build
npm run preview
```

## Misc
### To test DB connection
```
cd backend
npx tsx script.ts
```
If authentication fails, make sure a local installation of PostgreSQL isn't running on the port 5432.
