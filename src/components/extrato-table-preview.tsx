
 "use client"

 import * as React from "react"
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table"
 import { Button } from "@/components/ui/button"
 import { Input } from "@/components/ui/input"
 import { CategoryDropdown } from "./category-dropdown" // Reuse category dropdown
 import { Save, Trash2, AlertCircle } from "lucide-react"
 import type { ParsedTransaction as ExternalParsedTransaction } from "@/services/pdf-parser" // Rename to avoid conflict
 import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
 import { useToast } from "@/hooks/use-toast";
 import { v4 as uuidv4 } from 'uuid';


 // --- Internal State Management ---
 // These would typically come from a global state/context or props
 type Category = {
     id: string;
     name: string;
     type: 'expense' | 'income' | 'investment' | 'saving';
 };

 const initialCategories: Category[] = [
     { id: 'uncat', name: 'Uncategorized', type: 'expense' }, // Keep Uncategorized separate
     { id: uuidv4(), name: 'Mercado', type: 'expense' },
     { id: uuidv4(), name: 'Luxos', type: 'expense' },
     { id: uuidv4(), name: 'Farmácia', type: 'expense' },
     { id: uuidv4(), name: 'Transporte', type: 'expense' },
     { id: uuidv4(), name: 'Salário', type: 'income' },
     { id: uuidv4(), name: 'Investimentos', type: 'investment' },
     { id: uuidv4(), name: 'Poupança Viagem', type: 'saving' },
 ];
 // --- End Internal State Management ---


// Define the internal transaction type including category_id
interface ParsedTransaction extends ExternalParsedTransaction {
   id: string; // Add a unique ID for key prop and editing
   category_id: string;
}

 interface ExtratoTablePreviewProps {
   transactions: ExternalParsedTransaction[]; // Incoming transactions from parser
   onSave: (transactions: ParsedTransaction[]) => void; // Callback to save finalized data
   // Pass categories and handlers from the parent page for consistency
   availableCategories: Category[];
   onAddNewCategory: (name: string, type?: Category['type']) => string; // Function to add category in parent state
 }

 export function ExtratoTablePreview({
     transactions,
     onSave,
     availableCategories, // Use categories from props
     onAddNewCategory
 }: ExtratoTablePreviewProps) {
   const [editableTransactions, setEditableTransactions] = React.useState<ParsedTransaction[]>([]);
   const { toast } = useToast();
   const uncategorizedId = availableCategories.find(c => c.name === 'Uncategorized')?.id ?? 'uncat';

    React.useEffect(() => {
      // Initialize editable state with a unique ID and 'uncategorized' category ID
       setEditableTransactions(
         transactions.map(tx => ({
             ...tx,
             id: uuidv4(), // Assign a unique ID for local state management/key prop
             category_id: uncategorizedId
         }))
       );
     }, [transactions, uncategorizedId]);


   const handleFieldChange = (id: string, field: keyof ParsedTransaction, value: string | number) => {
     setEditableTransactions(prev =>
       prev.map(tx => (tx.id === id ? { ...tx, [field]: value } : tx))
     );
   }

    const handleCategoryChange = (id: string, categoryId: string) => {
       setEditableTransactions(prev =>
         prev.map(tx => (tx.id === id ? { ...tx, category_id: categoryId } : tx))
       );
     };


   const handleDeleteRow = (id: string) => {
     if (window.confirm('Are you sure you want to remove this transaction before saving?')) {
       setEditableTransactions(prev => prev.filter(tx => tx.id !== id));
       toast({ title: "Transaction Removed", description: "The row has been removed from the preview." });
     }
   }

    // Handler for the CategoryDropdown's add functionality within this component
    const handleDropdownAddNewCategory = (newCategoryName: string) => {
        const newCategoryId = onAddNewCategory(newCategoryName, 'expense'); // Call parent's handler
        // No need to set value here, parent state update will trigger re-render with new category
    };


   const handleFinalSave = () => {
      const hasUncategorized = editableTransactions.some(tx => tx.category_id === uncategorizedId || !tx.category_id);
       if (hasUncategorized) {
         if (!window.confirm("Some transactions are still 'Uncategorized'. Do you want to save them anyway?")) {
           toast({ title: "Save Cancelled", description: "Assign categories to all transactions before saving.", variant: "default" });
           return; // Abort save
         }
       }

     // Optional: Map category IDs back to names if needed, otherwise pass IDs
     const finalData = editableTransactions.map(tx => {
          // Keep category_id, the consuming page/API should handle it
          return { ...tx };
      });

     onSave(finalData); // Pass the finalized data (with category_id)
   }

   return (
      <Card>
        <CardHeader>
           <CardTitle>Review Extracted Transactions</CardTitle>
            <CardDescription>Verify the extracted data and assign categories before saving. You can edit or remove transactions.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Date</TableHead>
                     <TableHead>Description</TableHead>
                     <TableHead className="min-w-[200px]">Category</TableHead> {/* Ensure enough width */}
                     <TableHead className="text-right">Amount</TableHead>
                     <TableHead className="text-center px-2">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {editableTransactions.length > 0 ? (
                     editableTransactions.map((transaction) => (
                       <TableRow key={transaction.id}>
                         <TableCell>
                           <Input
                             type="date" // Allow editing date if needed
                             value={transaction.date}
                             onChange={(e) => handleFieldChange(transaction.id, 'date', e.target.value)}
                             className="h-9 text-sm" // Smaller input
                           />
                         </TableCell>
                         <TableCell>
                           <Input
                             value={transaction.description}
                             onChange={(e) => handleFieldChange(transaction.id, 'description', e.target.value)}
                             className="h-9 text-sm"
                           />
                         </TableCell>
                         <TableCell>
                            {/* Use availableCategories from props */}
                            <CategoryDropdown
                                categories={availableCategories}
                                value={transaction.category_id || ''}
                                onChange={(catId) => handleCategoryChange(transaction.id, catId)}
                                onAddNewCategory={handleDropdownAddNewCategory} // Connect to handler
                                placeholder="Assign Category"
                            />
                         </TableCell>
                         <TableCell className="text-right">
                           <Input
                             type="number"
                             step="0.01"
                             value={transaction.amount}
                             onChange={(e) => handleFieldChange(transaction.id, 'amount', parseFloat(e.target.value))}
                             className={cn(
                                "h-9 text-sm text-right", // Smaller input, right aligned
                                transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                              )}
                           />
                         </TableCell>
                         <TableCell className="text-center px-1">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80" onClick={() => handleDeleteRow(transaction.id)}>
                             <Trash2 className="h-4 w-4" />
                             <span className="sr-only">Delete Row</span>
                           </Button>
                         </TableCell>
                       </TableRow>
                     ))
                   ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No transactions to preview. Upload a PDF first.
                        </TableCell>
                      </TableRow>
                    )}
                 </TableBody>
               </Table>
            </div>
             {editableTransactions.some(tx => tx.category_id === uncategorizedId) && (
                <p className="text-sm text-amber-600 mt-4 flex items-center gap-1 px-1">
                  <AlertCircle className="h-4 w-4" /> Some transactions are still 'Uncategorized'. Please assign categories.
                </p>
              )}
        </CardContent>
         <CardFooter className="justify-end border-t pt-4">
           <Button onClick={handleFinalSave} disabled={editableTransactions.length === 0}>
              <Save className="mr-2 h-4 w-4" /> Save All Transactions
           </Button>
         </CardFooter>
      </Card>
   )
 }
