
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

interface CategoryDropdownProps {
  categories: { id: string; name: string; type: string }[]
  value: string // The selected category ID
  onChange: (value: string) => void
  onAddNewCategory: (name: string) => void
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
  const [showNewCategoryDialog, setShowNewCategoryDialog] = React.useState(false)
  const [newCategoryName, setNewCategoryName] = React.useState("")

  const handleAddNew = () => {
    if (newCategoryName.trim()) {
        onAddNewCategory(newCategoryName.trim());
        setNewCategoryName(""); // Reset input
        setShowNewCategoryDialog(false); // Close implicit dialog/input area
        setOpen(false); // Close popover
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
          className="w-full justify-between"
        >
          {value ? selectedCategoryName : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name} // Search based on name
                  onSelect={(currentValue) => {
                    // Find ID based on selected name (currentValue)
                    const selectedId = categories.find(c => c.name.toLowerCase() === currentValue.toLowerCase())?.id ?? "";
                    onChange(selectedId === value ? "" : selectedId)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.name}
                  <span className="ml-auto text-xs text-muted-foreground opacity-70">{category.type}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
                <div className="p-2">
                    {showNewCategoryDialog ? (
                        <div className="flex flex-col space-y-2">
                             <Label htmlFor="new-category-name" className="text-xs px-1">New Category Name</Label>
                             <div className="flex items-center space-x-2">
                                <Input
                                   id="new-category-name"
                                   placeholder="e.g., Educação"
                                   value={newCategoryName}
                                   onChange={(e) => setNewCategoryName(e.target.value)}
                                   onKeyDown={(e) => { if (e.key === 'Enter') handleAddNew(); }}
                                   className="h-8"
                                />
                                <Button type="button" size="sm" onClick={handleAddNew} className="h-8">Add</Button>
                             </div>
                        </div>
                    ) : (
                         <Button
                              variant="ghost"
                              className="w-full justify-start text-sm font-normal"
                              onClick={() => setShowNewCategoryDialog(true)}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              {addCategoryText}
                            </Button>
                    )}

                </div>

            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
