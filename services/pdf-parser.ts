
/**
 * Represents a parsed transaction extracted from a PDF, CSV, or XLSX file.
 * Should contain the minimal data extractable directly from the file line item.
 */
export interface ParsedTransaction {
  /**
   * The date of the transaction (as string YYYY-MM-DD).
   */
  date: string;
  /**
   * The description of the transaction.
   */
  description: string;
  /**
   * The amount of the transaction (positive for income/credits, negative for expenses/debits).
   */
  amount: number;
}

/**
 * Asynchronously parses a financial statement file (PDF, CSV, XLSX) and extracts transaction data.
 *
 * **THIS IS CURRENTLY A DUMMY IMPLEMENTATION.**
 * It simulates parsing and returns hardcoded data regardless of the file input.
 * In a real application, replace this with actual parsing logic using appropriate libraries
 * (e.g., pdf.js for PDF, Papaparse for CSV, SheetJS for XLSX) or an API call.
 *
 * @param file The file to parse (PDF, CSV, or XLSX).
 * @returns A promise that resolves to an array of ParsedTransaction objects.
 * @throws {Error} If there's an issue during the simulated parsing.
 */
export async function parseFinancialStatement(file: File): Promise<ParsedTransaction[]> {
  console.log(`Simulating file parsing for: ${file.name}, Type: ${file.type}`);

  // Simulate network delay or processing time
  await new Promise(resolve => setTimeout(resolve, 750));

  // Dummy data mimicking typical bank statement entries - RETURNED REGARDLESS OF INPUT FOR NOW
  const dummyData: ParsedTransaction[] = [
    { date: '2024-07-01', description: 'TRANSFER RECEIVED - J DOE', amount: 1500.00 },
    { date: '2024-07-02', description: 'GROCERY STORE ABC', amount: -85.60 },
    { date: '2024-07-03', description: 'COFFEE SHOP XYZ', amount: -12.35 },
    { date: '2024-07-05', description: 'ONLINE RETAILER PURCHASE', amount: -149.99 },
    { date: '2024-07-05', description: 'ATM WITHDRAWAL', amount: -200.00 },
  ];

  // Simulate potential error during parsing based on filename (for testing)
  if (file.name.toLowerCase().includes("error")) {
     console.error("Simulating parsing error based on filename.");
     throw new Error("Simulated file parsing error: File format not recognized or corrupted.");
  }

  console.log(`Simulated parsing complete. Found ${dummyData.length} dummy transactions.`);
  return dummyData;
}

// Renamed function to be more generic (parseFinancialStatement)
// Removed the old parsePdf function if it existed separately.
