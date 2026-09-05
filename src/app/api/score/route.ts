import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, score, email, token } = await req.json();
    const cookieToken = req.cookies.get("quiz_token")?.value;

    // Security check: verify quiz token against cookie
    if (!token || token !== cookieToken) {
      return NextResponse.json({ error: "Unauthorized submission" }, { status: 403 });
    }

    // Payload validation
    if (!name || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    if (score < 0) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail.includes("@") || cleanName.length < 3) {
      return NextResponse.json({ error: "Invalid name or email" }, { status: 400 });
    }

    try {
      // Check for single attempt enforcement
      const existing = await prisma.userScore.findFirst({
        where: { email: cleanEmail },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Participant has already submitted an entry. Duplicate attempts are not permitted." },
          { status: 409 }
        );
      }

      // Save user score in database
      const saved = await prisma.userScore.create({
        data: {
          name: cleanName,
          score,
          email: cleanEmail,
        },
      });

      return NextResponse.json(saved);
    } catch (dbError) {
      console.error("Database operation failed in /api/score:", dbError);
      return NextResponse.json({ error: "Failed to save score in database" }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Failed to process score submission" }, { status: 500 });
  }
}
