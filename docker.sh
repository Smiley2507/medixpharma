#!/bin/bash

# Pharmacy Management System - Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Pharmacy Management System${NC}"
echo -e "${GREEN}Docker Management Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running${NC}"
        echo "Please start Docker and try again"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker is running${NC}"
}

# Function to build and start services
start_services() {
    echo -e "${YELLOW}Building and starting services...${NC}"
    docker compose up -d --build
    echo -e "${GREEN}✓ Services started successfully${NC}"
    echo ""
    echo -e "${GREEN}Access the application:${NC}"
    echo -e "  Frontend: ${YELLOW}http://localhost${NC}"
    echo -e "  Backend:  ${YELLOW}http://localhost:8082${NC}"
    echo -e "  Swagger:  ${YELLOW}http://localhost:8082/swagger-ui.html${NC}"
    echo ""
    echo -e "View logs with: ${YELLOW}docker compose logs -f${NC}"
}

# Function to stop services
stop_services() {
    echo -e "${YELLOW}Stopping services...${NC}"
    docker compose down
    echo -e "${GREEN}✓ Services stopped${NC}"
}

# Function to restart services
restart_services() {
    echo -e "${YELLOW}Restarting services...${NC}"
    docker compose restart
    echo -e "${GREEN}✓ Services restarted${NC}"
}

# Function to view logs
view_logs() {
    echo -e "${YELLOW}Viewing logs (Ctrl+C to exit)...${NC}"
    docker compose logs -f
}

# Function to clean everything
clean_all() {
    echo -e "${YELLOW}Cleaning all containers, volumes, and images...${NC}"
    read -p "Are you sure? This will delete all data (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose down -v --rmi all
        echo -e "${GREEN}✓ Cleaned successfully${NC}"
    else
        echo -e "${YELLOW}Cancelled${NC}"
    fi
}

# Function to show status
show_status() {
    echo -e "${YELLOW}Service Status:${NC}"
    docker compose ps
}

# Main menu
case "${1:-}" in
    start)
        check_docker
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        view_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_all
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|clean}"
        echo ""
        echo "Commands:"
        echo "  start   - Build and start all services"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - View logs from all services"
        echo "  status  - Show status of all services"
        echo "  clean   - Remove all containers, volumes, and images"
        exit 1
        ;;
esac
