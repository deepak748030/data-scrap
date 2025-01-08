#!/bin/bash

# Update system packages and install dependencies
echo "Updating system packages..."
apt-get update && apt-get install -y wget unzip xvfb

# Install Google Chrome (without sudo)
echo "Downloading and installing Google Chrome..."
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb || { echo "Google Chrome installation failed"; exit 1; }

# Verify Google Chrome installation
echo "Verifying Google Chrome installation..."
google-chrome --version || { echo "Google Chrome installation failed"; exit 1; }

# Set CHROME_PATH environment variable
echo "Setting CHROME_PATH environment variable..."
export CHROME_PATH="$HOME/google-chrome/google-chrome"
echo "CHROME_PATH=$CHROME_PATH" >> ~/.bashrc
source ~/.bashrc

# Install Xvfb for headless Chrome
echo "Installing Xvfb for headless Chrome..."
apt-get install -y xvfb

# Verify Xvfb installation
echo "Verifying Xvfb installation..."
xvfb-run --version || { echo "Xvfb installation failed"; exit 1; }

# Run npm install
echo "Installing Node.js dependencies..."
npm install || { echo "npm install failed"; exit 1; }

echo "Setup complete! You're ready to run your application."
