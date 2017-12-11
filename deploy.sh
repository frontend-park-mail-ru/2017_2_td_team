#!/bin/sh

SERVER_IP=$1
echo "Deploying to $SERVER_IP"

eval "$(ssh-agent -s)"
ssh-keyscan -p228 -H $SERVER_IP >> ~/.ssh/known_hosts
chmod 600 $HOME/.ssh/server
ssh-add $HOME/.ssh/server

ssh -p228 td@$SERVER_IP rm -rf /var/www/td/*
scp -P228 -r ./dist/www td@$SERVER_IP:/var/www/td
