import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs-dist worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract text content from a PDF file using pdfjs-dist.
 * @param file The PDF file to extract text from
 * @returns The extracted text content
 */
export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  
  return fullText;
}

/**
 * Validate that the uploaded file is a valid PDF and within size limits.
 * @param file The file to validate
 * @param maxSizeMb Maximum allowed file size in MB
 * @returns Error message or null if valid
 */
export function validatePdfFile(file: File, maxSizeMb: number): string | null {
  if (file.type !== 'application/pdf') {
    return 'Please upload a valid PDF medical report';
  }
  if (file.size > maxSizeMb * 1024 * 1024) {
    return `File too large. Maximum size is ${maxSizeMb} MB.`;
  }
  return null;
}
