import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";

export async function GET() {
  const db = getDatabase();

  const categories = db
    .prepare(
      `
    SELECT
      MIN(id) as id,
      name,
      icon,
      color,
      type,
      is_template
    FROM categories 
    WHERE is_template = TRUE
    GROUP BY name, type, icon, color, is_template
    ORDER BY type, name
  `,
    )
    .all();

  return NextResponse.json(categories);
}
