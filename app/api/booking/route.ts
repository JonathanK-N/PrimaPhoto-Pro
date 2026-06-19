import { prisma } from "@/app/lib/prisma";
import { sendTelegramMessage } from "@/app/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { slotId, name, email, phone, sessionType, location, message } = data ?? {};

  if (!slotId || !name || !email || !sessionType) {
    return Response.json(
      { error: "Veuillez remplir les champs obligatoires." },
      { status: 400 }
    );
  }

  const slot = await prisma.availabilitySlot.findUnique({ where: { id: String(slotId) } });

  if (!slot || slot.isBooked || slot.start.getTime() < Date.now()) {
    return Response.json(
      { error: "Ce créneau n'est plus disponible. Veuillez en choisir un autre." },
      { status: 409 }
    );
  }

  let booking;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.availabilitySlot.updateMany({
        where: { id: slot.id, isBooked: false },
        data: { isBooked: true },
      });

      if (updated.count === 0) {
        throw new Error("SLOT_TAKEN");
      }

      return tx.booking.create({
        data: {
          name: String(name),
          email: String(email),
          phone: phone ? String(phone) : null,
          sessionType: String(sessionType),
          location: location ? String(location) : null,
          message: message ? String(message) : null,
          slotId: slot.id,
        },
      });
    });
    booking = result;
  } catch {
    return Response.json(
      { error: "Ce créneau vient d'être réservé par quelqu'un d'autre. Veuillez en choisir un autre." },
      { status: 409 }
    );
  }

  const formattedDate = slot.start.toLocaleString("fr-CA", {
    dateStyle: "full",
    timeStyle: "short",
  });

  await sendTelegramMessage(
    `📸 <b>Nouvelle réservation</b>\n\n` +
      `<b>Client:</b> ${booking.name}\n` +
      `<b>Type:</b> ${booking.sessionType}\n` +
      `<b>Date:</b> ${formattedDate}\n` +
      `<b>Courriel:</b> ${booking.email}\n` +
      (booking.phone ? `<b>Téléphone:</b> ${booking.phone}\n` : "") +
      (booking.location ? `<b>Lieu:</b> ${booking.location}\n` : "") +
      (booking.message ? `<b>Message:</b> ${booking.message}` : "")
  );

  return Response.json({ success: true });
}
