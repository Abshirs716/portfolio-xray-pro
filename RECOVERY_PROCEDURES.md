# Institutional PDF System - Recovery Procedures

## 🚨 Emergency Recovery Guide

### Quick Reference Recovery Commands

```bash
# EMERGENCY: Complete system recovery from latest backup
./recovery-quick.sh

# SELECTIVE: Recover specific components only
./recovery-selective.sh [component-name]

# VERIFICATION: Test recovery without applying changes
./recovery-verify.sh [backup-file]
```

## 🔄 Recovery Scenarios

### Scenario 1: Accidental Code Deletion
**Symptoms**: Missing files, broken functionality, compilation errors
**Recovery Time**: 2-5 minutes

```bash
# Step 1: Stop current development
git add . && git commit -m "Save current state before recovery"

# Step 2: Checkout foundation branch
git checkout foundation-master

# Step 3: Verify system functionality
npm run dev

# Step 4: If successful, create new working branch
git checkout -b recovery-$(date +%Y%m%d)
```

### Scenario 2: System Corruption
**Symptoms**: Cannot start application, missing dependencies, broken build
**Recovery Time**: 10-15 minutes

```bash
# Step 1: Identify latest working backup
ls -la backups/archives/ | grep "tar.gz" | tail -5

# Step 2: Extract backup to temporary location
BACKUP_FILE="institutional-pdf-system-foundation-YYYYMMDD-HHMMSS.tar.gz"
mkdir -p temp-recovery
tar -xzf "backups/archives/${BACKUP_FILE}" -C temp-recovery

# Step 3: Verify backup integrity
cd temp-recovery/institutional-pdf-system-foundation-*
npm install
npm run build

# Step 4: If verification successful, restore to main project
cd ../../
cp -r temp-recovery/institutional-pdf-system-foundation-*/* ./
npm install
```

### Scenario 3: Complete Project Loss
**Symptoms**: Entire project directory missing or corrupted
**Recovery Time**: 20-30 minutes

```bash
# Step 1: Create new project directory
mkdir institutional-pdf-system-recovery
cd institutional-pdf-system-recovery

# Step 2: Recover from git bundle (fastest)
git clone ../backups/git-backups/institutional-pdf-system-YYYYMMDD-HHMMSS.bundle .

# Alternative: Recover from archive
# tar -xzf ../backups/archives/institutional-pdf-system-foundation-YYYYMMDD-HHMMSS.tar.gz
# cp -r institutional-pdf-system-foundation-*/* ./

# Step 3: Restore dependencies and verify
npm install
npm run dev

# Step 4: Test critical functionality
npm run build
```

### Scenario 4: Cloud Storage Recovery
**Symptoms**: Local backups unavailable, need to recover from cloud
**Recovery Time**: 30-60 minutes (depending on download speed)

```bash
# Step 1: Download backup from cloud storage
# (Manual step - download latest archive from Google Drive/Dropbox/OneDrive)

# Step 2: Verify download integrity
sha256sum institutional-pdf-system-foundation-YYYYMMDD-HHMMSS.tar.gz
# Compare with institutional-pdf-system-foundation-YYYYMMDD-HHMMSS.tar.gz.sha256

# Step 3: Extract and restore
tar -xzf institutional-pdf-system-foundation-YYYYMMDD-HHMMSS.tar.gz
cp -r institutional-pdf-system-foundation-*/* ./

# Step 4: Full system restoration
npm install
npm run build
npm run dev
```

## 🔍 Recovery Verification Checklist

### Pre-Recovery Verification
- [ ] Identify the correct backup to restore from
- [ ] Verify backup file integrity (checksums)
- [ ] Ensure sufficient disk space for recovery
- [ ] Create snapshot of current state (if possible)

### Post-Recovery Verification
- [ ] Application starts without errors (`npm run dev`)
- [ ] Build process completes successfully (`npm run build`)
- [ ] All critical components are present
- [ ] PDF generation system works correctly
- [ ] Database connections are functional
- [ ] Authentication system works
- [ ] All pages load correctly

### Critical Component Verification
```bash
# Verify core PDF system files exist
ls -la src/components/ai/InstitutionalPDFSystem.ts
ls -la src/components/ai/InstitutionalDataExtraction.ts
ls -la src/components/ai/InstitutionalIntegration.ts

# Test PDF generation functionality
# (Manual test - generate a sample PDF through the UI)

# Verify no missing dependencies
npm audit
npm run build
```

## 🛠️ Recovery Scripts

### Automated Recovery Script
```bash
#!/bin/bash
# quick-recovery.sh - Automated recovery from latest backup

LATEST_BACKUP=$(ls -t backups/archives/*.tar.gz | head -1)
echo "Recovering from: ${LATEST_BACKUP}"

# Create recovery workspace
mkdir -p recovery-workspace
cd recovery-workspace

# Extract backup
tar -xzf "../${LATEST_BACKUP}"

# Find extracted directory
EXTRACTED_DIR=$(find . -name "institutional-pdf-system-foundation-*" -type d | head -1)

# Copy to project root
cp -r "${EXTRACTED_DIR}"/* ../

# Restore dependencies
cd ..
npm install

echo "Recovery completed. Please test the application."
```

### Selective Recovery Script
```bash
#!/bin/bash
# selective-recovery.sh - Recover specific components only

COMPONENT="$1"
LATEST_BACKUP=$(ls -t backups/archives/*.tar.gz | head -1)

if [ -z "$COMPONENT" ]; then
    echo "Usage: $0 [ai|hooks|services|types]"
    exit 1
fi

echo "Recovering ${COMPONENT} components from: ${LATEST_BACKUP}"

# Create temporary extraction space
mkdir -p temp-selective-recovery
cd temp-selective-recovery

# Extract backup
tar -xzf "../${LATEST_BACKUP}"

# Find extracted directory
EXTRACTED_DIR=$(find . -name "institutional-pdf-system-foundation-*" -type d | head -1)

# Recover specific component
case $COMPONENT in
    "ai")
        cp -r "${EXTRACTED_DIR}/src/components/ai"/* ../src/components/ai/
        ;;
    "hooks")
        cp -r "${EXTRACTED_DIR}/src/hooks"/* ../src/hooks/
        ;;
    "services")
        cp -r "${EXTRACTED_DIR}/src/services"/* ../src/services/
        ;;
    "types")
        cp -r "${EXTRACTED_DIR}/src/types"/* ../src/types/
        ;;
    *)
        echo "Unknown component: $COMPONENT"
        exit 1
        ;;
esac

# Cleanup
cd ..
rm -rf temp-selective-recovery

echo "Selective recovery of ${COMPONENT} completed."
```

## 📊 Recovery Testing Procedures

### Weekly Recovery Test (Recommended)
```bash
# Test 1: Git recovery
git checkout foundation-master
npm run dev
# Verify: Application loads correctly

# Test 2: Archive recovery
mkdir -p test-recovery
LATEST_ARCHIVE=$(ls -t backups/archives/*.tar.gz | head -1)
tar -xzf "${LATEST_ARCHIVE}" -C test-recovery
cd test-recovery/institutional-pdf-system-foundation-*
npm install && npm run build
# Verify: Build succeeds without errors

# Test 3: Component verification
npm run dev
# Manual: Test PDF generation through UI
# Manual: Test all major features

# Cleanup
cd ../../
rm -rf test-recovery
```

### Monthly Full Recovery Test
```bash
# Create isolated test environment
mkdir -p monthly-recovery-test
cd monthly-recovery-test

# Test git bundle recovery
LATEST_BUNDLE=$(ls -t ../backups/git-backups/*.bundle | head -1)
git clone "${LATEST_BUNDLE}" git-recovery-test

# Test archive recovery  
LATEST_ARCHIVE=$(ls -t ../backups/archives/*.tar.gz | head -1)
mkdir archive-recovery-test
tar -xzf "${LATEST_ARCHIVE}" -C archive-recovery-test

# Verify both methods work
cd git-recovery-test && npm install && npm run build && cd ..
cd archive-recovery-test/institutional-pdf-system-foundation-* && npm install && npm run build && cd ../..

# Cleanup
cd ..
rm -rf monthly-recovery-test
```

## 🚨 Emergency Contacts & Resources

### Recovery Escalation
1. **Self-Service**: Use provided recovery scripts
2. **Documentation**: Consult this guide and backup reports
3. **Community**: Lovable Discord community support
4. **Professional**: Consider professional recovery services for critical data

### Critical Recovery Resources
- **Backup Location**: `./backups/` directory
- **Documentation**: `./backups/documentation/`
- **Logs**: `./backups/logs/`
- **Git Bundles**: `./backups/git-backups/`
- **Archives**: `./backups/archives/`

### Recovery Success Metrics
- **Recovery Time Objective (RTO)**: < 30 minutes
- **Recovery Point Objective (RPO)**: < 24 hours data loss
- **System Availability**: 99.9% after recovery
- **Functionality**: 100% feature restoration

---

**Remember**: Always test recovery procedures in a safe environment before applying to production systems.