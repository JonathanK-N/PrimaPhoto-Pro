import { prisma } from "@/app/lib/prisma";
import { getSiteUrl } from "@/app/lib/site";

export const dynamic = "force-dynamic";

function buildMailto(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = getSiteUrl(url.origin);
  const bookingId = url.searchParams.get("bookingId");
  const action = url.searchParams.get("action");

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

  const mailto = buildMailto(booking.email, subject, body);
  const safeMailto = mailto.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="0;url=${safeMailto}" />
  <title>Ouverture de votre messagerie…</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#f5f3ee;font-family:system-ui,sans-serif;text-align:center;padding:24px;">
  <div>
    <p style="margin-bottom:16px;">Ouverture de votre messagerie...</p>
    <p style="margin-bottom:16px;font-size:14px;color:#9a9892;">Si rien ne se passe automatiquement :</p>
    <a href="${safeMailto}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#c9a961;color:#0a0a0a;text-decoration:none;font-weight:600;">
      Rédiger le courriel
    </a>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
