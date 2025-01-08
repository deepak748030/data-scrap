# Use Node.js v20.17.0 as the base image
FROM node:20.17.0

# Install necessary system dependencies for Chrome and Xvfb
RUN apt-get update && apt-get install -y \
    chromium \
    xvfb \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxi6 \
    libxtst6 \
    libnss3 \
    libxss1 \
    libxrandr2 \
    libasound2 \
    libatk1.0-0 \
    libgtk-3-0 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set up environment variables for Chromium
ENV CHROME_PATH=/usr/bin/chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
