import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { optimizeImageUrl } from "@/lib/imageOptimization";

export async function GET() {
  try {
    const pictures = await prisma.picture.findMany();
    const optimized = pictures.map((p) => ({
      ...p,
      src: optimizeImageUrl(p.src, p.isVideo),
    }));
    return NextResponse.json(optimized);
  } catch (error) {
    console.error("Failed to query pictures from database:", error);
    return NextResponse.json(
      { error: "Failed to fetch pictures" },
      { status: 500 }
    );
  }
}
