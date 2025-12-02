import { jsPDF } from "jspdf";

interface PDFOptions {
  filename: string;
  title?: string;
}

/**
 * Convert HTML string to PDF Buffer (server-side)
 * Uses a simple approach: render HTML to canvas-like structure and convert to PDF
 */
export function htmlToPDF(html: string, options: PDFOptions): Buffer {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Create a simple text extraction from HTML for now
    // This is a basic implementation - in production you'd want better HTML parsing
    const text = extractTextFromHtml(html);

    doc.setFontSize(10);
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let yPosition = margin;

    // Add title if provided
    if (options.title) {
      doc.setFontSize(16);
      doc.text(options.title, margin, yPosition);
      yPosition += 10;
    }

    // Add content
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);

    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    return Buffer.from(doc.output("arraybuffer"));
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
}

/**
 * Simple HTML text extraction
 */
function extractTextFromHtml(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  text = decodeHTMLEntities(text);

  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: { [key: string]: string } = {
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&amp;": "&",
    "&nbsp;": " ",
  };

  return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    return entities[entity] || entity;
  });
}
