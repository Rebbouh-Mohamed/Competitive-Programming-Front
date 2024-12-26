#!/bin/bash

# Exit script on any error
set -e

# Variables
NODE_VERSION="16" # Specify the Node.js version you want
PROJECT_DIR="$PWD" # Adjust if the script is run from outside the project directory

# Step 1: Check for Node.js and install if missing
echo "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js..."
    
    # Add NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo -E bash -
    
    # Install Node.js and npm
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed. Version: $(node -v)"
fi

# Step 2: Check for npm and ensure it's installed
echo "Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please ensure Node.js is installed correctly."
    exit 1
else
    echo "npm is installed. Version: $(npm -v)"
fi

# Step 3: Navigate to the project directory
echo "Navigating to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR"

# Step 4: Install project dependencies using npm
echo "Installing project dependencies..."
npm install

# Step 5: Run the build command
echo "Building the project..."
npm run build

echo "Script completed successfully!"
