"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import type { Transaction } from "@/lib/database";

interface DashboardStatsProps {
  transactions: Transaction[];
}

export function DashboardStats({ transactions }: DashboardStatsProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
    },
    {
      title: "Balance",
      value: formatCurrency(balance),
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => {
        let colors = {
          bgColor: "",
          textColor: "",
        };

        if (stat.title === "Total Income") {
          colors = {
            bgColor: "bg-green-100 dark:bg-green-900/50",
            textColor: "text-green-600 dark:text-green-400",
          };
        } else if (stat.title === "Total Expenses") {
          colors = {
            bgColor: "bg-red-100 dark:bg-red-900/50",
            textColor: "text-red-600 dark:text-red-400",
          };
        } else if (stat.title === "Balance") {
          if (balance >= 0) {
            colors = {
              bgColor: "bg-green-100 dark:bg-green-900/50",
              textColor: "text-green-600 dark:text-green-400",
            };
          } else {
            colors = {
              bgColor: "bg-red-100 dark:bg-red-900/50",
              textColor: "text-red-600 dark:text-red-400",
            };
          }
        }
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${colors.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${colors.textColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${colors.textColor}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
