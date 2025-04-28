
 'use client';

 import * as React from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
 import { ExtratoTablePreview } from '@/components/extrato-table-preview'; // Assume this component exists
 import { parsePdf, type ParsedTransaction as ExternalParsedTransaction } from '@/services/pdf-parser'; // Import the parser service
 import { useToast } from '@/hooks/use-toast';
 import { v4 as uuidv4 } from 'uuid';


 // --- Shared State Management (Simulated - replace with context/global state later) ---
 type Category = {
     id: string;
     name: string;
     type: 'expense' | 'income' | 'investment' | 'saving';
 };

 type Transaction = {
     id: string;
     date: string; // YYYY-MM-DD
     amount: number;
     category_id: string;
     payment_method: string; // Assuming this will be added later or defaulted
     description?: string;
 };

 // Combine parsed data with required fields for internal Transaction type
 interface FullParsedTransaction extends ExternalParsedTransaction {
   id: string;
   category_id: string;
 }


 const initialCategories: Category[] = [
     { id: 'uncat', name: 'Uncategorized', type: 'expense' },
     { id: uuidv4(), name: 'Mercado', type: 'expense' },
     { id: uuidv4(), name: 'Luxos', type: 'expense' },
     { id: uuidv4(), name: 'Farmácia', type: 'expense' },
     { id: uuidv4(), name: 'Transporte', type: 'expense' },
     { id: uuidv4(), name: 'Salário', type: 'income' },
     { id: uuidv4(), name: 'Investimentos', type: 'investment' },
     { id: uuidv4(), name: 'Poupança Viagem', type: 'saving' },
 ];
 // --- End Shared State ---

 export default function CurrentMonthPage() {
   const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
   const [parsedTransactions, setParsedTransactions] = React.useState<ExternalParsedTransaction[]>([]); // Raw parsed data
   const [isParsing, setIsParsing] = React.useState(false);
   const [error, setError] = React.useState<string | null>(null);
   const fileInputRef = React.useRef<HTMLInputElement>(null);
   const { toast } = useToast();

   // Manage categories and transactions in this page's state (for now)
   const [categories, setCategories] = React.useState<Category[]>(initialCategories);
   const [allTransactions, setAllTransactions] = React.useState<Transaction[]>([]); // Store all saved transactions

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     const file = event.target.files?.[0];
     if (file && file.type === 'application/pdf') {
       setSelectedFile(file);
       setParsedTransactions([]); // Clear previous preview results
       setError(null);
     } else {
       setSelectedFile(null);
        setError('Please select a valid PDF file.');
        if (file) { // Only toast if a file was selected but was wrong type
             toast({
                 title: "Invalid File Type",
                 description: "Please upload a PDF file.",
                 variant: "destructive",
             });
        }
     }
   };

   const handleUploadClick = () => {
     fileInputRef.current?.click();
   };

   const handleParseFile = async () => {
     if (!selectedFile) return;

     setIsParsing(true);
     setError(null);
     setParsedTransactions([]);

     try {
       // Call the PDF parsing service/API
       // Replace dummy data with actual API call result
       // For now, using dummy data:
       await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
       const dummyResults: ExternalParsedTransaction[] = [
           { date: '2024-07-01', description: 'Coffee Shop', amount: -15.50 },
           { date: '2024-07-02', description: 'Supermarket Run', amount: -180.75 },
           { date: '2024-07-03', description: 'Salary Deposit', amount: 4500.00 },
           { date: '2024-07-03', description: 'Online Subscription', amount: -29.99 },
       ];
       // const results = await parsePdf(selectedFile); // Actual call
       setParsedTransactions(dummyResults); // Set the raw parsed data
        toast({
           title: "Parsing Successful",
           description: `${dummyResults.length} potential transactions extracted. Review and categorize below.`,
        });
     } catch (err) {
       console.error('Error parsing PDF:', err);
       setError('Failed to parse the PDF file. Please ensure it\'s a compatible bank statement or try again.');
       toast({
         title: "Parsing Failed",
         description: err instanceof Error ? err.message : "Could not extract transactions from the PDF.",
         variant: "destructive",
       });
     } finally {
       setIsParsing(false);
     }
   };

    // Handler passed to ExtratoTablePreview to save finalized transactions
    const handleSaveTransactions = (finalTransactions: FullParsedTransaction[]) => {
       const newTransactions: Transaction[] = finalTransactions.map(tx => ({
           id: tx.id, // Keep the ID generated in the preview table
           date: tx.date,
           amount: tx.amount,
           category_id: tx.category_id,
           description: tx.description,
           payment_method: 'pdf_upload', // Default payment method for uploads? Or make selectable?
       }));

       // Add the newly confirmed transactions to the main list
       setAllTransactions(prev => [...newTransactions, ...prev]);

        toast({
            title: "Transactions Saved!",
            description: `${newTransactions.length} transactions have been added to your records.`,
            variant: "default",
          });

        // Clear the upload state
        setSelectedFile(null);
        setParsedTransactions([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input visually
        }
    };

    // Handler passed to ExtratoTablePreview for adding new categories
    const handleAddNewCategory = (name: string, type: Category['type'] = 'expense'): string => {
        const trimmedName = name.trim();
        const exists = categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase());
        if (exists) {
            toast({ title: "Category Exists", description: `Category "${trimmedName}" already exists.`, variant: "destructive" });
            return categories.find(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())!.id; // Return existing ID
        }
        const newCategory: Category = { id: uuidv4(), name: trimmedName, type };
        setCategories(prev => [...prev, newCategory]);
        toast({ title: "Category Added", description: `Category "${newCategory.name}" created.` });
        return newCategory.id; // Return the new ID
    };


   return (
     <div className="flex flex-col gap-6 p-4 md:p-6">
       <h1 className="text-2xl font-semibold">Upload Bank Statement (Extrato)</h1>

       <Card>
         <CardHeader>
           <CardTitle>Upload PDF</CardTitle>
           <CardDescription>Select your bank statement PDF to automatically extract transactions.</CardDescription>
         </CardHeader>
         <CardContent className="flex flex-col items-center gap-4">
           <Input
             ref={fileInputRef}
             type="file"
             accept="application/pdf"
             onChange={handleFileChange}
             className="hidden"
             id="pdf-upload"
             aria-labelledby="upload-label"
           />
           <Button onClick={handleUploadClick} variant="outline" size="lg" className="w-full md:w-auto" id="upload-label">
             <Upload className="mr-2 h-5 w-5" /> Choose PDF File
           </Button>

           {selectedFile && (
             <div className="text-center text-sm text-muted-foreground mt-2">
               <FileText className="inline-block mr-1 h-4 w-4" />
               Selected: {selectedFile.name} ({ (selectedFile.size / 1024).toFixed(1)} KB)
             </div>
           )}

           {/* Show Parse button only if a file is selected and not currently parsing AND no transactions are parsed yet */}
           {selectedFile && !isParsing && parsedTransactions.length === 0 && (
             <Button onClick={handleParseFile} disabled={isParsing} className="w-full md:w-auto mt-2">
                Parse File
             </Button>
           )}

           {isParsing && (
              <div className="flex items-center justify-center space-x-2 mt-4 text-muted-foreground">
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                 <span>Parsing PDF, please wait...</span>
              </div>
           )}

           {error && (
             <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                 <AlertTriangle className="h-4 w-4"/> {error}
             </p>
           )}
         </CardContent>
       </Card>

       {/* Display the preview table only when there are parsed transactions */}
       {parsedTransactions.length > 0 && !isParsing && (
         <ExtratoTablePreview
           transactions={parsedTransactions}
           onSave={handleSaveTransactions}
           availableCategories={categories} // Pass current categories
           onAddNewCategory={handleAddNewCategory} // Pass handler to add new categories
         />
       )}

        {/* Optional: Display recently added transactions for confirmation */}
       {/* {allTransactions.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recently Added Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                 <ul>
                   {allTransactions.slice(0, 5).map(tx => ( // Show last 5 added
                     <li key={tx.id}>{tx.date} - {tx.description} - R$ {tx.amount.toFixed(2)}</li>
                   ))}
                 </ul>
              </CardContent>
            </Card>
        )} */}

     </div>
   );
 }
