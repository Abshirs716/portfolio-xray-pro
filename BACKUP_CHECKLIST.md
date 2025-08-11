# Institutional PDF System - Backup Verification Checklist

## 📋 Pre-Backup Checklist

### Environment Preparation
- [ ] **Working Directory**: Confirm you're in the project root directory
- [ ] **Git Status**: Check `git status` - commit or stash unsaved changes
- [ ] **Disk Space**: Ensure adequate disk space (minimum 1GB free)
- [ ] **Permissions**: Verify write permissions for backup directories
- [ ] **Network**: Confirm internet connection for cloud uploads

### System Health Check
- [ ] **Application Running**: Test `npm run dev` works without errors
- [ ] **Build Success**: Verify `npm run build` completes successfully
- [ ] **Dependencies**: Run `npm audit` to check for issues
- [ ] **Critical Features**: Test PDF generation functionality
- [ ] **Database**: Verify database connections are working

## 🔧 Backup Execution Checklist

### Script Preparation
- [ ] **Script Permissions**: `chmod +x institutional-pdf-backup.sh`
- [ ] **Configuration**: Review backup script configuration variables
- [ ] **Backup Type**: Choose appropriate backup type (daily/weekly/pre-deploy)
- [ ] **Clean Logs**: Remove old log files if needed

### Backup Execution
```bash
# Daily Backup
- [ ] Run: `./institutional-pdf-backup.sh daily`
- [ ] Monitor output for errors
- [ ] Wait for completion message

# Weekly Backup  
- [ ] Run: `./institutional-pdf-backup.sh weekly`
- [ ] Monitor progress and disk usage
- [ ] Verify completion status

# Pre-deployment Backup
- [ ] Run: `./institutional-pdf-backup.sh pre-deploy`
- [ ] Document deployment context
- [ ] Keep deployment notes
```

## ✅ Post-Backup Verification Checklist

### File System Verification
```bash
# Check backup directory structure
- [ ] Verify: `ls -la backups/`
- [ ] Confirm: `backups/archives/` contains new archive
- [ ] Confirm: `backups/git-backups/` contains git bundle
- [ ] Confirm: `backups/documentation/` has backup report
- [ ] Confirm: `backups/logs/` contains execution log
```

### Archive Integrity Verification
```bash
# Verify archive integrity
- [ ] Check: `tar -tzf backups/archives/institutional-pdf-system-foundation-*.tar.gz | head -10`
- [ ] Verify: Archive lists files without errors
- [ ] Check: `sha256sum -c backups/archives/*.sha256`
- [ ] Confirm: Checksums match

# Verify zip backup
- [ ] Check: `unzip -t backups/archives/institutional-pdf-system-foundation-*.zip`
- [ ] Verify: Zip tests successfully
```

### Git Backup Verification
```bash
# Verify git bundle
- [ ] Check: `git bundle verify backups/git-backups/institutional-pdf-system-*.bundle`
- [ ] Verify: Bundle is valid
- [ ] Check: `git tag -l | grep foundation`
- [ ] Confirm: Foundation tags exist
```

### Content Verification
```bash
# Extract and verify content (test mode)
- [ ] Create: `mkdir -p temp-verify`
- [ ] Extract: `tar -xzf backups/archives/institutional-pdf-system-foundation-*.tar.gz -C temp-verify`
- [ ] Check: Critical files exist in extracted backup
- [ ] Verify: `ls -la temp-verify/institutional-pdf-system-foundation-*/src/components/ai/`
- [ ] Confirm: All essential TypeScript files present
- [ ] Cleanup: `rm -rf temp-verify`
```

## 📊 Backup Quality Assessment

### File Count Verification
```bash
# Count critical files in backup
- [ ] TypeScript files: `find backups/archives/ -name "*.ts" | wc -l` should be > 10
- [ ] Component files: Verify AI components are included
- [ ] Configuration files: Check package.json, configs are present
- [ ] Documentation: Verify README, docs are included
```

### Size Verification
```bash
# Check backup sizes are reasonable
- [ ] Archive size: Should be 5-50MB typically
- [ ] Git bundle: Should be 1-20MB typically  
- [ ] Total backup: Should be < 100MB typically
- [ ] Size comparison: New backup similar to previous ones
```

### Timestamp Verification
```bash
# Verify backup timestamps
- [ ] Archive timestamp: Should match execution time
- [ ] File modification: Recent files should have current timestamps
- [ ] Git commits: Latest commits should be included
- [ ] Backup report: Should show current date/time
```

## 🌐 Cloud Storage Verification

### Upload Preparation
- [ ] **Cloud Service**: Choose primary cloud storage (Google Drive/Dropbox/OneDrive)
- [ ] **Account Access**: Verify cloud storage login works
- [ ] **Storage Space**: Confirm adequate cloud storage space
- [ ] **Folder Structure**: Create/verify backup folder structure

### Upload Execution
- [ ] **Primary Upload**: Upload latest `.tar.gz` archive
- [ ] **Secondary Upload**: Upload latest `.zip` archive  
- [ ] **Checksum Upload**: Upload `.sha256` checksum files
- [ ] **Documentation**: Upload backup report and manifest

### Upload Verification
- [ ] **File Presence**: Verify files appear in cloud storage
- [ ] **File Size**: Confirm uploaded file sizes match local files
- [ ] **Download Test**: Download and verify one file
- [ ] **Access Test**: Verify sharing/access permissions
- [ ] **Backup Location**: Document cloud storage locations

## 🔄 Recovery Testing Checklist

### Monthly Recovery Test
```bash
# Test recovery process (safe environment)
- [ ] Create: `mkdir -p recovery-test`
- [ ] Extract: Latest backup to test directory
- [ ] Install: `npm install` in test directory
- [ ] Build: `npm run build` should succeed
- [ ] Test: Basic functionality should work
- [ ] Cleanup: Remove test directory
```

### Recovery Documentation
- [ ] **Procedures Updated**: Recovery procedures reflect current backup format
- [ ] **Commands Tested**: Recovery commands work with current backups
- [ ] **Timing Recorded**: Document recovery time for planning
- [ ] **Issues Noted**: Record any recovery complications

## 📋 Backup Maintenance Checklist

### Weekly Maintenance
- [ ] **Old Backups**: Remove backups older than retention policy
- [ ] **Disk Usage**: Monitor backup disk usage
- [ ] **Log Review**: Check backup logs for warnings/errors
- [ ] **Script Updates**: Review backup script for improvements

### Monthly Maintenance  
- [ ] **Full Recovery Test**: Complete recovery test from backup
- [ ] **Cloud Organization**: Organize cloud storage backup folders
- [ ] **Documentation Review**: Update backup documentation
- [ ] **Strategy Review**: Assess if backup strategy needs adjustments

## 🚨 Failure Response Checklist

### If Backup Fails
- [ ] **Check Logs**: Review backup log for specific errors
- [ ] **Disk Space**: Verify adequate disk space available
- [ ] **Permissions**: Check file/directory permissions
- [ ] **Dependencies**: Verify git, tar, zip utilities available
- [ ] **Retry**: Attempt backup again after fixing issues

### If Verification Fails
- [ ] **Archive Test**: Re-test archive integrity
- [ ] **Content Check**: Manually verify critical files exist
- [ ] **Regenerate**: Create new backup if corruption detected
- [ ] **Document**: Record failure details for investigation

## 📈 Success Criteria

### Backup Success Indicators
✅ **All backup methods complete without errors**
✅ **Archive integrity verification passes**
✅ **Git bundle verification succeeds**  
✅ **Cloud uploads complete successfully**
✅ **File counts match expectations**
✅ **Critical components are present**
✅ **Recovery test succeeds**
✅ **Documentation is updated**

### Quality Metrics
- **Backup Completion Time**: < 10 minutes
- **Archive Integrity**: 100% verification success
- **Recovery Success Rate**: 100% test success
- **Cloud Upload Success**: 100% upload completion
- **Documentation Currency**: Updated within 24 hours

---

**Checklist Version**: 1.0  
**Last Updated**: $(date)  
**Next Review**: $(date -d "+1 month")

## 📞 Support Resources

- **Script Issues**: Check `backups/logs/` for detailed error logs
- **Recovery Problems**: Consult `RECOVERY_PROCEDURES.md`
- **Cloud Storage**: Refer to cloud provider documentation
- **Git Issues**: Check git status and repository integrity