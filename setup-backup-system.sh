#!/bin/bash

# ================================================
# Institutional PDF System - Backup System Setup
# ================================================
# One-time setup script to initialize the backup system
# Run this once to prepare your backup environment

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "================================================"
echo "  Institutional PDF System - Backup Setup"
echo "================================================"
echo -e "${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from your project root directory${NC}"
    exit 1
fi

# Check if this is a Lovable project
if ! grep -q "lovable" package.json 2>/dev/null; then
    echo -e "${YELLOW}Warning: This doesn't appear to be a Lovable project${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Project directory verified${NC}"

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Institutional PDF System"
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${GREEN}✓ Git repository already exists${NC}"
fi

# Create backup directory structure
echo -e "${YELLOW}Creating backup directory structure...${NC}"
mkdir -p backups/{archives,git-backups,documentation,logs}
echo -e "${GREEN}✓ Backup directories created${NC}"

# Make backup script executable
if [ -f "institutional-pdf-backup.sh" ]; then
    chmod +x institutional-pdf-backup.sh
    echo -e "${GREEN}✓ Backup script made executable${NC}"
else
    echo -e "${RED}Error: institutional-pdf-backup.sh not found${NC}"
    echo "Please ensure the backup script is in your project directory"
    exit 1
fi

# Create initial foundation backup
echo -e "${YELLOW}Creating initial foundation backup...${NC}"
./institutional-pdf-backup.sh daily

# Set up git hooks for automatic backups (optional)
read -p "Set up automatic pre-commit backup? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    mkdir -p .git/hooks
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Automatic backup before commit
echo "Creating automatic backup before commit..."
./institutional-pdf-backup.sh pre-deploy > /dev/null 2>&1 || true
EOF
    chmod +x .git/hooks/pre-commit
    echo -e "${GREEN}✓ Automatic pre-commit backup enabled${NC}"
fi

# Create cron job suggestions
cat > backup-cron-setup.txt << 'EOF'
# Suggested Cron Jobs for Automated Backups
# Run 'crontab -e' and add these lines:

# Daily backup at 2 AM
0 2 * * * cd /path/to/your/project && ./institutional-pdf-backup.sh daily

# Weekly backup on Sunday at 3 AM  
0 3 * * 0 cd /path/to/your/project && ./institutional-pdf-backup.sh weekly

# Replace /path/to/your/project with your actual project path:
EOF
echo "$(pwd)" >> backup-cron-setup.txt

# Create quick backup alias suggestions
cat > backup-aliases.txt << 'EOF'
# Suggested Bash Aliases for Quick Backups
# Add these to your ~/.bashrc or ~/.zshrc:

alias backup-now='./institutional-pdf-backup.sh daily'
alias backup-weekly='./institutional-pdf-backup.sh weekly'
alias backup-deploy='./institutional-pdf-backup.sh pre-deploy'
alias backup-verify='ls -la backups/archives/ | tail -5'
EOF

# Create recovery shortcuts
cat > recovery-shortcuts.sh << 'EOF'
#!/bin/bash
# Quick Recovery Shortcuts

# Quick recovery from latest backup
quick-restore() {
    echo "Restoring from latest backup..."
    LATEST=$(ls -t backups/archives/*.tar.gz | head -1)
    mkdir -p temp-recovery
    tar -xzf "$LATEST" -C temp-recovery
    EXTRACTED=$(find temp-recovery -name "institutional-pdf-system-foundation-*" -type d | head -1)
    cp -r "$EXTRACTED"/* ./
    rm -rf temp-recovery
    echo "Recovery completed. Run 'npm install' to restore dependencies."
}

# List available backups
list-backups() {
    echo "Available backups:"
    ls -lah backups/archives/*.tar.gz | tail -10
}

# Verify backup integrity
verify-backup() {
    if [ -z "$1" ]; then
        echo "Usage: verify-backup <backup-file>"
        return 1
    fi
    tar -tzf "$1" > /dev/null && echo "✓ Backup integrity verified" || echo "✗ Backup is corrupted"
}

echo "Recovery shortcuts loaded. Available commands:"
echo "  quick-restore    - Restore from latest backup"
echo "  list-backups     - Show available backups"  
echo "  verify-backup    - Check backup integrity"
EOF

chmod +x recovery-shortcuts.sh

# Final setup summary
echo -e "${GREEN}"
echo "================================================"
echo "      Backup System Setup Complete!"
echo "================================================"
echo -e "${NC}"

echo -e "${BLUE}📁 Backup Structure Created:${NC}"
echo "   backups/archives/     - Compressed backup files"
echo "   backups/git-backups/  - Git bundle backups"
echo "   backups/documentation/ - Backup reports and docs"
echo "   backups/logs/         - Backup execution logs"

echo -e "${BLUE}🛠️  Scripts Ready:${NC}"
echo "   ./institutional-pdf-backup.sh daily    - Daily backup"
echo "   ./institutional-pdf-backup.sh weekly   - Weekly backup"
echo "   ./institutional-pdf-backup.sh pre-deploy - Pre-deployment backup"

echo -e "${BLUE}📋 Documentation Available:${NC}"
echo "   BACKUP_STRATEGY.md      - Complete backup strategy"
echo "   RECOVERY_PROCEDURES.md  - Step-by-step recovery guide"
echo "   BACKUP_CHECKLIST.md     - Verification checklist"

echo -e "${BLUE}⚡ Quick Setup Files:${NC}"
echo "   backup-cron-setup.txt   - Cron job suggestions"
echo "   backup-aliases.txt      - Bash aliases for quick access"
echo "   recovery-shortcuts.sh   - Emergency recovery functions"

echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "1. ${YELLOW}Test the backup system:${NC} ./institutional-pdf-backup.sh daily"
echo "2. ${YELLOW}Set up cloud storage:${NC} Upload your first backup to Google Drive/Dropbox"
echo "3. ${YELLOW}Schedule automated backups:${NC} Use backup-cron-setup.txt for cron jobs"
echo "4. ${YELLOW}Test recovery:${NC} Follow RECOVERY_PROCEDURES.md"
echo "5. ${YELLOW}Connect to GitHub:${NC} Push your project to GitHub for additional backup"

echo ""
echo -e "${GREEN}🔐 Your Institutional PDF System is now protected!${NC}"
echo -e "${BLUE}💡 Tip: Run './institutional-pdf-backup.sh daily' now to create your first backup${NC}"

# Offer to create first backup
echo ""
read -p "Create your first backup now? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}Creating your first backup...${NC}"
    ./institutional-pdf-backup.sh daily
    echo -e "${GREEN}🎉 First backup completed successfully!${NC}"
    echo -e "${BLUE}📊 Check the backup report in backups/documentation/${NC}"
fi