"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { DashboardStats } from "@/components/dashboard-stats";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { motion } from "framer-motion";
import type { Category, Transaction } from "@/lib/database";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState<
    (Transaction & { category: any })[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/categories"),
      ]);

      const transactionsData = await transactionsRes.json();
      const categoriesData = await categoriesRes.json();

      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (data: {
    type: "income" | "expense";
    categoryId: number;
    amount: number;
    description: string;
    date: string;
  }) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTransactions(transactions.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user?.name}! Here's your financial
              overview.
            </p>
          </div>

          <DashboardStats transactions={transactions} />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </motion.div>

        <TransactionForm
          categories={categories}
          onSubmit={handleAddTransaction}
        />
      </main>
    </div>
  );
}
