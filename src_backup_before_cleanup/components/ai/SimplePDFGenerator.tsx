import React from 'react';
import html2pdf from 'html2pdf.js';
import { toast } from '@/hooks/use-toast';

interface PDFGeneratorProps {
  analysisContent: string;
  title?: string;
}

/**
 * Simple, reliable PDF generator that uses actual analysis content
 * instead of trying to extract from DOM selectors
 */
export const SimplePDFGenerator = {
  
  async generatePDF(analysisContent: string, title: string = 'Portfolio Analysis Report'): Promise<void> {
    try {
      console.log('🔄 Starting simple PDF generation...');
      console.log('📊 Content received:', analysisContent?.substring(0, 200) + '...');
      console.log('📊 Content length:', analysisContent?.length);
      console.log('📊 Content type:', typeof analysisContent);
      
      if (!analysisContent || analysisContent.trim().length < 50) {
        console.error('❌ Content validation failed:', {
          hasContent: !!analysisContent,
          contentLength: analysisContent?.length,
          trimmedLength: analysisContent?.trim().length
        });
        throw new Error(`Analysis content is too short or empty. Length: ${analysisContent?.length || 0}`);
      }

      console.log('✅ Content validation passed');

      // Process the content for PDF
      const processedContent = SimplePDFGenerator.processAnalysisContent(analysisContent);
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const currentYear = new Date().getFullYear();

      // Create a well-formatted HTML document with the analysis content
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            background: white;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #1f2937;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #1f2937;
            font-size: 28px;
            margin: 0;
            font-weight: 700;
        }
        
        .header .subtitle {
            color: #6b7280;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .content {
            font-size: 11px;
            line-height: 1.5;
        }
        
        .content h1 {
            color: #1f2937;
            font-size: 18px;
            margin-top: 25px;
            margin-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
        }
        
        .content h2 {
            color: #374151;
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 8px;
        }
        
        .content h3 {
            color: #4b5563;
            font-size: 14px;
            margin-top: 15px;
            margin-bottom: 6px;
        }
        
        .content p, .content li {
            margin-bottom: 8px;
        }
        
        .content ul, .content ol {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        
        .content strong {
            color: #1f2937;
            font-weight: 600;
        }
        
        .content code {
            background: #f3f4f6;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: "Monaco", "Menlo", monospace;
            font-size: 10px;
        }
        
        .metrics-highlight {
            background: #f9fafb;
            border-left: 4px solid #3b82f6;
            padding: 10px;
            margin: 15px 0;
            border-radius: 0 4px 4px 0;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
        
        /* PDF-specific styles */
        @media print {
            body { 
                margin: 0; 
                padding: 0.5in; 
            }
            .header { 
                break-after: avoid; 
            }
            .content h1 { 
                break-after: avoid; 
            }
            .content h2 { 
                break-after: avoid; 
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <div class="subtitle">Generated on ${currentDate}</div>
    </div>
    
    <div class="content">
        ${processedContent}
    </div>
    
    <div class="footer">
        <p>This report was generated using institutional-grade analysis tools and methodologies.</p>
        <p>© ${currentYear} Professional Financial Analysis System</p>
    </div>
</body>
</html>`;

      // Create temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = htmlContent;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '8.5in';
      tempContainer.style.backgroundColor = '#ffffff';
      
      document.body.appendChild(tempContainer);

      // Configure PDF options
      const options = {
        margin: 0.5,
        filename: `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 816, // 8.5 inches at 96 DPI
          height: 1056 // 11 inches at 96 DPI
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      // Generate and download PDF
      await html2pdf().from(tempContainer).set(options).save();
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      console.log('✅ PDF generated successfully:', options.filename);
      
      // Add window global for testing
      (window as any).testPDFGenerator = SimplePDFGenerator;
      
      toast({
        title: "PDF Generated Successfully",
        description: `${title} has been downloaded`,
      });
      
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      
      toast({
        title: "PDF Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      
      throw error;
    }
  },

  /**
   * Process and clean the analysis content for PDF
   */
  processAnalysisContent(content: string): string {
    if (!content) return '<p>No analysis content available.</p>';
    
    // Convert markdown-style formatting to HTML
    let processedContent = content
      // Convert headers
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^\*\*(.*)\*\*/gm, '<strong>$1</strong>')
      // Convert bullet points
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^• (.*$)/gm, '<li>$1</li>')
      // Convert numbered lists
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      // Convert line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Wrap in paragraphs and fix lists
    processedContent = '<p>' + processedContent + '</p>';
    processedContent = processedContent
      .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
      .replace(/<\/ul>\s*<ul>/g, '')
      .replace(/<p><ul>/g, '<ul>')
      .replace(/<\/ul><\/p>/g, '</ul>');
    
    // Highlight metrics sections
    processedContent = processedContent.replace(
      /(Portfolio Value|Total Return|Volatility|Sharpe Ratio|Beta|Risk|Performance)([^<]*)/gi, 
      '<div class="metrics-highlight"><strong>$1</strong>$2</div>'
    );
    
    return processedContent;
  }
};

export default SimplePDFGenerator;