
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { CategoryDropdown } from './category-dropdown'; // Assuming this component exists

// Validation Schema
const transactionFormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  amount: z.coerce.number({ invalid_type_error: "Amount must be a number." }).positive("Amount must be positive for income/savings").or(z.coerce.number().negative("Amount must be negative for expenses")), // Allow positive or negative, refine later based on category type if needed
  category_id: z.string().min(1, "Category is required."),
  payment_method: z.string().min(1, "Payment method is required."),
  description: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof transactionFormSchema>

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: TransactionFormValues) => void
  categories: { id: string; name: string; type: string }[] // Pass categories for the dropdown
  paymentMethods: { [key: string]: string }
  transactionData?: any // Optional data for editing
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onSave,
  categories,
  paymentMethods,
  transactionData,
}: AddTransactionModalProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: transactionData?.date ? new Date(transactionData.date) : new Date(),
      amount: transactionData?.amount ?? undefined, // Use undefined for placeholder
      category_id: transactionData?.category_id ?? '', // Assuming category is passed by ID if editing
      payment_method: transactionData?.paymentMethod ?? '',
      description: transactionData?.description ?? '',
    },
  })

  React.useEffect(() => {
    if (transactionData) {
       // Find category ID based on name if necessary, or assume ID is passed
       const category = categories.find(c => c.name === transactionData.category);
      form.reset({
        date: new Date(transactionData.date),
        amount: transactionData.amount,
        category_id: category?.id ?? '', // Reset with the ID
        payment_method: transactionData.paymentMethod,
        description: transactionData.description,
      });
    } else {
      form.reset({ // Reset to default empty state when adding new
        date: new Date(),
        amount: undefined,
        category_id: '',
        payment_method: '',
        description: '',
      });
    }
  }, [transactionData, form, categories]);


  const onSubmit = (data: TransactionFormValues) => {
     // Map category ID back to name if needed by parent, or adjust parent to accept ID
     const categoryName = categories.find(c => c.id === data.category_id)?.name;
     const saveData = {
         ...data,
         id: transactionData?.id, // Include ID if editing
         category: categoryName, // Pass name back for display consistency, adjust if needed
         date: format(data.date, 'yyyy-MM-dd'), // Format date before saving
     };
    onSave(saveData as any); // Cast needed if structure differs slightly
    onClose(); // Close modal after saving
  }

  const handleAddNewCategory = (newCategoryName: string) => {
      // TODO: Implement API call to add category and update the categories list
      console.log("Add new category:", newCategoryName);
      // Example: Update state/refetch categories
      // For now, just log it.
      alert(`"${newCategoryName}" category added (simulated). Refresh needed to see in list.`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                               "w-full pl-3 text-left font-normal",
                               !field.value && "text-muted-foreground"
                             )}
                           >
                             {field.value ? (
                               format(field.value, "PPP")
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
                    <Input type="number" step="0.01" placeholder="e.g., -55.30 or 3500.00" {...field} />
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
                    <CategoryDropdown
                       categories={categories}
                       value={field.value}
                       onChange={field.onChange}
                       onAddNewCategory={handleAddNewCategory}
                     />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

