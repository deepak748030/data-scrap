#!/bin/bash

# Update system packages and install dependencies
apt-get update && apt-get install -y wget unzip xvfb

# Install Chromium
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt-get install -y ./google-chrome-stable_current_amd64.deb

# Verify Chromium installation
google-chrome --version

# Set CHROME_PATH environment variable
export CHROME_PATH="/usr/bin/google-chrome"
echo "CHROME_PATH=$CHROME_PATH" >> /etc/environment
