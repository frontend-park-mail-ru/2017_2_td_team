#!/bin/sh

PORT=228
DIST_PATH=./dist/www
DEPLOY_PATH=/var/www/td
SERVER_IP=$1
echo "Deploying to $SERVER_IP"

echo "Setting up ssh..."
eval "$(ssh-agent -s)"
ssh-keyscan -p228 -H $SERVER_IP >> ~/.ssh/known_hosts
chmod 600 $HOME/.ssh/server
ssh-add $HOME/.ssh/server

echo "Build..."
npm run build

echo "Cleaning up..."
ssh -p228 td@$SERVER_IP "rm -rf /var/www/td/*"

echo "Uploading..."
scp -P228 -r ./www td@$SERVER_IP:/var/www/td
