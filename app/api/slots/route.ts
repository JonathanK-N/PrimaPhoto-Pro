import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const slots = await prisma.availabilitySlot.findMany({
    where: { isBooked: false, start: { gte: new Date() } },
    orderBy: { start: "asc" },
    select: { id: true, start: true, end: true },
  });

  return Response.json({ slots });
}
