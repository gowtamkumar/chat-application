#!/bin/sh

DB_NAME="real_time_comunication"
PG_USER="admin"

echo "📦 Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432; do
  sleep 1
done
echo "📦 Starting PostgreSQL backup..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
pg_dump -h postgres -U "$PG_USER" "$DB_NAME" > /backups/chat_application_backup_$TIMESTAMP.sql

echo "✅ Backup completed: /backups/chat_application_backup_$TIMESTAMP.sql"

