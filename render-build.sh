#!/bin/bash

# Create a directory for Chrome installation
mkdir -p chrome-install

# Download the Chrome .deb package
wget -O chrome-install/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

# Extract the .deb package manually
dpkg-deb -xv chrome-install/google-chrome.deb chrome-install

# Set CHROME_PATH to the extracted binary
export CHROME_PATH="$(pwd)/chrome-install/opt/google/chrome/google-chrome"
echo "CHROME_PATH=$CHROME_PATH"

# Verify Chrome installation
$CHROME_PATH --version
