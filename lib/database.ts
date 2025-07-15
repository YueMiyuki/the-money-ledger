import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join(process.cwd(), "data", "ledger.db");
let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    // Ensure data directory exists
    const fs = require("fs");
    const path = require("path");
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    // Initialize schema
    const initScript = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        discord_id TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        avatar TEXT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        is_template BOOLEAN DEFAULT TRUE,
        user_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      );
    `;

    db.exec(initScript);

    // Insert default templates
    const defaultCategories = [
      // Expense templates
      {
        name: "Food & Dining",
        icon: "utensils",
        color: "#ef4444",
        type: "expense",
      },
      { name: "Travel", icon: "plane", color: "#3b82f6", type: "expense" },
      {
        name: "Shopping",
        icon: "shopping-bag",
        color: "#8b5cf6",
        type: "expense",
      },
      {
        name: "Entertainment",
        icon: "gamepad-2",
        color: "#f59e0b",
        type: "expense",
      },
      {
        name: "Transportation",
        icon: "car",
        color: "#10b981",
        type: "expense",
      },
      {
        name: "Healthcare",
        icon: "heart-pulse",
        color: "#ec4899",
        type: "expense",
      },
      {
        name: "Education",
        icon: "graduation-cap",
        color: "#6366f1",
        type: "expense",
      },
      {
        name: "Bills & Utilities",
        icon: "receipt",
        color: "#ef4444",
        type: "expense",
      },
      {
        name: "Groceries",
        icon: "shopping-cart",
        color: "#22c55e",
        type: "expense",
      },
      { name: "Gas", icon: "fuel", color: "#f97316", type: "expense" },
      // Income templates
      { name: "Salary", icon: "briefcase", color: "#10b981", type: "income" },
      { name: "Freelance", icon: "laptop", color: "#3b82f6", type: "income" },
      {
        name: "Investment",
        icon: "trending-up",
        color: "#8b5cf6",
        type: "income",
      },
      { name: "Business", icon: "building", color: "#f59e0b", type: "income" },
      { name: "Gift", icon: "gift", color: "#ec4899", type: "income" },
      {
        name: "Other Income",
        icon: "plus-circle",
        color: "#6b7280",
        type: "income",
      },
    ];

    const insertCategory = db.prepare(`
      INSERT OR IGNORE INTO categories (name, icon, color, type, is_template) 
      VALUES (?, ?, ?, ?, TRUE)
    `);

    for (const category of defaultCategories) {
      insertCategory.run(
        category.name,
        category.icon,
        category.color,
        category.type,
      );
    }
  }

  return db;
}

export type User = {
  id: string;
  discord_id: string;
  username: string;
  avatar?: string;
  email?: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  is_template: boolean;
  user_id?: string;
  created_at: string;
};

export type Transaction = {
  id: number;
  user_id: string;
  category_id: number;
  amount: number;
  description?: string;
  date: string;
  type: "income" | "expense";
  created_at: string;
  updated_at: string;
  category?: Category;
};
