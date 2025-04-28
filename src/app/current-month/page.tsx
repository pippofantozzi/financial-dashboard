'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { ExtratoTablePreview } from '@/components/extrato-table-preview'; // Assume this component exists
import { parsePdf, type ParsedTransaction } from '@/services/pdf-parser'; // Import the parser service
import { useToast } from '@/hooks/use-toast';

export default function CurrentMonthPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [parsedTransactions, setParsedTransactions] = React.useState<ParsedTransaction[]>([]);
  const [isParsing, setIsParsing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setParsedTransactions([]); // Clear previous results
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Please select a valid PDF file.');
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
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
      // Simulate parsing delay and call the actual parser
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network/processing time
      const results = await parsePdf(selectedFile); // Call your PDF parsing function
      setParsedTransactions(results);
       toast({
          title: "Parsing Successful",
          description: `${results.length} transactions extracted. Review and categorize below.`,
       });
    } catch (err) {
      console.error('Error parsing PDF:', err);
      setError('Failed to parse the PDF file. Please ensure it\'s a compatible bank statement.');
      toast({
        title: "Parsing Failed",
        description: "Could not extract transactions from the PDF.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

   const handleSaveTransactions = (finalTransactions: ParsedTransaction[]) => {
      // TODO: Implement API call to save these transactions to the database
      console.log('Saving finalized transactions:', finalTransactions);
       toast({
           title: "Transactions Saved!",
           description: `${finalTransactions.length} transactions have been added to your records.`,
           variant: "default", // Use default or success style
         });
       // Optionally clear state after saving
       setSelectedFile(null);
       setParsedTransactions([]);
       if (fileInputRef.current) {
         fileInputRef.current.value = ''; // Reset file input
       }
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
          />
          <Button onClick={handleUploadClick} variant="outline" size="lg" className="w-full md:w-auto">
            <Upload className="mr-2 h-5 w-5" /> Choose PDF File
          </Button>

          {selectedFile && (
            <div className="text-center text-sm text-muted-foreground mt-2">
              <FileText className="inline-block mr-1 h-4 w-4" />
              Selected: {selectedFile.name}
            </div>
          )}

          {selectedFile && !isParsing && parsedTransactions.length === 0 && (
            <Button onClick={handleParseFile} disabled={isParsing} className="w-full md:w-auto">
              {isParsing ? 'Parsing...' : 'Parse File'}
            </Button>
          )}

          {isParsing && (
             <div className="flex items-center justify-center space-x-2 mt-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span>Parsing PDF...</span>
             </div>
          )}


          {error && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4"/> {error}
            </p>
          )}
        </CardContent>
      </Card>

      {parsedTransactions.length > 0 && (
        <ExtratoTablePreview
          transactions={parsedTransactions}
          onSave={handleSaveTransactions}
        />
      )}
    </div>
  );
}
