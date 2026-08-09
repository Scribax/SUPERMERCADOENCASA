#!/bin/bash
# ----------------------------------------------------
# Backup script for Superencasa SQLite Database
# ----------------------------------------------------
set -e

BACKUP_DIR="/var/www/backups/sqlite"
DB_PATH="/var/www/supermercadoencasa/prisma/dev.db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/dev_backup_${TIMESTAMP}.db"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

if [ -f "${DB_PATH}" ]; then
  echo "📦 Creating database backup: ${BACKUP_FILE}..."
  cp "${DB_PATH}" "${BACKUP_FILE}"
  gzip -f "${BACKUP_FILE}"
  echo "✅ Backup created successfully: ${BACKUP_FILE}.gz"

  # Delete backups older than 14 days
  find "${BACKUP_DIR}" -name "dev_backup_*.db.gz" -type f -mtime +14 -delete
  echo "🧹 Cleaned up backups older than 14 days."
else
  echo "⚠️ Warning: Database file not found at ${DB_PATH}"
fi
