import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const scores = await prisma.userScore.findMany({
      orderBy: { score: "desc" },
      take: 100,
    });

    return NextResponse.json(scores);
  } catch (err) {
    console.error("Database error in /api/scoreboard:", err);
    return NextResponse.json(
      { error: "Failed to fetch scoreboard from database" },
      { status: 500 }
    );
  }
}
