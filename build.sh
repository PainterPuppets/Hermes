cd client
yarn
yarn production
cd ..
docker-compose build
rm -rf client/tmp
cp -rf client/dist/ client/tmp/
docker-compose up -d --force-recreate