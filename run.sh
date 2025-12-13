#!/bin/bash

# Configuration
HOST="0.0.0.0"
DEV_PORT="5173"
PREVIEW_PORT="4173"
PID_FILE="/tmp/vite_pids.sh"
LOG_DIR="logs"
BUILD_DIR="dist"

# Detect package manager (npm, yarn, or pnpm)
detect_package_manager() {
    if [ -f "pnpm-lock.yaml" ]; then
        echo "pnpm"
    elif [ -f "yarn.lock" ]; then
        echo "yarn"
    elif [ -f "package-lock.json" ] || [ -f "package.json" ]; then
        echo "npm"
    else
        echo ""
    fi
}

PACKAGE_MANAGER=$(detect_package_manager)

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        echo "✗ Error: Node.js is not installed"
        echo "  Install from: https://nodejs.org/"
        exit 1
    fi
    echo "✓ Node.js $(node --version) detected"
}

# Function to check if package manager is available
check_package_manager() {
    if [ -z "$PACKAGE_MANAGER" ]; then
        echo "✗ Error: No package.json found in current directory"
        exit 1
    fi
    
    if ! command -v $PACKAGE_MANAGER &> /dev/null; then
        echo "✗ Error: $PACKAGE_MANAGER is not installed"
        exit 1
    fi
    
    echo "✓ Using $PACKAGE_MANAGER as package manager"
}

# Function to check if dependencies are installed
check_dependencies() {
    if [ ! -d "node_modules" ]; then
        echo "⚠ node_modules not found. Installing dependencies..."
        $PACKAGE_MANAGER install
        if [ $? -ne 0 ]; then
            echo "✗ Failed to install dependencies"
            exit 1
        fi
        echo "✓ Dependencies installed"
    else
        echo "✓ node_modules found"
    fi
    
    # Check if vite is installed
    if [ ! -d "node_modules/vite" ] && [ ! -d "node_modules/.bin/vite" ]; then
        echo "✗ Error: Vite is not installed"
        echo "  Run: $PACKAGE_MANAGER install vite --save-dev"
        exit 1
    fi
    echo "✓ Vite is installed"
}

# Function to start Vite dev server
start_dev() {
    echo "Starting Vite DEV server on $HOST:$DEV_PORT..."
    
    case $PACKAGE_MANAGER in
        npm)
            nohup npm run dev -- --host $HOST --port $DEV_PORT \
                > "$LOG_DIR/vite-dev.log" 2>&1 &
            ;;
        yarn)
            nohup yarn dev --host $HOST --port $DEV_PORT \
                > "$LOG_DIR/vite-dev.log" 2>&1 &
            ;;
        pnpm)
            nohup pnpm dev --host $HOST --port $DEV_PORT \
                > "$LOG_DIR/vite-dev.log" 2>&1 &
            ;;
    esac
    
    VITE_PID=$!
    sleep 2
    
    if ps -p $VITE_PID > /dev/null; then
        echo "✓ Vite DEV server started with PID: $VITE_PID"
        echo "VITE_PID=$VITE_PID" > "$PID_FILE"
        echo "MODE=dev" >> "$PID_FILE"
        echo "✓ PID saved to $PID_FILE"
        echo ""
        echo "=== DEV Server Running ==="
        echo "• Local:   http://localhost:$DEV_PORT"
        echo "• Network: http://$HOST:$DEV_PORT"
        echo "• Logs:    $LOG_DIR/vite-dev.log"
        echo ""
        echo "To stop: $0 0"
    else
        echo "✗ Failed to start Vite. Check $LOG_DIR/vite-dev.log for errors"
        echo ""
        echo "Last few lines of log:"
        tail -n 10 "$LOG_DIR/vite-dev.log"
        exit 1
    fi
}

# Function to build and serve production
start_production() {
    echo "=== Building for Production ==="
    
    # Build the project
    case $PACKAGE_MANAGER in
        npm)
            npm run build
            ;;
        yarn)
            yarn build
            ;;
        pnpm)
            pnpm build
            ;;
    esac
    
    if [ $? -ne 0 ]; then
        echo "✗ Build failed!"
        exit 1
    fi
    
    if [ ! -d "$BUILD_DIR" ]; then
        echo "✗ Build directory '$BUILD_DIR' not found!"
        exit 1
    fi
    
    echo "✓ Build completed successfully"
    echo ""
    echo "Starting Vite PREVIEW server on $HOST:$PREVIEW_PORT..."
    
    # Start preview server
    case $PACKAGE_MANAGER in
        npm)
            nohup npm run preview -- --host $HOST --port $PREVIEW_PORT \
                > "$LOG_DIR/vite-preview.log" 2>&1 &
            ;;
        yarn)
            nohup yarn preview --host $HOST --port $PREVIEW_PORT \
                > "$LOG_DIR/vite-preview.log" 2>&1 &
            ;;
        pnpm)
            nohup pnpm preview --host $HOST --port $PREVIEW_PORT \
                > "$LOG_DIR/vite-preview.log" 2>&1 &
            ;;
    esac
    
    VITE_PID=$!
    sleep 2
    
    if ps -p $VITE_PID > /dev/null; then
        echo "✓ Vite PREVIEW server started with PID: $VITE_PID"
        echo "VITE_PID=$VITE_PID" > "$PID_FILE"
        echo "MODE=preview" >> "$PID_FILE"
        echo "✓ PID saved to $PID_FILE"
        echo ""
        echo "=== PRODUCTION Preview Running ==="
        echo "• Local:   http://localhost:$PREVIEW_PORT"
        echo "• Network: http://$HOST:$PREVIEW_PORT"
        echo "• Logs:    $LOG_DIR/vite-preview.log"
        echo "• Build:   $BUILD_DIR/"
        echo ""
        echo "To stop: $0 0"
    else
        echo "✗ Failed to start preview server. Check $LOG_DIR/vite-preview.log"
        echo ""
        echo "Last few lines of log:"
        tail -n 10 "$LOG_DIR/vite-preview.log"
        exit 1
    fi
}

# Function to stop all processes
stop_process() {
    echo "=== Stopping Vite Server ==="
    
    STOPPED=false
    
    if [ -f "$PID_FILE" ]; then
        source "$PID_FILE"
        
        if [ -n "$VITE_PID" ]; then
            if ps -p $VITE_PID > /dev/null 2>&1; then
                kill $VITE_PID
                sleep 1
                if ps -p $VITE_PID > /dev/null 2>&1; then
                    kill -9 $VITE_PID 2>/dev/null
                fi
                echo "✓ Stopped Vite $MODE server (PID: $VITE_PID)"
                STOPPED=true
            else
                echo "• Process not running (PID: $VITE_PID)"
            fi
        fi
        
        rm -f "$PID_FILE"
        echo "✓ Removed PID file"
    fi
    
    if [ "$STOPPED" = false ]; then
        echo "• No PID file found. Checking for running processes..."
        
        # Kill dev server on port
        DEV_PID=$(lsof -ti:$DEV_PORT 2>/dev/null)
        if [ -n "$DEV_PID" ]; then
            kill $DEV_PID 2>/dev/null
            sleep 1
            kill -9 $DEV_PID 2>/dev/null
            echo "✓ Killed process on dev port $DEV_PORT (PID: $DEV_PID)"
            STOPPED=true
        fi
        
        # Kill preview server on port
        PREVIEW_PID=$(lsof -ti:$PREVIEW_PORT 2>/dev/null)
        if [ -n "$PREVIEW_PID" ]; then
            kill $PREVIEW_PID 2>/dev/null
            sleep 1
            kill -9 $PREVIEW_PID 2>/dev/null
            echo "✓ Killed process on preview port $PREVIEW_PORT (PID: $PREVIEW_PID)"
            STOPPED=true
        fi
        
        # Kill by process name
        VITE_PIDS=$(pgrep -f "vite.*(dev|preview)" 2>/dev/null)
        if [ -n "$VITE_PIDS" ]; then
            kill $VITE_PIDS 2>/dev/null
            sleep 1
            kill -9 $VITE_PIDS 2>/dev/null
            echo "✓ Killed Vite processes: $VITE_PIDS"
            STOPPED=true
        fi
    fi
    
    if [ "$STOPPED" = false ]; then
        echo "• No Vite servers found running"
    fi
    
    echo "=== Stop operation completed ==="
}

# Function to start process (dev or production)
start_process() {
    # Check if already running
    if [ -f "$PID_FILE" ]; then
        source "$PID_FILE"
        if ps -p $VITE_PID > /dev/null 2>&1; then
            echo "⚠ Vite server is already running in $MODE mode (PID: $VITE_PID)!"
            echo "Run '$0 0' to stop it first"
            exit 1
        fi
    fi
    
    # Check Node.js
    check_node
    
    # Check package manager
    check_package_manager
    
    # Check dependencies
    check_dependencies
    
    echo ""
}

# Function to show status
show_status() {
    echo "=== Vite Server Status ==="
    
    if [ -f "$PID_FILE" ]; then
        source "$PID_FILE"
        if ps -p $VITE_PID > /dev/null 2>&1; then
            if [ "$MODE" = "dev" ]; then
                echo "✓ Vite DEV server is running (PID: $VITE_PID)"
                echo "• URL: http://$HOST:$DEV_PORT"
                echo "• Logs: $LOG_DIR/vite-dev.log"
            else
                echo "✓ Vite PREVIEW server is running (PID: $VITE_PID)"
                echo "• URL: http://$HOST:$PREVIEW_PORT"
                echo "• Logs: $LOG_DIR/vite-preview.log"
            fi
        else
            echo "✗ Server not running (stale PID file)"
        fi
    else
        DEV_PID=$(lsof -ti:$DEV_PORT 2>/dev/null)
        PREVIEW_PID=$(lsof -ti:$PREVIEW_PORT 2>/dev/null)
        
        if [ -n "$DEV_PID" ]; then
            echo "⚠ Something running on dev port $DEV_PORT (PID: $DEV_PID)"
        elif [ -n "$PREVIEW_PID" ]; then
            echo "⚠ Something running on preview port $PREVIEW_PORT (PID: $PREVIEW_PID)"
        else
            echo "• No Vite servers running"
        fi
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [1|2|0|status]"
    echo "  1      - Start DEV server (hot reload, port $DEV_PORT)"
    echo "  2      - Build and serve PRODUCTION (port $PREVIEW_PORT)"
    echo "  0      - Stop any running server"
    echo "  status - Show server status"
    echo ""
    echo "Examples:"
    echo "  $0 1       # Start dev server"
    echo "  $0 2       # Build & serve production"
    echo "  $0 0       # Stop server"
    echo "  $0 status  # Check status"
}

# Main execution
main() {
    if [ $# -eq 0 ]; then
        show_usage
        exit 1
    fi
    
    case "$1" in
        1)
            echo "=== Starting Development Server ==="
            start_process
            start_dev
            ;;
        2)
            echo "=== Starting Production Build & Serve ==="
            start_process
            start_production
            ;;
        0)
            stop_process
            ;;
        status)
            show_status
            ;;
        *)
            echo "✗ Invalid argument: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with arguments
main "$@"