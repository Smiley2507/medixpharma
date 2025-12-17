# Docker Deployment Guide

## Overview
This guide explains how to deploy the Pharmacy Management System using Docker and Docker Compose.

## Prerequisites
- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- At least 2GB of free RAM
- At least 5GB of free disk space

## Quick Start

### 1. Using the Docker Script (Recommended)

```bash
# Make the script executable (first time only)
chmod +x docker.sh

# Start all services
./docker.sh start

# View logs
./docker.sh logs

# Check status
./docker.sh status

# Stop services
./docker.sh stop

# Restart services
./docker.sh restart

# Clean everything (removes all data)
./docker.sh clean
```

### 2. Using Docker Compose Directly

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## Services

The application consists of three services:

### 1. PostgreSQL Database
- **Container Name**: `pharmacy-postgres`
- **Port**: 5432
- **Database**: pharmacymanagement
- **Username**: celse
- **Password**: 123456
- **Volume**: `postgres_data` (persistent storage)

### 2. Spring Boot Backend
- **Container Name**: `pharmacy-backend`
- **Port**: 8082
- **Depends On**: PostgreSQL
- **Health Check**: `/actuator/health`
- **Startup Time**: ~60 seconds

### 3. React Frontend
- **Container Name**: `pharmacy-frontend`
- **Port**: 80
- **Depends On**: Backend
- **Web Server**: Nginx

## Accessing the Application

Once all services are running:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8082/api
- **Swagger UI**: http://localhost:8082/swagger-ui.html
- **API Docs**: http://localhost:8082/v3/api-docs

## Architecture

```
┌─────────────────────────────────────────┐
│   Browser (http://localhost)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Nginx (Frontend Container)            │
│   - Serves React static files           │
│   - Proxies /api to backend             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   Spring Boot (Backend Container)       │
│   - REST API on port 8082               │
│   - Business logic                      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   PostgreSQL (Database Container)       │
│   - Persistent data storage             │
└─────────────────────────────────────────┘
```

## Network Configuration

All services are connected via a custom bridge network called `pharmacy-network`. This allows:
- Services to communicate using container names
- Isolation from other Docker networks
- DNS resolution between containers

## Volume Management

### Persistent Data
The PostgreSQL database uses a named volume `postgres_data` to persist data between container restarts.

```bash
# List volumes
docker volume ls

# Inspect the database volume
docker volume inspect fullstack-pharmacy-management-system-main_postgres_data

# Backup database
docker exec pharmacy-postgres pg_dump -U celse pharmacymanagement > backup.sql

# Restore database
docker exec -i pharmacy-postgres psql -U celse pharmacymanagement < backup.sql
```

## Health Checks

### PostgreSQL
```bash
docker exec pharmacy-postgres pg_isready -U celse -d pharmacymanagement
```

### Backend
```bash
curl http://localhost:8082/actuator/health
```

### Frontend
```bash
curl http://localhost
```

## Troubleshooting

### Services Won't Start

1. **Check Docker is running**:
   ```bash
   docker info
   ```

2. **Check port availability**:
   ```bash
   # Check if ports are already in use
   sudo lsof -i :80
   sudo lsof -i :8082
   sudo lsof -i :5432
   ```

3. **View service logs**:
   ```bash
   docker-compose logs postgres
   docker-compose logs backend
   docker-compose logs frontend
   ```

### Backend Can't Connect to Database

1. **Wait for database to be ready**: The backend has a health check dependency on PostgreSQL. It may take 10-20 seconds for the database to be ready.

2. **Check database logs**:
   ```bash
   docker-compose logs postgres
   ```

3. **Verify database connection**:
   ```bash
   docker exec -it pharmacy-postgres psql -U celse -d pharmacymanagement
   ```

### Frontend Can't Connect to Backend

1. **Check backend is running**:
   ```bash
   curl http://localhost:8082/actuator/health
   ```

2. **Check nginx configuration**:
   ```bash
   docker exec pharmacy-frontend cat /etc/nginx/conf.d/default.conf
   ```

3. **View nginx logs**:
   ```bash
   docker-compose logs frontend
   ```

### Port Already in Use

If you get "port already in use" errors:

```bash
# Option 1: Stop the conflicting service
sudo systemctl stop nginx  # If nginx is running on host

# Option 2: Change ports in docker-compose.yml
# Edit the ports section for the conflicting service
```

### Out of Memory

If containers are being killed:

```bash
# Check Docker memory limit
docker info | grep Memory

# Increase Docker memory in Docker Desktop settings
# Or add memory limits to docker-compose.yml
```

## Development vs Production

### Development Mode
For local development, you might want to:

1. **Use volume mounts for hot reload**:
   ```yaml
   backend:
     volumes:
       - ./pharmacy-management/src:/app/src
   ```

2. **Expose database port**:
   ```yaml
   postgres:
     ports:
       - "5432:5432"
   ```

3. **Enable debug logging**:
   ```yaml
   backend:
     environment:
       - LOGGING_LEVEL_ROOT=DEBUG
   ```

### Production Mode
For production deployment:

1. **Use environment variables for secrets**:
   ```bash
   export POSTGRES_PASSWORD=secure_password
   export JWT_SECRET=secure_jwt_secret
   ```

2. **Enable HTTPS**:
   - Add SSL certificates
   - Configure nginx for HTTPS
   - Redirect HTTP to HTTPS

3. **Set resource limits**:
   ```yaml
   backend:
     deploy:
       resources:
         limits:
           cpus: '1'
           memory: 1G
   ```

## Monitoring

### View Real-time Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Container Stats
```bash
# Real-time stats
docker stats

# Specific container
docker stats pharmacy-backend
```

### Database Monitoring
```bash
# Connect to database
docker exec -it pharmacy-postgres psql -U celse -d pharmacymanagement

# Check connections
SELECT * FROM pg_stat_activity;

# Check database size
SELECT pg_size_pretty(pg_database_size('pharmacymanagement'));
```

## Updating the Application

### Update Backend Code
```bash
# Rebuild only backend
docker-compose up -d --build backend

# Or rebuild all
docker-compose up -d --build
```

### Update Frontend Code
```bash
# Rebuild only frontend
docker-compose up -d --build frontend
```

### Update Database Schema
The backend uses `spring.jpa.hibernate.ddl-auto=update`, so schema changes are applied automatically on startup.

## Backup and Restore

### Backup Database
```bash
# Create backup
docker exec pharmacy-postgres pg_dump -U celse pharmacymanagement > backup_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip backup_*.sql
```

### Restore Database
```bash
# Stop backend to prevent conflicts
docker-compose stop backend

# Restore from backup
gunzip -c backup_20231217_120000.sql.gz | docker exec -i pharmacy-postgres psql -U celse pharmacymanagement

# Restart backend
docker-compose start backend
```

### Backup Volumes
```bash
# Backup volume to tar
docker run --rm -v fullstack-pharmacy-management-system-main_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data_backup.tar.gz -C /data .

# Restore volume from tar
docker run --rm -v fullstack-pharmacy-management-system-main_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_data_backup.tar.gz -C /data
```

## Security Considerations

1. **Change Default Passwords**: Update database credentials in `docker-compose.yml`
2. **Use Secrets**: For production, use Docker secrets or environment variables
3. **Network Isolation**: Services are isolated in a custom network
4. **No Root User**: Containers run as non-root users where possible
5. **Regular Updates**: Keep Docker images updated

## Performance Tuning

### PostgreSQL
```yaml
postgres:
  environment:
    - POSTGRES_SHARED_BUFFERS=256MB
    - POSTGRES_EFFECTIVE_CACHE_SIZE=1GB
    - POSTGRES_MAX_CONNECTIONS=100
```

### Backend
```yaml
backend:
  environment:
    - JAVA_OPTS=-Xmx512m -Xms256m
```

### Frontend (Nginx)
```nginx
# In nginx.conf
worker_processes auto;
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

## Common Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f

# Execute command in container
docker exec -it pharmacy-backend bash

# Remove all containers and volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Scale a service (if applicable)
docker-compose up -d --scale backend=2
```

## Next Steps

1. ✅ Start the application with `./docker.sh start`
2. ✅ Access the frontend at http://localhost
3. ✅ Check the API documentation at http://localhost:8082/swagger-ui.html
4. ✅ Create your first admin user
5. ✅ Start managing your pharmacy!

## Support

If you encounter issues:
1. Check the logs: `./docker.sh logs`
2. Verify all services are running: `./docker.sh status`
3. Review this troubleshooting guide
4. Check the main README.md for additional information
