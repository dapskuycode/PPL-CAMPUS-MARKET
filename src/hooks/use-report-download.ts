'use client';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export function useReportDownload() {
  const downloadReportAsPDF = async (endpoint: string, filename: string) => {
    try {
      // Fetch HTML content
      const response = await fetch(endpoint);
      const html = await response.text();

      // Create temporary container for rendering
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '210mm'; // A4 width
      document.body.appendChild(container);

      // Convert to canvas (if html2canvas available)
      try {
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        // Convert canvas to PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(filename.replace('.html', '.pdf'));
      } catch (error) {
        // Fallback: download as HTML if html2canvas fails
        console.warn('html2canvas not available, downloading as HTML', error);
        downloadAsHTML(html, filename);
      }

      // Clean up
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Gagal mengunduh laporan');
    }
  };

  const downloadAsHTML = (html: string, filename: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return { downloadReportAsPDF };
}
