#!/bin/bash

# Update system packages and install dependencies
echo "Updating system packages..."
sudo apt-get update && sudo apt-get install -y wget unzip xvfb sudo

# Install Google Chrome
echo "Downloading and installing Google Chrome..."
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt-get install -y ./google-chrome-stable_current_amd64.deb

# Verify Google Chrome installation
echo "Verifying Google Chrome installation..."
google-chrome --version || { echo "Google Chrome installation failed"; exit 1; }

# Set CHROME_PATH environment variable
echo "Setting CHROME_PATH environment variable..."
export CHROME_PATH="/usr/bin/google-chrome"
echo "CHROME_PATH=$CHROME_PATH" | sudo tee -a /etc/environment
source /etc/environment

# Install Xvfb for headless Chrome
echo "Installing Xvfb for headless Chrome..."
sudo apt-get install -y xvfb

# Verify Xvfb installation
echo "Verifying Xvfb installation..."
xvfb-run --version || { echo "Xvfb installation failed"; exit 1; }

# Run npm install
echo "Installing Node.js dependencies..."
npm install || { echo "npm install failed"; exit 1; }

echo "Setup complete! You're ready to run your application."
