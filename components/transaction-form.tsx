"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import type { Category } from "@/lib/database";
import * as LucideIcons from "lucide-react";

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: {
    type: "income" | "expense";
    categoryId: number;
    amount: number;
    description: string;
    date: string;
  }) => void;
}

export function TransactionForm({
  categories,
  onSubmit,
}: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("income");
  const [categoryId, setCategoryId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) return;

    onSubmit({
      type,
      categoryId: Number.parseInt(categoryId),
      amount: Number.parseFloat(amount),
      description,
      date,
    });

    // Reset form
    setCategoryId("");
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setOpen(false);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? (
      <IconComponent className="h-4 w-4" />
    ) : (
      <Plus className="h-4 w-4" />
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs
            value={type}
            onValueChange={(value) => setType(value as "income" | "expense")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="income"
                className="text-green-600 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/50"
              >
                Income
              </TabsTrigger>
              <TabsTrigger
                value="expense"
                className="text-red-600 data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/50"
              >
                Expense
              </TabsTrigger>
            </TabsList>

            <TabsContent value={type} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        <div className="flex items-center space-x-2">
                          <div style={{ color: category.color }}>
                            {getIcon(category.icon)}
                          </div>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a note..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Add {type === "income" ? "Income" : "Expense"}
              </Button>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
}
