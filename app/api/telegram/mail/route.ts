import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

function buildMailto(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");
  const action = searchParams.get("action");

  if (!bookingId || (action !== "confirm" && action !== "cancel")) {
    return new Response("Requête invalide.", { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: true },
  });

  if (!booking) {
    return new Response("Réservation introuvable.", { status: 404 });
  }

  const formattedDate = booking.slot.start.toLocaleString("fr-CA", {
    dateStyle: "full",
    timeStyle: "short",
  });

  let subject: string;
  let body: string;

  if (action === "confirm") {
    subject = "Confirmation de votre rendez-vous - Prima Photo";
    body =
      `Bonjour ${booking.name},\n\n` +
      `C'est avec plaisir que nous confirmons votre rendez-vous avec Prima Photo !\n\n` +
      `Date : ${formattedDate}\n` +
      `Type de séance : ${booking.sessionType}\n` +
      (booking.location ? `Lieu : ${booking.location}\n` : "") +
      `\nNous sommes impatients de capturer ces moments avec vous. Si vous avez des questions avant la séance, n'hésitez pas à nous écrire en répondant à ce courriel.\n\n` +
      `À très bientôt !\n\nL'équipe Prima Photo`;
  } else {
    subject = "Concernant votre demande de rendez-vous - Prima Photo";
    body =
      `Bonjour ${booking.name},\n\n` +
      `Merci pour votre demande de réservation auprès de Prima Photo.\n\n` +
      `Malheureusement, nous ne sommes pas disponibles pour le créneau du ${formattedDate} et devons décliner cette demande. Nous sommes vraiment désolés pour ce contretemps.\n\n` +
      `N'hésitez pas à consulter nos disponibilités pour choisir un autre moment qui vous conviendrait : ${origin}/contact\n\n` +
      `Encore désolé pour ce désagrément, et au plaisir de vous accueillir prochainement.\n\nL'équipe Prima Photo`;
  }

  return new Response(null, {
    status: 302,
    headers: { Location: buildMailto(booking.email, subject, body) },
  });
}
