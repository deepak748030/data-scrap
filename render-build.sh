#!/bin/bash

# Install necessary dependencies
echo "Installing dependencies..."
apt-get update && apt-get install -y wget unzip xvfb curl

# Download Chromium
echo "Downloading Chromium..."
wget https://github.com/zenika/alpine-chrome/releases/download/v1.0.0/chrome-headless-shell-111.0.5563.64.tar.gz -O chromium.tar.gz

# Extract the Chromium tar file
echo "Extracting Chromium package..."
tar -xvzf chromium.tar.gz -C $HOME/chromium

# Set CHROME_PATH to the extracted Chromium binary
export CHROME_PATH="$HOME/chromium/chrome-linux/chrome"
echo "CHROME_PATH=$CHROME_PATH" >> ~/.bashrc
source ~/.bashrc

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "Setup complete! Chromium is ready to run."
