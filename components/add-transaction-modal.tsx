
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Textarea } from "./ui/textarea"

// Type definitions matching page state
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
    payment_method: string;
    description?: string;
};

// Validation Schema - Align with Transaction type
const transactionFormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  amount: z.coerce.number({ invalid_type_error: "Amount must be a number." })
           .refine(val => val !== 0, { message: "Amount cannot be zero." }), // Ensure non-zero amount
  category_id: z.string().min(1, "Category is required."),
  payment_method: z.string().min(1, "Payment method is required."),
  description: z.string().optional(),
});

// Infer type from Zod schema, excluding the 'id' which is handled separately
type TransactionFormValues = Omit<Transaction, 'id' | 'date'> & { date: Date };


interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Transaction | Omit<Transaction, 'id'>) => void // Adjusted to handle both add and edit
  categories: Category[]
  paymentMethods: { [key: string]: string }
  transactionData?: Transaction | null // Use Transaction type for editing data
  onAddNewCategory: (name: string, type?: Category['type']) => string; // Callback to add category and get ID
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onSave,
  categories,
  paymentMethods,
  transactionData,
  onAddNewCategory,
}: AddTransactionModalProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    // Set default values based on whether we are editing or adding
    defaultValues: transactionData
      ? {
          date: new Date(transactionData.date + 'T00:00:00'), // Parse string date
          amount: transactionData.amount,
          category_id: transactionData.category_id,
          payment_method: transactionData.payment_method,
          description: transactionData.description ?? '',
        }
      : {
          date: new Date(),
          amount: undefined, // Use undefined for placeholder to show
          category_id: '',
          payment_method: '',
          description: '',
        },
  });

  // Reset form when transactionData changes (e.g., opening modal for edit/add)
  React.useEffect(() => {
    if (isOpen) {
      if (transactionData) {
        form.reset({
          date: new Date(transactionData.date + 'T00:00:00'),
          amount: transactionData.amount,
          category_id: transactionData.category_id,
          payment_method: transactionData.payment_method,
          description: transactionData.description ?? '',
        });
      } else {
        form.reset({
          date: new Date(),
          amount: undefined,
          category_id: '',
          payment_method: '',
          description: '',
        });
      }
    }
  }, [transactionData, isOpen, form]);


  const onSubmit = (data: TransactionFormValues) => {
     const formattedDate = format(data.date, 'yyyy-MM-dd'); // Format date to string
     const saveData: Transaction | Omit<Transaction, 'id'> = {
         ...data,
         date: formattedDate,
         description: data.description?.trim() || undefined, // Save undefined if empty/whitespace
         ...(transactionData && { id: transactionData.id }), // Include ID only if editing
     };
     onSave(saveData);
     onClose(); // Close modal after saving
  };

  // Handler for adding new categories
  const handleDropdownAddNewCategory = (newCategoryName: string) => {
       // For simplicity, default new categories to 'expense'. Could add a type selector if needed.
       const newCategoryId = onAddNewCategory(newCategoryName, 'expense');
       // Automatically select the newly added category in the form
       form.setValue('category_id', newCategoryId, { shouldValidate: true });
       return newCategoryId;
   };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transactionData ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
          <DialogDescription>
             {transactionData ? 'Update the details of your transaction.' : 'Fill in the details of your new transaction.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                   <Popover>
                       <PopoverTrigger asChild>
                         <FormControl>
                           <Button
                             variant={"outline"}
                             className={cn(
                               "w-full justify-start text-left font-normal",
                               !field.value && "text-muted-foreground"
                             )}
                           >
                             {field.value ? (
                               format(field.value, "PPP") // Format for display: e.g., Jun 15th, 2024
                             ) : (
                               <span>Pick a date</span>
                             )}
                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                           </Button>
                         </FormControl>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0" align="start">
                         <Calendar
                           mode="single"
                           selected={field.value}
                           onSelect={field.onChange}
                           disabled={(date) =>
                             date > new Date() || date < new Date("1900-01-01")
                           }
                           initialFocus
                         />
                       </PopoverContent>
                     </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (R$)</FormLabel>
                  <FormControl>
                     {/* Use text input for better control over positive/negative */}
                    <Input
                        type="text"
                        placeholder="e.g., -55.30 or 3500.00"
                        {...field}
                        onChange={(e) => {
                           // Allow only numbers, minus sign at the start, and one decimal point
                           const value = e.target.value;
                           if (/^-?\d*\.?\d{0,2}$/.test(value) || value === '' || value === '-') {
                             field.onChange(value); // Store as string temporarily
                           }
                         }}
                         onBlur={(e) => {
                            // Convert to number on blur for validation
                            field.onChange(parseFloat(e.target.value) || 0);
                            field.onBlur(); // Trigger validation
                         }}
                         // Display the numeric value from the form state if it exists
                         value={field.value === undefined ? '' : String(field.value)}
                       />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           <FormField
               control={form.control}
               name="category_id"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Category</FormLabel>
                   <div className="relative">
                     <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select category" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {categories.map((category) => (
                           <SelectItem key={category.id} value={category.id}>
                             {category.name}
                           </SelectItem>
                         ))}
                         <SelectItem value="new-category" className="text-primary font-medium">
                           + Add new category
                         </SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   {field.value === "new-category" && (
                     <div className="mt-2 flex gap-2">
                       <Input 
                         placeholder="New category name"
                         className="flex-1"
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                             e.preventDefault();
                             const input = e.currentTarget;
                             if (input.value.trim()) {
                               const newCategoryId = handleDropdownAddNewCategory(input.value);
                               input.value = '';
                             }
                           }
                         }}
                       />
                       <Button 
                         type="button" 
                         size="sm"
                         onClick={(e) => {
                           const input = e.currentTarget.previousSibling as HTMLInputElement;
                           if (input?.value?.trim()) {
                             const newCategoryId = handleDropdownAddNewCategory(input.value);
                             input.value = '';
                           }
                         }}
                       >
                         Add
                       </Button>
                     </div>
                   )}
                   <FormMessage />
                 </FormItem>
               )}
             />


            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(paymentMethods).map(([key, value]) => (
                         <SelectItem key={key} value={key}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Description (Optional)</FormLabel>
                   <FormControl>
                     <Textarea
                       placeholder="Add a short note..."
                       className="resize-none"
                       {...field}
                       value={field.value ?? ''} // Ensure value is never null/undefined for textarea
                     />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />


            <DialogFooter>
               <DialogClose asChild>
                   <Button type="button" variant="outline">Cancel</Button>
               </DialogClose>
              <Button type="submit">{transactionData ? 'Save Changes' : 'Add Transaction'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
