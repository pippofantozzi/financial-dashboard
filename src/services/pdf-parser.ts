
/**
 * Represents a parsed transaction extracted from a PDF.
 * Should contain the minimal data extractable directly from the PDF line item.
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
 * Asynchronously parses a PDF file and extracts transaction data.
 *
 * THIS IS CURRENTLY A DUMMY IMPLEMENTATION.
 * It simulates parsing and returns hardcoded data.
 * Replace this with a real PDF parsing library or API call.
 *
 * @param file The PDF file to parse.
 * @returns A promise that resolves to an array of ParsedTransaction objects.
 */
export async function parsePdf(file: File): Promise<ParsedTransaction[]> {
  console.log(`Simulating PDF parsing for: ${file.name}`);

  // Simulate network delay or processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Dummy data mimicking typical bank statement entries
  const dummyData: ParsedTransaction[] = [
    { date: '2024-07-01', description: 'TRANSFER RECEIVED - J DOE', amount: 1500.00 },
    { date: '2024-07-02', description: 'GROCERY STORE ABC', amount: -85.60 },
    { date: '2024-07-03', description: 'COFFEE SHOP XYZ', amount: -12.35 },
    { date: '2024-07-05', description: 'ONLINE RETAILER PURCHASE', amount: -149.99 },
    { date: '2024-07-05', description: 'ATM WITHDRAWAL', amount: -200.00 },
    { date: '2024-07-06', description: 'RESTAURANT DINNER', amount: -75.00 },
    { date: '2024-07-07', description: 'UTILITY BILL PAYMENT - ELEC', amount: -110.20 },
    { date: '2024-07-08', description: 'INTEREST PAID', amount: 5.15 },
  ];

  // Simulate potential error during parsing
  // if (file.name.includes("error")) {
  //   throw new Error("Simulated PDF parsing error: File format not recognized.");
  // }

  console.log(`Simulated parsing complete. Found ${dummyData.length} transactions.`);
  return dummyData;
}
