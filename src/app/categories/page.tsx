
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Dummy Data - Replace with actual data fetching and state management (e.g., useCategories hook)
const dummyCategories = [
    { id: 'cat1', name: 'Mercado', type: 'expense' },
    { id: 'cat2', name: 'Luxos', type: 'expense' },
    { id: 'cat3', name: 'Farmácia', type: 'expense' },
    { id: 'cat4', name: 'Transporte', type: 'expense' },
    { id: 'cat5', name: 'Salário', type: 'income' },
    { id: 'cat6', name: 'Investimentos', type: 'investment' },
    { id: 'cat7', name: 'Poupança Viagem', type: 'saving' },
];

const categoryTypes = ['expense', 'income', 'investment', 'saving'];

export default function CategoriesPage() {
    const [categories, setCategories] = React.useState(dummyCategories); // TODO: Replace with useCategories hook
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingCategory, setEditingCategory] = React.useState<any>(null);
    const [newCategoryName, setNewCategoryName] = React.useState('');
    const [newCategoryType, setNewCategoryType] = React.useState<string>('expense');
    const { toast } = useToast();

    const openAddModal = () => {
        setEditingCategory(null);
        setNewCategoryName('');
        setNewCategoryType('expense');
        setIsModalOpen(true);
    };

    const openEditModal = (category: any) => {
        setEditingCategory(category);
        setNewCategoryName(category.name);
        setNewCategoryType(category.type);
        setIsModalOpen(true);
    };

    const handleSaveCategory = () => {
        if (!newCategoryName.trim()) {
             toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
             return;
         }

        if (editingCategory) {
            // TODO: Implement API call to update category
            console.log('Updating category:', { ...editingCategory, name: newCategoryName, type: newCategoryType });
            setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? { ...cat, name: newCategoryName, type: newCategoryType } : cat));
            toast({ title: "Category Updated", description: `Category "${newCategoryName}" has been updated.` });
        } else {
            // TODO: Implement API call to add new category
             const newId = `cat${Date.now()}`; // Dummy ID
             console.log('Adding category:', { id: newId, name: newCategoryName, type: newCategoryType });
             setCategories(prev => [...prev, { id: newId, name: newCategoryName, type: newCategoryType }]);
             toast({ title: "Category Added", description: `Category "${newCategoryName}" has been added.` });
        }
        setIsModalOpen(false);
    };

    const handleDeleteCategory = (id: string, name: string) => {
        // TODO: Add check if category is in use before deleting
         if (window.confirm(`Are you sure you want to delete the category "${name}"? This might affect existing transactions.`)) {
            // TODO: Implement API call to delete category
            console.log('Deleting category:', id);
            setCategories(prev => prev.filter(cat => cat.id !== id));
             toast({ title: "Category Deleted", description: `Category "${name}" has been deleted.` });
         }
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Manage Categories</h1>
                <Button onClick={openAddModal}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Categories</CardTitle>
                    <CardDescription>Add, edit, or remove transaction categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell className="capitalize">{category.type}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(category)}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteCategory(category.id, category.name)}>
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                        No categories found. Add your first category!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                         <DialogDescription>
                            {editingCategory ? 'Update the name or type of this category.' : 'Create a new category for your transactions.'}
                         </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="category-name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., Alimentação"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category-type" className="text-right">
                                Type
                            </Label>
                            <Select value={newCategoryType} onValueChange={setNewCategoryType}>
                                <SelectTrigger id="category-type" className="col-span-3">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryTypes.map(type => (
                                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="outline">Cancel</Button>
                         </DialogClose>
                        <Button type="button" onClick={handleSaveCategory}>Save Category</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

       