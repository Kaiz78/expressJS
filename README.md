# expressJS
An application made in expressJS where I connect to my database with Prisma

# Fonctionnalities
- Authentification JWT


# Configuration

1. Install the dependencies
```bash
npm install
```

2. Copy .env.example to .env and fill the values
```bash
cp .env.example .env
```

3. Run the following command
```bash
prisma init
npx prisma generate
npm run start
```

# Lancement avec Docker

1. Change the configuration .env
```bash
cp .env.example .env
```

2. Build the image
```bash
docker-compose up --build
```

3. Test application

- http://localhost:4000
