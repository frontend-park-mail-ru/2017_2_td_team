#!/bin/sh

PORT=228
DIST_PATH=./www
DEPLOY_PATH=/var/www/td
SERVER_IP=$1
echo "Deploying to $SERVER_IP"

echo "Setting up ssh..."
eval "$(ssh-agent -s)"
ssh-keyscan -p $PORT -H $SERVER_IP >> ~/.ssh/known_hosts
chmod 600 $HOME/.ssh/server
ssh-add $HOME/.ssh/server

echo "Cleaning up..."
ssh -p $PORT td@$SERVER_IP "rm -rf $DEPLOY_PATH/*"

echo "Uploading..."
scp -P $PORT -r $DIST_PATH/* td@$SERVER_IP:$DEPLOY_PATH

echo "Restarting..."
ssh -p $PORT td@$SERVER_IP "supervisorctl restart td"
