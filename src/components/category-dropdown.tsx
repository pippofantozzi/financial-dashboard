
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"; // Import useToast


interface Category {
    id: string;
    name: string;
    type: string; // Keep simple for now
}

interface CategoryDropdownProps {
  categories: Category[]
  value: string // The selected category ID
  onChange: (value: string) => void
  onAddNewCategory: (name: string) => void // Expects a function that adds the category
  placeholder?: string
  notFoundText?: string
  addCategoryText?: string
}

export function CategoryDropdown({
  categories,
  value,
  onChange,
  onAddNewCategory,
  placeholder = "Select category...",
  notFoundText = "No category found.",
  addCategoryText = "Add new category",
}: CategoryDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewCategoryInput, setShowNewCategoryInput] = React.useState(false)
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const newCategoryInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast(); // Initialize toast

  // Focus input when the "Add new" area appears
  React.useEffect(() => {
      if (showNewCategoryInput) {
          newCategoryInputRef.current?.focus();
      }
  }, [showNewCategoryInput]);

  const handleAddNew = () => {
    const trimmedName = newCategoryName.trim();
    if (trimmedName) {
         // Check if category already exists (case-insensitive)
        const exists = categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase());
        if (exists) {
            toast({
               title: "Category Exists",
               description: `Category "${trimmedName}" already exists.`,
               variant: "destructive",
             });
            return; // Don't add if it exists
        }
        onAddNewCategory(trimmedName); // Call the passed-in function to handle state update
        setNewCategoryName(""); // Reset input
        setShowNewCategoryInput(false); // Hide input area
        // Don't close popover automatically, user might want to select it
    } else {
         toast({
            title: "Invalid Name",
            description: "Category name cannot be empty.",
            variant: "destructive",
          });
    }
  }

  const selectedCategoryName = categories.find((category) => category.id === value)?.name

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal" // Added font-normal
        >
          {value && selectedCategoryName ? (
            <span className="truncate">{selectedCategoryName}</span> // Use span for truncation
           ) : (
            <span className="text-muted-foreground">{placeholder}</span> // Style placeholder
           )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command filter={(value, search) => {
             // Custom filter to search category names containing the search term
             const category = categories.find(cat => cat.id === value || cat.name.toLowerCase() === value.toLowerCase());
             if (category && category.name.toLowerCase().includes(search.toLowerCase())) return 1;
             return 0;
         }}>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id} // Use ID as the internal value
                  onSelect={(currentValue) => { // currentValue is the category ID
                    onChange(currentValue === value ? "" : currentValue) // Toggle or set ID
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex-1 truncate">{category.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground opacity-70 capitalize">{category.type}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
                <div className="p-1">
                    {showNewCategoryInput ? (
                        <div className="flex flex-col space-y-1.5 px-1 pb-1">
                             <Label htmlFor="new-category-name" className="text-xs font-medium px-1 text-muted-foreground">New Category Name</Label>
                             <div className="flex items-center space-x-2">
                                <Input
                                   ref={newCategoryInputRef}
                                   id="new-category-name"
                                   placeholder="e.g., Educação"
                                   value={newCategoryName}
                                   onChange={(e) => setNewCategoryName(e.target.value)}
                                   onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                           e.preventDefault(); // Prevent form submission if inside a form
                                           handleAddNew();
                                        } else if (e.key === 'Escape') {
                                            setShowNewCategoryInput(false);
                                            setNewCategoryName('');
                                        }
                                    }}
                                   className="h-8 text-sm" // Use text-sm for consistency
                                />
                                <Button type="button" size="sm" onClick={handleAddNew} className="h-8">Add</Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowNewCategoryInput(false); setNewCategoryName('');}} className="h-8 px-2 text-muted-foreground hover:bg-muted">Cancel</Button>
                             </div>
                        </div>
                    ) : (
                         <CommandItem
                              onSelect={() => {
                                  setShowNewCategoryInput(true);
                                  // Don't close the popover here
                                  // setOpen(false) should not be called
                              }}
                              className="text-muted-foreground hover:text-foreground cursor-pointer"
                           >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              <span>{addCategoryText}</span>
                           </CommandItem>

                    )}
                </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
