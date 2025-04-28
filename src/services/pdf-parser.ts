/**
 * Represents a parsed transaction extracted from a PDF.
 */
export interface ParsedTransaction {
  /**
   * The date of the transaction.
   */
  date: string;
  /**
   * The description of the transaction.
   */
  description: string;
  /**
   * The amount of the transaction.
   */
  amount: number;
}

/**
 * Asynchronously parses a PDF file and extracts transaction data.
 *
 * @param file The PDF file to parse.
 * @returns A promise that resolves to an array of ParsedTransaction objects.
 */
export async function parsePdf(file: File): Promise<ParsedTransaction[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      date: '2024-01-01',
      description: 'Example Transaction',
      amount: 100,
    },
  ];
}