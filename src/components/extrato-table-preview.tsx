
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryDropdown } from "./category-dropdown" // Reuse category dropdown
import { CheckCircle, Save, Trash2, AlertCircle } from "lucide-react"
import type { ParsedTransaction } from "@/services/pdf-parser"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"


// Dummy Categories - Replace with actual data hook
const dummyCategories = [
    { id: 'uncat', name: 'Uncategorized', type: 'expense' },
    { id: 'cat1', name: 'Mercado', type: 'expense' },
    { id: 'cat2', name: 'Luxos', type: 'expense' },
    { id: 'cat3', name: 'Farmácia', type: 'expense' },
    { id: 'cat4', name: 'Transporte', type: 'expense' },
    { id: 'cat5', name: 'Salário', type: 'income' },
    { id: 'cat6', name: 'Investimentos', type: 'investment' },
    { id: 'cat7', name: 'Poupança Viagem', type: 'saving' },
];

interface ExtratoTablePreviewProps {
  transactions: ParsedTransaction[]
  onSave: (transactions: ParsedTransaction[]) => void // Callback to save finalized data
}

export function ExtratoTablePreview({ transactions, onSave }: ExtratoTablePreviewProps) {
  const [editableTransactions, setEditableTransactions] = React.useState<ParsedTransaction[]>([]);
  const [categories, setCategories] = React.useState(dummyCategories); // TODO: Use useCategories hook

   React.useEffect(() => {
     // Initialize editable state with an 'uncategorized' category ID
      const uncategorizedId = categories.find(c => c.name === 'Uncategorized')?.id ?? 'uncat'; // Fallback ID
      setEditableTransactions(
        transactions.map(tx => ({ ...tx, category_id: uncategorizedId })) // Add category_id
      );
    }, [transactions, categories]);


  const handleFieldChange = (index: number, field: keyof ParsedTransaction, value: string | number) => {
    const updatedTransactions = [...editableTransactions];
    // Type assertion needed because TS doesn't know 'field' corresponds to the type of 'value'
    (updatedTransactions[index] as any)[field] = value;
    setEditableTransactions(updatedTransactions);
  }

   const handleCategoryChange = (index: number, categoryId: string) => {
      const updatedTransactions = [...editableTransactions];
      updatedTransactions[index].category_id = categoryId;
      setEditableTransactions(updatedTransactions);
    };


  const handleDeleteRow = (index: number) => {
    if (window.confirm('Are you sure you want to remove this transaction before saving?')) {
      const updatedTransactions = editableTransactions.filter((_, i) => i !== index);
      setEditableTransactions(updatedTransactions);
    }
  }

   const handleAddNewCategory = (newCategoryName: string) => {
       // TODO: Implement API call to add category and update the categories list
       console.log("Add new category from preview:", newCategoryName);
       alert(`"${newCategoryName}" category added (simulated). Refresh needed to see in list.`);
   }


  const handleFinalSave = () => {
    // Add final validation if needed (e.g., ensure all are categorized)
     const hasUncategorized = editableTransactions.some(tx => tx.category_id === 'uncat');
      if (hasUncategorized) {
        if (!window.confirm("Some transactions are still 'Uncategorized'. Save anyway?")) {
          return; // Abort save
        }
      }

     // Map category IDs back to names before saving, or adjust backend
     const finalData = editableTransactions.map(tx => {
         const category = categories.find(c => c.id === tx.category_id);
         return {
             ...tx,
             // Optionally replace category_id with category name if backend expects name
             // category: category ? category.name : 'Uncategorized',
             // remove category_id if not needed
         };
     });

    onSave(finalData);
  }

  return (
     <Card>
       <CardHeader>
          <CardTitle>Review Extracted Transactions</CardTitle>
           <CardDescription>Verify the extracted data and assign categories before saving. You can edit or remove transactions.</CardDescription>
       </CardHeader>
       <CardContent>
           <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[200px]">Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editableTransactions.length > 0 ? (
                    editableTransactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            type="date" // Allow editing date if needed
                            value={transaction.date}
                            onChange={(e) => handleFieldChange(index, 'date', e.target.value)}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={transaction.description}
                            onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                           <CategoryDropdown
                               categories={categories}
                               value={transaction.category_id || ''} // Use category_id state
                               onChange={(catId) => handleCategoryChange(index, catId)}
                               onAddNewCategory={handleAddNewCategory}
                           />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            step="0.01"
                            value={transaction.amount}
                            onChange={(e) => handleFieldChange(index, 'amount', parseFloat(e.target.value))}
                            className={`h-8 text-right ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteRow(index)}>
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
            {editableTransactions.some(tx => tx.category_id === 'uncat') && (
               <p className="text-sm text-amber-600 mt-4 flex items-center gap-1">
                 <AlertCircle className="h-4 w-4" /> Some transactions are still 'Uncategorized'. Please assign categories for accurate reporting.
               </p>
             )}
       </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleFinalSave} disabled={editableTransactions.length === 0}>
             <Save className="mr-2 h-4 w-4" /> Save All Transactions
          </Button>
        </CardFooter>
     </Card>
  )
}
