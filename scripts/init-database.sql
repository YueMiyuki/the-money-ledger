-- Initialize SQLite database schema
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

-- Insert default expense templates
INSERT OR IGNORE INTO categories (name, icon, color, type, is_template) VALUES
('Food & Dining', 'utensils', '#ef4444', 'expense', TRUE),
('Travel', 'plane', '#3b82f6', 'expense', TRUE),
('Shopping', 'shopping-bag', '#8b5cf6', 'expense', TRUE),
('Entertainment', 'gamepad-2', '#f59e0b', 'expense', TRUE),
('Transportation', 'car', '#10b981', 'expense', TRUE),
('Healthcare', 'heart-pulse', '#ec4899', 'expense', TRUE),
('Education', 'graduation-cap', '#6366f1', 'expense', TRUE),
('Bills & Utilities', 'receipt', '#ef4444', 'expense', TRUE),
('Groceries', 'shopping-cart', '#22c55e', 'expense', TRUE),
('Gas', 'fuel', '#f97316', 'expense', TRUE);

-- Insert default income templates
INSERT OR IGNORE INTO categories (name, icon, color, type, is_template) VALUES
('Salary', 'briefcase', '#10b981', 'income', TRUE),
('Freelance', 'laptop', '#3b82f6', 'income', TRUE),
('Investment', 'trending-up', '#8b5cf6', 'income', TRUE),
('Business', 'building', '#f59e0b', 'income', TRUE),
('Gift', 'gift', '#ec4899', 'income', TRUE),
('Other Income', 'plus-circle', '#6b7280', 'income', TRUE);
