#!/bin/sh
# # Database and backup details
# DB_NAME="docker_real_time_comunication"
# BACKUP_FILE="/backups/backup_20250505_105515.sql"
# PG_USER="admin"



# echo "📦 Waiting for PostgreSQL to be ready..."
# until pg_isready -h postgres -p 5432; do
#   sleep 1
# done

# echo "📦 Starting PostgreSQL restore..."
# psql -h postgres -U "$PG_USER" -d "$DB_NAME" -f "$BACKUP_FILE"
# echo "✅ Restore completed: "$BACKUP_FILE""

# Database and backup details
DB_NAME="real_time_comunication"
BACKUP_FILE="/backups/backup_20250505_105515.sql"
PG_USER="admin"

# Wait for PostgreSQL to be ready
echo "📦 Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432; do
  sleep 1
done

# Set password (if required)

# Restore the backup
echo "📦 Starting PostgreSQL restore..."
psql -h postgres -U "$PG_USER" -d "$DB_NAME" -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Restore completed successfully"
else
  echo "❌ Restore failed"
fi


