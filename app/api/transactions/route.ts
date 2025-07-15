import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/database";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDatabase();

  const transactions = db
    .prepare(
      `
    SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
    ORDER BY t.date DESC, t.created_at DESC
  `,
    )
    .all(session.user.id);

  const formattedTransactions = transactions.map((t: any) => ({
    ...t,
    category: {
      id: t.category_id,
      name: t.category_name,
      icon: t.category_icon,
      color: t.category_color,
    },
  }));

  return NextResponse.json(formattedTransactions);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, categoryId, amount, description, date } = await request.json();

  const db = getDatabase();

  const insertTransaction = db.prepare(`
    INSERT INTO transactions (user_id, category_id, amount, description, date, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = insertTransaction.run(
    session.user.id,
    categoryId,
    amount,
    description || null,
    date,
    type,
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Transaction ID required" },
      { status: 400 },
    );
  }

  const db = getDatabase();

  const deleteTransaction = db.prepare(`
    DELETE FROM transactions 
    WHERE id = ? AND user_id = ?
  `);

  deleteTransaction.run(id, session.user.id);

  return NextResponse.json({ success: true });
}
