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
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { Category } from "@/lib/database";
import * as LucideIcons from "lucide-react";

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: {
    type: "income" | "expense";
    categoryId: number;
    amount: number;
    description: string;
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeOut", duration: 0.3 },
    },
  };

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) return;

    onSubmit({
      type,
      categoryId: Number.parseInt(categoryId),
      amount: Number.parseFloat(amount),
      description,
    });

    // Reset form
    setCategoryId("");
    setAmount("");
    setDescription("");
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
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 1,
            type: "spring",
            stiffness: 200,
          }}
          whileHover={{
            scale: 1.1,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200">
            <motion.div
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="pb-4"
            >
              <DialogTitle>Add Transaction</DialogTitle>
            </motion.div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs
              value={type}
              onValueChange={(value) => setType(value as "income" | "expense")}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg h-12">
                  <TabsTrigger
                    value="income"
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:border-green-200 data-[state=active]:shadow-sm dark:data-[state=active]:bg-green-900/50 dark:data-[state=active]:text-green-300 dark:data-[state=active]:border-green-800 text-muted-foreground hover:text-green-600 dark:hover:text-green-400 font-medium transition-all duration-200 border border-transparent rounded-md"
                  >
                    Income
                  </TabsTrigger>
                  <TabsTrigger
                    value="expense"
                    className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700 data-[state=active]:border-red-200 data-[state=active]:shadow-sm dark:data-[state=active]:bg-red-900/50 dark:data-[state=active]:text-red-300 dark:data-[state=active]:border-red-800 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 font-medium transition-all duration-200 border border-transparent rounded-md"
                  >
                    Expense
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <div className="relative h-[340px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{
                      duration: 0.25,
                      ease: "easeInOut",
                    }}
                    className="absolute w-full"
                  >
                    <TabsContent value={type}>
                      <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.div variants={itemVariants} className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={categoryId}
                            onValueChange={setCategoryId}
                          >
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
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
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
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="description">
                          Description (Optional)
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Add a note..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button type="submit" className="w-full">
                          Add {type === "income" ? "Income" : "Expense"}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
