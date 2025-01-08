#!/bin/bash

# Install necessary dependencies
echo "Installing dependencies..."
apt-get update && apt-get install -y wget unzip xvfb curl

# Download Google Chrome package
echo "Downloading Google Chrome..."
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O google-chrome.deb

# Extract the .deb package to the user's local directory
echo "Extracting Google Chrome package..."
mkdir -p $HOME/google-chrome
dpkg-deb -x google-chrome.deb $HOME/google-chrome

# Verify the installation of Google Chrome by checking the extracted files
if [ -f "$HOME/google-chrome/usr/bin/google-chrome" ]; then
    echo "Google Chrome installed successfully."
else
    echo "Google Chrome installation failed."
    exit 1
fi

# Set CHROME_PATH to the location of the binary
export CHROME_PATH="$HOME/google-chrome/usr/bin/google-chrome"
echo "CHROME_PATH=$CHROME_PATH" >> ~/.bashrc
source ~/.bashrc

# Install npm dependencies
echo "Installing Node.js dependencies..."
npm install

echo "Setup complete! You're ready to run your application."
