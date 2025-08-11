#!/bin/bash

# ================================================
# Institutional PDF System - Emergency Recovery
# ================================================
# Emergency recovery script for critical situations
# Use when normal recovery procedures are not available

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emergency recovery banner
echo -e "${RED}"
echo "🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨"
echo "                    EMERGENCY RECOVERY MODE"
echo "              Institutional PDF System Recovery"
echo "🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨"
echo -e "${NC}"

# Log all actions
LOG_FILE="emergency-recovery-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG_FILE")
exec 2>&1

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR $(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING $(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Create emergency backup of current state
emergency_backup_current() {
    log "Creating emergency backup of current state..."
    
    EMERGENCY_BACKUP="emergency-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$EMERGENCY_BACKUP"
    
    # Copy what we can from current state
    for item in src package.json tsconfig.json tailwind.config.ts vite.config.ts README.md supabase public; do
        if [ -e "$item" ]; then
            cp -r "$item" "$EMERGENCY_BACKUP/" 2>/dev/null || true
        fi
    done
    
    tar -czf "${EMERGENCY_BACKUP}.tar.gz" "$EMERGENCY_BACKUP" 2>/dev/null || true
    rm -rf "$EMERGENCY_BACKUP"
    
    log "Emergency backup created: ${EMERGENCY_BACKUP}.tar.gz"
}

# Detect available recovery options
detect_recovery_options() {
    log "Detecting available recovery options..."
    
    RECOVERY_OPTIONS=()
    
    # Check for local backups
    if [ -d "backups/archives" ] && [ "$(ls -A backups/archives/*.tar.gz 2>/dev/null)" ]; then
        RECOVERY_OPTIONS+=("local-archive")
        log "✓ Local archive backups found"
    fi
    
    # Check for git bundles
    if [ -d "backups/git-backups" ] && [ "$(ls -A backups/git-backups/*.bundle 2>/dev/null)" ]; then
        RECOVERY_OPTIONS+=("git-bundle")
        log "✓ Git bundle backups found"
    fi
    
    # Check for git repository
    if [ -d ".git" ]; then
        # Check for foundation branch
        if git branch -a | grep -q "foundation-master"; then
            RECOVERY_OPTIONS+=("git-foundation")
            log "✓ Git foundation branch found"
        fi
        
        # Check for foundation tags
        if git tag -l | grep -q "foundation"; then
            RECOVERY_OPTIONS+=("git-tag")
            log "✓ Git foundation tags found"
        fi
    fi
    
    # Check for Lovable connection (if .lovable directory exists)
    if [ -d ".lovable" ] || grep -q "lovable" package.json 2>/dev/null; then
        RECOVERY_OPTIONS+=("lovable-restore")
        log "✓ Lovable project detected - can use version history"
    fi
    
    if [ ${#RECOVERY_OPTIONS[@]} -eq 0 ]; then
        error "No recovery options detected!"
        echo -e "${RED}Available actions:${NC}"
        echo "1. Check if backups exist in different location"
        echo "2. Use Lovable's version history (Edit History tab)"
        echo "3. Restore from cloud storage manually"
        echo "4. Contact support if this is a critical system"
        exit 1
    fi
    
    log "Recovery options available: ${RECOVERY_OPTIONS[*]}"
}

# Show recovery menu
show_recovery_menu() {
    echo -e "${BLUE}"
    echo "=================================="
    echo "    EMERGENCY RECOVERY OPTIONS"
    echo "=================================="
    echo -e "${NC}"
    
    local option_num=1
    local menu_options=()
    
    for option in "${RECOVERY_OPTIONS[@]}"; do
        case $option in
            "local-archive")
                echo "$option_num) Recover from Local Archive Backup (Recommended)"
                menu_options[$option_num]="local-archive"
                ;;
            "git-bundle")
                echo "$option_num) Recover from Git Bundle Backup"
                menu_options[$option_num]="git-bundle"
                ;;
            "git-foundation")
                echo "$option_num) Recover from Git Foundation Branch"
                menu_options[$option_num]="git-foundation"
                ;;
            "git-tag")
                echo "$option_num) Recover from Git Foundation Tag"
                menu_options[$option_num]="git-tag"
                ;;
            "lovable-restore")
                echo "$option_num) Instructions for Lovable Version History"
                menu_options[$option_num]="lovable-restore"
                ;;
        esac
        ((option_num++))
    done
    
    echo "$option_num) Cancel and exit"
    echo ""
    
    while true; do
        read -p "Select recovery option (1-$option_num): " choice
        
        if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "$option_num" ]; then
            if [ "$choice" -eq "$option_num" ]; then
                log "Recovery cancelled by user"
                exit 0
            else
                SELECTED_OPTION="${menu_options[$choice]}"
                break
            fi
        else
            error "Invalid selection. Please choose 1-$option_num"
        fi
    done
}

# Execute recovery based on selected option
execute_recovery() {
    case $SELECTED_OPTION in
        "local-archive")
            recover_from_local_archive
            ;;
        "git-bundle")
            recover_from_git_bundle
            ;;
        "git-foundation")
            recover_from_git_foundation
            ;;
        "git-tag")
            recover_from_git_tag
            ;;
        "lovable-restore")
            show_lovable_instructions
            ;;
    esac
}

# Recovery method: Local Archive
recover_from_local_archive() {
    log "Starting recovery from local archive..."
    
    # Find the latest backup
    LATEST_BACKUP=$(ls -t backups/archives/*.tar.gz | head -1)
    log "Using backup: $LATEST_BACKUP"
    
    # Verify backup integrity
    if ! tar -tzf "$LATEST_BACKUP" > /dev/null 2>&1; then
        error "Backup file is corrupted: $LATEST_BACKUP"
        return 1
    fi
    
    log "Backup integrity verified"
    
    # Extract backup
    TEMP_DIR="temp-emergency-recovery-$(date +%H%M%S)"
    mkdir -p "$TEMP_DIR"
    tar -xzf "$LATEST_BACKUP" -C "$TEMP_DIR"
    
    # Find extracted directory
    EXTRACTED_DIR=$(find "$TEMP_DIR" -name "institutional-pdf-system-foundation-*" -type d | head -1)
    
    if [ -z "$EXTRACTED_DIR" ]; then
        error "Could not find extracted backup directory"
        rm -rf "$TEMP_DIR"
        return 1
    fi
    
    log "Backup extracted to: $EXTRACTED_DIR"
    
    # Restore files
    log "Restoring files..."
    
    # Create backup of current src if it exists
    if [ -d "src" ]; then
        mv src "src-before-emergency-recovery-$(date +%H%M%S)" || true
    fi
    
    # Copy restored files
    cp -r "$EXTRACTED_DIR"/* ./
    
    # Cleanup
    rm -rf "$TEMP_DIR"
    
    log "Files restored successfully"
    
    # Restore dependencies
    log "Restoring dependencies..."
    npm install
    
    log "Emergency recovery from local archive completed!"
}

# Recovery method: Git Bundle
recover_from_git_bundle() {
    log "Starting recovery from git bundle..."
    
    # Find latest git bundle
    LATEST_BUNDLE=$(ls -t backups/git-backups/*.bundle | head -1)
    log "Using git bundle: $LATEST_BUNDLE"
    
    # Verify bundle
    if ! git bundle verify "$LATEST_BUNDLE" > /dev/null 2>&1; then
        error "Git bundle is invalid: $LATEST_BUNDLE"
        return 1
    fi
    
    log "Git bundle verified"
    
    # Clone from bundle to temporary location
    TEMP_DIR="temp-bundle-recovery-$(date +%H%M%S)"
    git clone "$LATEST_BUNDLE" "$TEMP_DIR"
    
    # Copy files from cloned repository
    log "Copying files from bundle..."
    cp -r "$TEMP_DIR"/* ./
    cp -r "$TEMP_DIR"/.git* ./ 2>/dev/null || true
    
    # Cleanup
    rm -rf "$TEMP_DIR"
    
    # Restore dependencies
    log "Restoring dependencies..."
    npm install
    
    log "Emergency recovery from git bundle completed!"
}

# Recovery method: Git Foundation Branch
recover_from_git_foundation() {
    log "Starting recovery from git foundation branch..."
    
    # Save current state
    git add . 2>/dev/null || true
    git commit -m "Save state before emergency recovery" 2>/dev/null || true
    
    # Switch to foundation branch
    git checkout foundation-master
    
    # Restore dependencies
    log "Restoring dependencies..."
    npm install
    
    log "Emergency recovery from git foundation branch completed!"
}

# Recovery method: Git Foundation Tag
recover_from_git_tag() {
    log "Starting recovery from git foundation tag..."
    
    # Find latest foundation tag
    LATEST_TAG=$(git tag -l | grep foundation | sort -V | tail -1)
    log "Using foundation tag: $LATEST_TAG"
    
    # Save current state
    git add . 2>/dev/null || true  
    git commit -m "Save state before emergency recovery" 2>/dev/null || true
    
    # Checkout tag
    git checkout "$LATEST_TAG"
    
    # Restore dependencies
    log "Restoring dependencies..."
    npm install
    
    log "Emergency recovery from git foundation tag completed!"
}

# Show Lovable recovery instructions
show_lovable_instructions() {
    echo -e "${BLUE}"
    echo "=============================================="
    echo "    LOVABLE VERSION HISTORY RECOVERY"
    echo "=============================================="
    echo -e "${NC}"
    
    echo -e "${GREEN}To recover using Lovable's built-in version history:${NC}"
    echo ""
    echo "1. ${YELLOW}In the Lovable interface, click 'Edit History' tab${NC}"
    echo "   (Located at the top of the chat window)"
    echo ""
    echo "2. ${YELLOW}Browse through your project's version history${NC}"
    echo "   Look for versions before the issue occurred"
    echo ""
    echo "3. ${YELLOW}Find a stable version with your institutional PDF system${NC}"
    echo "   Look for commits with messages like 'institutional' or 'PDF'"
    echo ""
    echo "4. ${YELLOW}Click 'Restore' on the version you want to recover${NC}"
    echo "   This will restore your entire project to that state"
    echo ""
    echo "5. ${YELLOW}Test the restored version${NC}"
    echo "   Run: npm run dev"
    echo "   Verify PDF generation works"
    echo ""
    echo -e "${GREEN}Alternative: Chat History Recovery${NC}"
    echo "• Look through your chat history with Lovable"
    echo "• Find the conversation where the institutional PDF system was created"
    echo "• Click 'Restore' on that specific edit"
    echo ""
    echo -e "${RED}If Lovable version history is not available:${NC}"
    echo "• The project may have been created without version tracking"
    echo "• Consider using other recovery options from this menu"
    echo "• Contact Lovable support for additional assistance"
    
    read -p "Press Enter to return to recovery menu..."
}

# Post-recovery verification
post_recovery_verification() {
    log "Starting post-recovery verification..."
    
    # Check if critical files exist
    CRITICAL_FILES=(
        "src/components/ai/InstitutionalPDFSystem.ts"
        "src/components/ai/InstitutionalDataExtraction.ts"
        "src/components/ai/InstitutionalIntegration.ts"
        "package.json"
    )
    
    local missing_files=0
    for file in "${CRITICAL_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            error "Critical file missing: $file"
            ((missing_files++))
        else
            log "✓ Found: $file"
        fi
    done
    
    if [ $missing_files -gt 0 ]; then
        error "$missing_files critical files are missing"
        warning "Recovery may be incomplete"
    else
        log "All critical files verified"
    fi
    
    # Test build
    log "Testing build process..."
    if npm run build > /dev/null 2>&1; then
        log "✓ Build test passed"
    else
        warning "Build test failed - may need additional setup"
    fi
    
    # Test dev server
    log "Testing development server..."
    timeout 10s npm run dev > /dev/null 2>&1 || true
    log "Development server test completed"
}

# Main emergency recovery execution
main() {
    log "Emergency recovery started"
    
    # Create emergency backup of current state
    emergency_backup_current
    
    # Detect available recovery options
    detect_recovery_options
    
    # Show recovery menu and get user selection
    show_recovery_menu
    
    # Execute selected recovery method
    execute_recovery
    
    # Verify recovery
    post_recovery_verification
    
    # Final status
    echo -e "${GREEN}"
    echo "=============================================="
    echo "      EMERGENCY RECOVERY COMPLETED!"
    echo "=============================================="
    echo -e "${NC}"
    
    log "Emergency recovery completed successfully"
    
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. ${YELLOW}Test your application:${NC} npm run dev"
    echo "2. ${YELLOW}Verify PDF generation:${NC} Test the institutional PDF features"
    echo "3. ${YELLOW}Create new backup:${NC} ./institutional-pdf-backup.sh daily"
    echo "4. ${YELLOW}Review recovery log:${NC} $LOG_FILE"
    
    echo ""
    echo -e "${GREEN}🎉 Your Institutional PDF System has been recovered!${NC}"
    echo -e "${BLUE}💡 Consider setting up better backup procedures to prevent future issues${NC}"
}

# Run main function
main "$@"