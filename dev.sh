docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d 
cd client
yarn
yarn start