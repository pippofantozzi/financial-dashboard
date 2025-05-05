
'use client';

import * as React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from "../../hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; // Use uuid for unique IDs

// Initial Dummy Data - Will be managed by state
const initialCategories = [
    { id: uuidv4(), name: 'Mercado', type: 'expense' },
    { id: uuidv4(), name: 'Luxos', type: 'expense' },
    { id: uuidv4(), name: 'Farmácia', type: 'expense' },
    { id: uuidv4(), name: 'Transporte', type: 'expense' },
    { id: uuidv4(), name: 'Salário', type: 'income' },
    { id: uuidv4(), name: 'Investimentos', type: 'investment' },
    { id: uuidv4(), name: 'Poupança Viagem', type: 'saving' },
];

type Category = {
    id: string;
    name: string;
    type: 'expense' | 'income' | 'investment' | 'saving';
};

const categoryTypes: Category['type'][] = ['expense', 'income', 'investment', 'saving'];

export default function CategoriesPage() {
    const [categories, setCategories] = React.useState<Category[]>(initialCategories); // Manage categories in state
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
    const [newCategoryName, setNewCategoryName] = React.useState('');
    const [newCategoryType, setNewCategoryType] = React.useState<Category['type']>('expense');
    const { toast } = useToast();

    const openAddModal = () => {
        setEditingCategory(null);
        setNewCategoryName('');
        setNewCategoryType('expense');
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
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
            // Update existing category in state
            setCategories(prev => prev.map(cat =>
                cat.id === editingCategory.id ? { ...cat, name: newCategoryName.trim(), type: newCategoryType } : cat
            ));
            toast({ title: "Category Updated", description: `Category "${newCategoryName.trim()}" has been updated.` });
        } else {
            // Add new category to state
             const newCategory: Category = {
                 id: uuidv4(), // Generate unique ID
                 name: newCategoryName.trim(),
                 type: newCategoryType,
             };
             setCategories(prev => [...prev, newCategory]);
             toast({ title: "Category Added", description: `Category "${newCategoryName.trim()}" has been added.` });
        }
        setIsModalOpen(false);
    };

    const handleDeleteCategory = (id: string, name: string) => {
        // TODO: Add check if category is in use by transactions before deleting (when transaction state is available)
         if (window.confirm(`Are you sure you want to delete the category "${name}"? This action cannot be undone.`)) {
            // Delete category from state
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
                            <Select value={newCategoryType} onValueChange={(value) => setNewCategoryType(value as Category['type'])}>
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
