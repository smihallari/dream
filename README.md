Start with $ docker-compose up --build

// if Dockerfile: "CMD ["node", "src/seed.js", "&&", "node", "src/app.js"]" 
// cause issue, add: "command: bash -c "node src/seed.js && node src/app.js"" to compose yaml

docker-compose down
docker-compose build
docker-compose up --build
docker-compose down --volumes
docker-compose build --no-cache
docker-compose up --build

docker build -t dream-app .
docker tag dream-app dream-app:v1.0

docker build -t dream-app .
docker run (-d to run in the background) -p 3000:3000 --name dream-container dream-app
