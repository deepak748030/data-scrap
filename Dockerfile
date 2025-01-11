# Use a base image with Node.js and Chromium
FROM node:18-bullseye

# Install system dependencies for Chromium and Puppeteer
RUN apt-get update && apt-get install -y \
    xvfb \
    chromium \
    fonts-freefont-ttf \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libnss3 \
    libcups2 \
    libxss1 \
    libxrandr2 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libpangocairo-1.0-0 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

# Set up Puppeteer
RUN npm install -g puppeteer

# Create a non-root user
RUN useradd -m appuser
USER appuser
WORKDIR /home/appuser

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set up and run your script using npm start
CMD ["npm", "start"]
