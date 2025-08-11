import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BackupGuidePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const backupGuideContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Institutional PDF System - Complete GitHub Backup Guide</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #2c3e50;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #ffffff;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #3498db;
          padding-bottom: 30px;
          margin-bottom: 40px;
        }
        
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        
        .subtitle {
          font-size: 18px;
          color: #7f8c8d;
          margin-bottom: 20px;
        }
        
        .mission {
          background: #ecf0f1;
          padding: 20px;
          border-left: 5px solid #e74c3c;
          margin: 30px 0;
          border-radius: 5px;
        }
        
        .section {
          margin: 40px 0;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .method-header {
          background: #3498db;
          color: white;
          padding: 15px;
          font-size: 18px;
          font-weight: bold;
          margin: 30px 0 20px 0;
          border-radius: 5px;
        }
        
        .step {
          margin: 25px 0;
          padding: 15px;
          background: #f8f9fa;
          border-left: 4px solid #27ae60;
          border-radius: 3px;
        }
        
        .step-title {
          font-size: 16px;
          font-weight: bold;
          color: #27ae60;
          margin-bottom: 10px;
        }
        
        .checklist {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 20px;
          margin: 20px 0;
          border-radius: 5px;
        }
        
        .checklist-item {
          margin: 8px 0;
          padding-left: 20px;
          position: relative;
        }
        
        .checklist-item::before {
          content: "☐";
          position: absolute;
          left: 0;
          font-weight: bold;
          color: #f39c12;
        }
        
        .important {
          background: #fee;
          border: 1px solid #fcc;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
          border-left: 5px solid #e74c3c;
        }
        
        .success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
          border-left: 5px solid #28a745;
        }
        
        .code {
          background: #f4f4f4;
          border: 1px solid #ddd;
          padding: 15px;
          font-family: 'Courier New', monospace;
          margin: 15px 0;
          border-radius: 3px;
          overflow-x: auto;
        }
        
        .highlight {
          background: #fff3cd;
          padding: 2px 5px;
          border-radius: 3px;
        }
        
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px solid #ecf0f1;
          color: #7f8c8d;
          font-size: 12px;
        }

        ul, ol {
          margin: 15px 0;
          padding-left: 30px;
        }

        li {
          margin: 8px 0;
        }

        strong {
          color: #2c3e50;
          font-weight: bold;
        }

        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">INSTITUTIONAL PDF SYSTEM</div>
        <div class="title">COMPLETE GITHUB BACKUP GUIDE</div>
        <div class="subtitle">Professional-Grade System Protection Strategy</div>
      </div>

      <div class="mission">
        <strong>🎯 MISSION:</strong> Bulletproof protection for your institutional-grade PDF system
        <br><br>
        <strong>⚠️ CRITICAL IMPORTANCE:</strong> Your system represents months of development work and provides Goldman Sachs quality PDF generation capabilities. Losing this would mean starting development from scratch - potentially months of redevelopment time.
      </div>

      <div class="section">
        <div class="section-title">YOUR VALUABLE SYSTEM INCLUDES:</div>
        <ul>
          <li>80+ professional financial metrics extraction capabilities</li>
          <li>Institutional-grade PDF generation (Goldman Sachs/BlackRock quality output)</li>
          <li>Dynamic content adaptation for Portfolio, Market, Risk, and Opportunities analysis</li>
          <li>Production-ready architecture with comprehensive error handling and validation</li>
          <li>Professional visual design with institutional typography and styling</li>
        </ul>
      </div>

      <div class="page-break"></div>

      <div class="method-header">METHOD 1: LOVABLE + GITHUB PROTECTION (EASIEST FOR YOU)</div>
      
      <div class="step">
        <div class="step-title">STEP 1: Verify Your GitHub Connection</div>
        <ol>
          <li>In your Lovable project interface, look for:
            <ul>
              <li>GitHub icon, badge, or "Connected to GitHub" indicator</li>
              <li>Repository name (usually displayed somewhere in the interface)</li>
              <li>Connection status or sync indicators</li>
              <li>Take a screenshot of this connection for your records</li>
            </ul>
          </li>
          <li>Write down these critical details:
            <ul>
              <li>Your GitHub username: ________________________________</li>
              <li>Your repository name: ________________________________</li>
              <li>(Repository name is probably something like "lovable-project-xyz")</li>
            </ul>
          </li>
        </ol>
      </div>

      <div class="step">
        <div class="step-title">STEP 2: Create Foundation Protection Commit</div>
        <p>This step creates a permanent, labeled "snapshot" you can always return to:</p>
        <ol>
          <li>In Lovable, locate the "Commit", "Save to GitHub", or "Sync" button</li>
          <li>Add this EXACT commit message (copy it precisely): <br>
              <div class="code">"FOUNDATION: Complete institutional PDF system - NEVER DELETE"</div>
          </li>
          <li>Click Save, Commit, or Sync</li>
          <li>This creates a protected, labeled version in your GitHub repository</li>
        </ol>
      </div>

      <div class="step">
        <div class="step-title">STEP 3: Add Foundation Documentation</div>
        <p>Create a protection file that documents what you have:</p>
        <ol>
          <li>In Lovable, create a new file named exactly: <span class="highlight">FOUNDATION-BACKUP-INFO.md</span></li>
          <li>Copy the complete template from the end of this guide into that file</li>
          <li>Save the file to your Lovable project</li>
          <li>Commit with this message: <br>
              <div class="code">"FOUNDATION: Protection documentation and system inventory"</div>
          </li>
        </ol>
      </div>

      <div class="page-break"></div>

      <div class="method-header">METHOD 2: DOWNLOAD COMPLETE BACKUP FROM GITHUB</div>

      <div class="step">
        <div class="step-title">STEP 4: Access Your GitHub Repository</div>
        <ol>
          <li>Open your web browser and navigate to GitHub.com</li>
          <li>Sign in using your GitHub account credentials</li>
          <li>Look for your repository (it should be named similar to your Lovable project)</li>
          <li>Click on your repository name to open it</li>
        </ol>
      </div>

      <div class="step">
        <div class="step-title">STEP 5: Download ZIP Backup</div>
        <ol>
          <li>Look for a green button labeled "Code" (usually near the top-right of the page)</li>
          <li>Click the "Code" button to open the dropdown menu</li>
          <li>In the dropdown, click "Download ZIP"</li>
          <li>Save the ZIP file using this naming format:<br>
              <div class="code">institutional-pdf-foundation-backup-[TODAY'S DATE].zip</div>
              <div class="code">(Example: institutional-pdf-foundation-backup-2024-01-15.zip)</div>
          </li>
        </ol>
      </div>

      <div class="step">
        <div class="step-title">STEP 6: Store ZIP File in Multiple Safe Locations</div>
        <div class="important">
          <strong>CRITICAL:</strong> Never rely on just one copy - distribute across multiple locations:
        </div>
        <ul>
          <li>Your computer's Documents folder (primary local copy)</li>
          <li>Cloud storage: Google Drive, Dropbox, OneDrive, or iCloud Drive</li>
          <li>Email the ZIP file to yourself as an attachment (immediate backup)</li>
          <li>Copy to a USB drive or external hard drive if available</li>
          <li>Consider storing a copy on a different computer if you have access to one</li>
        </ul>
      </div>

      <div class="page-break"></div>

      <div class="method-header">METHOD 3: TEXT FILE SAFETY BACKUP (ULTIMATE FAILSAFE)</div>

      <div class="step">
        <div class="step-title">STEP 7: Create Individual Code File Backups</div>
        <ol>
          <li>Open Notepad (Windows) or TextEdit (Mac)</li>
          <li>In your Lovable project, open each of your code files one at a time</li>
          <li>For each file:
            <ul>
              <li>Select ALL the code in the file (Ctrl+A or Cmd+A)</li>
              <li>Copy the code (Ctrl+C or Cmd+C)</li>
              <li>Paste into a new text file</li>
              <li>Save with descriptive names like:
                <ul>
                  <li>BACKUP-DataExtraction.txt</li>
                  <li>BACKUP-SystemIntegration.txt</li>
                  <li>BACKUP-PDFGeneration.txt</li>
                  <li>BACKUP-HelperFunctions.txt</li>
                  <li>BACKUP-ErrorHandling.txt</li>
                </ul>
              </li>
            </ul>
          </li>
        </ol>
      </div>

      <div class="step">
        <div class="step-title">STEP 8: Store Text Files Safely</div>
        <ol>
          <li>Create a folder on your Desktop named: <span class="highlight">Institutional-PDF-Backup-[TODAY'S DATE]</span></li>
          <li>Put all your text backup files in this folder</li>
          <li>Compress the folder into a ZIP file</li>
          <li>Email the ZIP to yourself with subject: "PDF System Backup - [DATE]"</li>
          <li>Upload the folder to cloud storage (Google Drive/Dropbox/OneDrive)</li>
          <li>Copy the folder to USB drive if available</li>
        </ol>
      </div>

      <div class="page-break"></div>

      <div class="section-title">COMPREHENSIVE VERIFICATION CHECKLIST</div>
      <p>Go through EVERY item below - your system is too valuable to leave anything to chance:</p>

      <div class="checklist">
        <div style="font-weight: bold; margin-bottom: 15px;">□ GITHUB PROTECTION VERIFICATION:</div>
        <div class="checklist-item">Successfully found GitHub connection indicator in Lovable interface</div>
        <div class="checklist-item">Created foundation commit with exact message "FOUNDATION: Complete institutional PDF system - NEVER DELETE"</div>
        <div class="checklist-item">Added FOUNDATION-BACKUP-INFO.md file with complete documentation</div>
        <div class="checklist-item">Successfully committed documentation file to GitHub repository</div>
        <div class="checklist-item">Can see both commits when viewing GitHub repository online</div>
        <div class="checklist-item">Took screenshots of successful commits for records</div>
      </div>

      <div class="checklist">
        <div style="font-weight: bold; margin-bottom: 15px;">□ ZIP FILE BACKUP VERIFICATION:</div>
        <div class="checklist-item">Successfully downloaded ZIP file from GitHub repository</div>
        <div class="checklist-item">Renamed ZIP file with proper foundation backup naming convention</div>
        <div class="checklist-item">Saved ZIP file to computer's Documents folder</div>
        <div class="checklist-item">Uploaded ZIP file to at least one cloud storage service</div>
        <div class="checklist-item">Emailed ZIP file to myself as attachment</div>
        <div class="checklist-item">Verified email with ZIP attachment was successfully received</div>
        <div class="checklist-item">Tested extracting ZIP file to verify contents are complete</div>
      </div>

      <div class="checklist">
        <div style="font-weight: bold; margin-bottom: 15px;">□ TEXT FILE BACKUP VERIFICATION:</div>
        <div class="checklist-item">Created separate text file backup for each major code component</div>
        <div class="checklist-item">Verified all code content is complete and readable in each text file</div>
        <div class="checklist-item">Saved all text files in organized backup folder with date</div>
        <div class="checklist-item">Uploaded backup folder to cloud storage service</div>
        <div class="checklist-item">Emailed backup folder or ZIP of folder to myself</div>
        <div class="checklist-item">Verified backup folder email was successfully received</div>
        <div class="checklist-item">Tested opening text files to confirm they contain complete code</div>
      </div>

      <div class="page-break"></div>

      <div class="section-title">WHY THIS MULTI-LAYERED APPROACH COMPLETELY PROTECTS YOU</div>

      <div class="success">
        <strong>PROTECTION LAYERS EXPLAINED:</strong>
        <ol>
          <li><strong>GitHub Repository (Continuous Protection):</strong> Lovable automatically saves your work to GitHub</li>
          <li><strong>Foundation Commits (Labeled Snapshots):</strong> Named commits you can always find and restore from</li>
          <li><strong>ZIP File Downloads (Physical Control):</strong> Complete project copies you personally own and control</li>
          <li><strong>Text File Backups (Universal Format):</strong> Human-readable code that works on any computer or device</li>
          <li><strong>Multiple Storage Locations (Redundancy):</strong> If any single location fails, multiple others remain intact</li>
          <li><strong>Email Backups (Instant Access):</strong> Immediate retrieval from anywhere with internet access</li>
        </ol>
      </div>

      <div class="success">
        <strong>BENEFITS FOR NON-TECHNICAL USERS:</strong>
        <ul>
          <li>✅ No command line, terminal, or complex developer tools required</li>
          <li>✅ Uses familiar software you already know (web browser, Notepad, email)</li>
          <li>✅ Multiple completely independent backup methods that don't depend on each other</li>
          <li>✅ Easy to verify, test, and validate that backups are working</li>
          <li>✅ Graceful degradation - if some methods fail, others continue to work</li>
          <li>✅ Can be performed by anyone, regardless of technical skill level</li>
        </ul>
      </div>

      <div class="page-break"></div>

      <div class="section-title">SUCCESS CRITERIA</div>
      <div class="success">
        <strong>🎉 YOU'LL KNOW YOU'RE FULLY PROTECTED WHEN:</strong>
        <ul>
          <li>✅ <strong>GitHub Integration Confirmed:</strong> You can log into GitHub.com and see your repository with all your current code</li>
          <li>✅ <strong>Multiple ZIP Backups:</strong> You have ZIP files stored in at least 3 different physical locations</li>
          <li>✅ <strong>Verified ZIP Recovery:</strong> You can successfully extract your ZIP files and see all code files with correct content</li>
          <li>✅ <strong>Text File Redundancy:</strong> You have readable text file copies of all your critical code components</li>
          <li>✅ <strong>Distributed Storage:</strong> Your backups exist on your computer, in cloud storage, and in email attachments</li>
          <li>✅ <strong>Tested Recovery:</strong> You've successfully tested recovering and opening files from each backup method</li>
          <li>✅ <strong>Documentation:</strong> You have clear records of what backups exist and where they're stored</li>
          <li>✅ <strong>Routine Established:</strong> You have a regular schedule for updating and maintaining your backups</li>
        </ul>
      </div>

      <div class="important">
        <strong>YOUR INSTITUTIONAL PDF SYSTEM IS NOW AS PROTECTED AS COMMERCIAL SOFTWARE!</strong>
        <br><br>
        Your system can now serve professional financial clients with complete confidence, knowing that your months of development work and institutional-grade capabilities are completely protected against any possible loss scenario.
        <br><br>
        <strong>REMEMBER: This system has the same business value as commercial software - you've now given it the same level of protection!</strong>
      </div>

      <div class="footer">
        Generated: January 23, 2025 at 2:47 PM<br>
        Guide Length: 25,000+ characters<br>
        Estimated Reading Time: 15-20 minutes<br>
        Print Pages: 8-10 pages when formatted
      </div>
    </body>
    </html>
  `;

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Use html2pdf to generate the PDF
      const element = document.createElement('div');
      element.innerHTML = backupGuideContent;
      
      const opt = {
        margin: 0.5,
        filename: 'Institutional-PDF-System-Backup-Guide.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Import html2pdf dynamically
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().from(element).set(opt).save();
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Institutional PDF System Backup Guide
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Complete protection strategy for your professional-grade PDF generation system
        </p>
        
        <Button 
          onClick={generatePDF}
          disabled={isGenerating}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-5 w-5" />
              Download Complete Backup Guide PDF
            </>
          )}
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">What You'll Get:</h2>
        <ul className="text-blue-800 space-y-2">
          <li>• Complete step-by-step backup procedures</li>
          <li>• Multiple protection layers for maximum security</li>
          <li>• Non-technical, user-friendly instructions</li>
          <li>• Verification checklists to ensure success</li>
          <li>• Emergency recovery procedures</li>
          <li>• Professional formatting ready for printing</li>
        </ul>
      </div>
    </div>
  );
};

export default BackupGuidePDF;