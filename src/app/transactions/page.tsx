'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/date-picker-range'; // Assume this component exists or create it
import { AddTransactionModal } from '@/components/add-transaction-modal'; // Assume this component exists or create it
import { PlusCircle, Filter, Edit, Trash2 } from 'lucide-react';
import type { DateRange } from "react-day-picker"

// Dummy Data - Replace with actual data fetching and state management
const dummyTransactions = [
  { id: '1', date: '2024-06-15', amount: -55.30, category: 'Mercado', paymentMethod: 'db', description: 'Groceries at Pão de Açúcar' },
  { id: '2', date: '2024-06-14', amount: -120.00, category: 'Luxos', paymentMethod: 'cg', description: 'Dinner at Outback' },
  { id: '3', date: '2024-06-13', amount: 3500.00, category: 'Salário', paymentMethod: 'pb', description: 'Monthly Salary' },
  { id: '4', date: '2024-06-12', amount: -35.80, category: 'Farmácia', paymentMethod: 'db', description: 'Medicine at Droga Raia' },
  { id: '5', date: '2024-06-10', amount: -70.00, category: 'Transporte', paymentMethod: 'dg', description: 'Uber rides' },
];

// Dummy Categories - Replace with actual data
const dummyCategories = [
    { id: 'cat1', name: 'Mercado', type: 'expense' },
    { id: 'cat2', name: 'Luxos', type: 'expense' },
    { id: 'cat3', name: 'Farmácia', type: 'expense' },
    { id: 'cat4', name: 'Transporte', type: 'expense' },
    { id: 'cat5', name: 'Salário', type: 'income' },
    { id: 'cat6', name: 'Investimentos', type: 'investment' },
    { id: 'cat7', name: 'Poupança Viagem', type: 'saving' },
];

const paymentMethodMap = {
    db: 'Débito',
    pb: 'PIX/Boleto',
    cg: 'Crédito',
    dg: 'Dinheiro',
};

type PaymentMethodKey = keyof typeof paymentMethodMap;


export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [transactions, setTransactions] = React.useState(dummyTransactions); // TODO: Use hook like useTransactions()
  const [categories, setCategories] = React.useState(dummyCategories); // TODO: Use hook like useCategories()
  const [editingTransaction, setEditingTransaction] = React.useState<any>(null); // State for editing

  // Filters State
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<DateRange | undefined>(undefined);
  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState<string>('all');

   // TODO: Implement filtering logic based on state variables
   const filteredTransactions = transactions.filter(tx => {
     const categoryMatch = categoryFilter === 'all' || tx.category === categoryFilter;
     const paymentMatch = paymentMethodFilter === 'all' || tx.paymentMethod === paymentMethodFilter;
     const dateMatch = !dateFilter || !dateFilter.from || !dateFilter.to || (new Date(tx.date) >= dateFilter.from && new Date(tx.date) <= dateFilter.to);
     return categoryMatch && paymentMatch && dateMatch;
   });

  const handleAddTransaction = (newTransaction: any) => {
      // TODO: Call API to save transaction
      console.log('Adding transaction:', newTransaction);
      // Optimistically update UI or refetch
      setTransactions(prev => [...prev, { ...newTransaction, id: String(Date.now()) }]); // Dummy ID generation
  };

   const handleEditTransaction = (transaction: any) => {
     setEditingTransaction(transaction);
     setIsModalOpen(true);
   };

   const handleDeleteTransaction = (id: string) => {
      // TODO: Call API to delete transaction
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        console.log('Deleting transaction:', id);
        setTransactions(prev => prev.filter(tx => tx.id !== id));
      }
    };


  const handleSaveEdit = (updatedTransaction: any) => {
     // TODO: Call API to update transaction
     console.log('Updating transaction:', updatedTransaction);
     setTransactions(prev => prev.map(tx => tx.id === updatedTransaction.id ? updatedTransaction : tx));
     setEditingTransaction(null); // Clear editing state
   };


  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <Button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card">
        <h2 className="text-lg font-medium flex items-center gap-2 mb-2 md:mb-0 md:mr-4">
          <Filter className="h-5 w-5" /> Filters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
           <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Replace with actual DateRangePicker */}
            {/* <DatePickerWithRange onDateChange={setDateFilter} /> */}
             <Input type="text" placeholder="Date Range (placeholder)" disabled/>


            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Methods</SelectItem>
                 {Object.entries(paymentMethodMap).map(([key, value]) => (
                   <SelectItem key={key} value={key}>{value}</SelectItem>
                 ))}
              </SelectContent>
            </Select>
        </div>
      </div>


      {/* Transactions Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{paymentMethodMap[transaction.paymentMethod as PaymentMethodKey] || transaction.paymentMethod}</TableCell>
                  <TableCell className={`text-right font-semibold ${transaction.amount >= 0 ? 'text-accent-foreground' : 'text-destructive'}`}>
                    R$ {transaction.amount.toFixed(2)}
                  </TableCell>
                   <TableCell className="text-center space-x-2">
                     <Button variant="ghost" size="icon" onClick={() => handleEditTransaction(transaction)}>
                       <Edit className="h-4 w-4" />
                       <span className="sr-only">Edit</span>
                     </Button>
                     <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteTransaction(transaction.id)}>
                       <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Delete</span>
                     </Button>
                   </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       <AddTransactionModal
         isOpen={isModalOpen}
         onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
         onSave={editingTransaction ? handleSaveEdit : handleAddTransaction}
         categories={categories}
         transactionData={editingTransaction} // Pass existing data if editing
         paymentMethods={paymentMethodMap}
       />
    </div>
  );
}

