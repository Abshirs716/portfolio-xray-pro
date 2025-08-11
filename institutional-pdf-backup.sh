#!/bin/bash

# ================================================
# Institutional PDF System - Backup Script
# ================================================
# Complete backup solution for institutional-grade PDF system
# Supports: daily, weekly, pre-deploy backup types
# Usage: ./institutional-pdf-backup.sh [daily|weekly|pre-deploy]

set -euo pipefail

# Configuration
BACKUP_TYPE="${1:-daily}"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
PROJECT_NAME="institutional-pdf-system"
BACKUP_BASE_DIR="backups"
FOUNDATION_DIR="${PROJECT_NAME}-foundation-${TIMESTAMP}"
ARCHIVE_NAME="${PROJECT_NAME}-foundation-${TIMESTAMP}.tar.gz"
LOG_FILE="backup-${TIMESTAMP}.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "${LOG_FILE}"
}

error() {
    echo -e "${RED}[ERROR $(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "${LOG_FILE}"
}

warning() {
    echo -e "${YELLOW}[WARNING $(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "${LOG_FILE}"
}

info() {
    echo -e "${BLUE}[INFO $(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "${LOG_FILE}"
}

# Create backup directories
create_backup_structure() {
    log "Creating backup directory structure..."
    
    mkdir -p "${BACKUP_BASE_DIR}"
    mkdir -p "${BACKUP_BASE_DIR}/archives"
    mkdir -p "${BACKUP_BASE_DIR}/git-backups"
    mkdir -p "${BACKUP_BASE_DIR}/documentation"
    mkdir -p "${BACKUP_BASE_DIR}/logs"
    
    log "Backup structure created successfully"
}

# Git repository backup
backup_git_repository() {
    log "Starting Git repository backup..."
    
    # Create foundation branch if it doesn't exist
    if ! git branch -a | grep -q "foundation-master"; then
        info "Creating foundation-master branch..."
        git checkout -b foundation-master
        git add .
        git commit -m "Foundation backup - ${TIMESTAMP}" || true
    else
        info "Foundation branch exists, updating..."
        git checkout foundation-master
        git add .
        git commit -m "Foundation update - ${TIMESTAMP}" || true
    fi
    
    # Create foundation tag
    FOUNDATION_TAG="foundation-v1.0-${TIMESTAMP}"
    git tag "${FOUNDATION_TAG}" || warning "Tag ${FOUNDATION_TAG} may already exist"
    
    # Backup to git bundle (portable git repository)
    git bundle create "${BACKUP_BASE_DIR}/git-backups/${PROJECT_NAME}-${TIMESTAMP}.bundle" --all
    
    log "Git repository backup completed"
}

# File system backup
backup_file_system() {
    log "Starting file system backup..."
    
    # Critical files and directories to backup
    CRITICAL_PATHS=(
        "src/components/ai/"
        "src/hooks/"
        "src/services/"
        "src/types/"
        "src/lib/"
        "src/contexts/"
        "src/integrations/"
        "src/pages/"
        "src/utils/"
        "src/index.css"
        "src/main.tsx"
        "src/App.tsx"
        "package.json"
        "tailwind.config.ts"
        "vite.config.ts"
        "tsconfig.json"
        "README.md"
        "supabase/"
        "public/"
    )
    
    # Create foundation directory
    mkdir -p "${FOUNDATION_DIR}"
    
    # Copy critical paths
    for path in "${CRITICAL_PATHS[@]}"; do
        if [ -f "$path" ] || [ -d "$path" ]; then
            info "Backing up: $path"
            cp -r "$path" "${FOUNDATION_DIR}/" 2>/dev/null || warning "Could not backup $path"
        else
            warning "Path not found: $path"
        fi
    done
    
    # Create manifest file
    cat > "${FOUNDATION_DIR}/BACKUP_MANIFEST.txt" << EOF
Institutional PDF System Backup
===============================
Backup Type: ${BACKUP_TYPE}
Timestamp: ${TIMESTAMP}
Created: $(date)
System: $(uname -a)

Critical Components Included:
$(find "${FOUNDATION_DIR}" -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" | sort)

Backup Verification:
- Total Files: $(find "${FOUNDATION_DIR}" -type f | wc -l)
- Total Size: $(du -sh "${FOUNDATION_DIR}" | cut -f1)
- Archive: ${ARCHIVE_NAME}

Recovery Instructions:
1. Extract archive: tar -xzf ${ARCHIVE_NAME}
2. Copy contents to project root
3. Run: npm install
4. Verify: npm run dev
EOF
    
    log "File system backup completed"
}

# Create compressed archive
create_archive() {
    log "Creating compressed archive..."
    
    # Create tar.gz archive
    tar -czf "${BACKUP_BASE_DIR}/archives/${ARCHIVE_NAME}" "${FOUNDATION_DIR}"
    
    # Create zip archive as backup
    ZIP_NAME="${PROJECT_NAME}-foundation-${TIMESTAMP}.zip"
    zip -r "${BACKUP_BASE_DIR}/archives/${ZIP_NAME}" "${FOUNDATION_DIR}" > /dev/null
    
    # Generate checksums
    cd "${BACKUP_BASE_DIR}/archives"
    sha256sum "${ARCHIVE_NAME}" > "${ARCHIVE_NAME}.sha256"
    sha256sum "${ZIP_NAME}" > "${ZIP_NAME}.sha256"
    cd - > /dev/null
    
    # Verify archive integrity
    if tar -tzf "${BACKUP_BASE_DIR}/archives/${ARCHIVE_NAME}" > /dev/null; then
        log "Archive integrity verified: ${ARCHIVE_NAME}"
    else
        error "Archive integrity check failed: ${ARCHIVE_NAME}"
        exit 1
    fi
    
    log "Archive creation completed"
}

# Backup documentation
backup_documentation() {
    log "Backing up documentation..."
    
    # Copy backup-related documentation
    cp -f BACKUP_STRATEGY.md "${BACKUP_BASE_DIR}/documentation/" 2>/dev/null || true
    cp -f institutional-pdf-backup.sh "${BACKUP_BASE_DIR}/documentation/" 2>/dev/null || true
    cp -f RECOVERY_PROCEDURES.md "${BACKUP_BASE_DIR}/documentation/" 2>/dev/null || true
    cp -f DEVELOPMENT_ROADMAP.md "${BACKUP_BASE_DIR}/documentation/" 2>/dev/null || true
    cp -f README.md "${BACKUP_BASE_DIR}/documentation/" 2>/dev/null || true
    
    # Create backup report
    cat > "${BACKUP_BASE_DIR}/documentation/BACKUP_REPORT_${TIMESTAMP}.md" << EOF
# Backup Report - ${TIMESTAMP}

## Backup Summary
- **Type**: ${BACKUP_TYPE}
- **Date**: $(date)
- **Status**: SUCCESS
- **Duration**: Started at ${TIMESTAMP}

## Files Backed Up
- **Git Bundle**: ${PROJECT_NAME}-${TIMESTAMP}.bundle
- **Archive**: ${ARCHIVE_NAME}
- **Zip Archive**: ${ZIP_NAME}
- **Foundation Directory**: ${FOUNDATION_DIR}

## Verification
- Archive Integrity: ✅ PASSED
- File Count: $(find "${FOUNDATION_DIR}" -type f | wc -l) files
- Total Size: $(du -sh "${FOUNDATION_DIR}" | cut -f1)
- Checksum: $(cd "${BACKUP_BASE_DIR}/archives" && cat "${ARCHIVE_NAME}.sha256")

## Next Steps
1. Upload archives to cloud storage
2. Verify cloud uploads
3. Test recovery procedure
4. Update backup logs

## Recovery Commands
\`\`\`bash
# Quick recovery from archive
tar -xzf ${ARCHIVE_NAME}
cp -r ${FOUNDATION_DIR}/* ./

# Recovery from git bundle
git clone ${PROJECT_NAME}-${TIMESTAMP}.bundle restored-project
\`\`\`
EOF
    
    log "Documentation backup completed"
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old backups..."
    
    # Keep last 30 daily backups
    if [ "${BACKUP_TYPE}" = "daily" ]; then
        find "${BACKUP_BASE_DIR}/archives" -name "*daily*" -type f -mtime +30 -delete 2>/dev/null || true
    fi
    
    # Keep last 12 weekly backups
    if [ "${BACKUP_TYPE}" = "weekly" ]; then
        find "${BACKUP_BASE_DIR}/archives" -name "*weekly*" -type f -mtime +84 -delete 2>/dev/null || true
    fi
    
    # Clean up temporary foundation directories older than 7 days
    find . -maxdepth 1 -name "${PROJECT_NAME}-foundation-*" -type d -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
    
    log "Cleanup completed"
}

# Move logs to backup directory
organize_logs() {
    mv "${LOG_FILE}" "${BACKUP_BASE_DIR}/logs/" 2>/dev/null || true
}

# Main backup execution
main() {
    log "============================================="
    log "Starting Institutional PDF System Backup"
    log "Backup Type: ${BACKUP_TYPE}"
    log "Timestamp: ${TIMESTAMP}"
    log "============================================="
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "Not in a git repository. Please run from project root."
        exit 1
    fi
    
    # Execute backup steps
    create_backup_structure
    backup_git_repository
    backup_file_system
    create_archive
    backup_documentation
    cleanup_old_backups
    organize_logs
    
    # Final status
    log "============================================="
    log "Backup completed successfully!"
    log "Archive: ${BACKUP_BASE_DIR}/archives/${ARCHIVE_NAME}"
    log "Size: $(du -sh "${BACKUP_BASE_DIR}/archives/${ARCHIVE_NAME}" | cut -f1)"
    log "Git Bundle: ${BACKUP_BASE_DIR}/git-backups/${PROJECT_NAME}-${TIMESTAMP}.bundle"
    log "============================================="
    
    # Cleanup temporary directory
    rm -rf "${FOUNDATION_DIR}"
    
    info "Next steps:"
    info "1. Upload ${BACKUP_BASE_DIR}/archives/${ARCHIVE_NAME} to cloud storage"
    info "2. Verify backup integrity"
    info "3. Test recovery procedure"
    
    echo ""
    echo -e "${GREEN}✅ Backup completed successfully!${NC}"
    echo -e "${BLUE}📁 Backup location: ${BACKUP_BASE_DIR}/${NC}"
    echo -e "${BLUE}📋 Check backup report: ${BACKUP_BASE_DIR}/documentation/BACKUP_REPORT_${TIMESTAMP}.md${NC}"
}

# Run main function
main "$@"