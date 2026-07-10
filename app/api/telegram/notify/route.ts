import { prisma } from "@/app/lib/prisma";
import { getSiteUrl } from "@/app/lib/site";

export const dynamic = "force-dynamic";

const ACTIONS = ["confirm", "cancel", "review"] as const;
type Action = (typeof ACTIONS)[number];

function buildMailto(to: string, subject: string, body: string) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildWhatsApp(phone: string, text: string) {
  const cleaned = phone.replace(/[^0-9+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}

function getMessageContent(
  action: Action,
  booking: { name: string; sessionType: string; formattedDate: string; location: string | null },
  origin: string
) {
  if (action === "confirm") {
    const subject = "Confirmation de votre rendez-vous - Prima Photo";
    const body =
      `Bonjour ${booking.name},\n\n` +
      `C'est avec plaisir que nous confirmons votre rendez-vous avec Prima Photo !\n\n` +
      `Date : ${booking.formattedDate}\n` +
      `Type de séance : ${booking.sessionType}\n` +
      (booking.location ? `Lieu : ${booking.location}\n` : "") +
      `\nNous sommes impatients de capturer ces moments avec vous. Si vous avez des questions avant la séance, n'hésitez pas à nous écrire.\n\n` +
      `À très bientôt !\n\nL'équipe Prima Photo`;
    return { subject, body };
  }

  if (action === "cancel") {
    const subject = "Concernant votre demande de rendez-vous - Prima Photo";
    const body =
      `Bonjour ${booking.name},\n\n` +
      `Merci pour votre demande de réservation auprès de Prima Photo.\n\n` +
      `Malheureusement, nous ne sommes pas disponibles pour le créneau du ${booking.formattedDate} et devons décliner cette demande. Nous sommes vraiment désolés pour ce contretemps.\n\n` +
      `N'hésitez pas à consulter nos disponibilités pour choisir un autre moment : ${origin}/contact\n\n` +
      `Au plaisir de vous accueillir prochainement.\n\nL'équipe Prima Photo`;
    return { subject, body };
  }

  // review
  const subject = "Partagez votre expérience - Prima Photo";
  const body =
    `Bonjour ${booking.name},\n\n` +
    `Nous espérons que votre séance ${booking.sessionType} s'est bien déroulée !\n\n` +
    `Votre avis compte énormément pour nous. Si vous avez quelques instants, nous serions ravis que vous partagiez votre expérience :\n\n` +
    `${origin}/avis\n\n` +
    `Merci beaucoup et à bientôt !\n\nL'équipe Prima Photo`;
  return { subject, body };
}

function actionLabel(action: Action) {
  if (action === "confirm") return "Confirmer le rendez-vous";
  if (action === "cancel") return "Annuler le rendez-vous";
  return "Demander un avis";
}

function actionEmoji(action: Action) {
  if (action === "confirm") return "✅";
  if (action === "cancel") return "❌";
  return "⭐";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = getSiteUrl(url.origin);
  const bookingId = url.searchParams.get("bookingId");
  const action = url.searchParams.get("action") as Action | null;

  if (!bookingId || !action || !ACTIONS.includes(action)) {
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
    timeZone: "America/Montreal",
  });

  const { subject, body } = getMessageContent(
    action,
    { name: booking.name, sessionType: booking.sessionType, formattedDate, location: booking.location },
    origin
  );

  const mailto = buildMailto(booking.email, subject, body);
  const safeMailto = mailto.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  let whatsappLink = "";
  if (booking.phone) {
    whatsappLink = buildWhatsApp(booking.phone, body);
  }
  const safeWhatsapp = whatsappLink.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${actionLabel(action)} - Prima Photo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 24px;
    }
    .card {
      max-width: 420px;
      width: 100%;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 48px 32px;
      background: #0a0a0a;
    }
    .emoji { font-size: 48px; margin-bottom: 24px; }
    h1 { font-size: 20px; font-weight: 500; margin-bottom: 8px; }
    .sub { font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 32px; }
    .client { font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 32px; }
    .buttons { display: flex; flex-direction: column; gap: 12px; }
    a.btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 24px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.05em;
      transition: all 0.3s ease;
    }
    .btn-email {
      background: #fff;
      color: #000;
    }
    .btn-email:hover { background: #e0e0e0; }
    .btn-whatsapp {
      background: #25D366;
      color: #fff;
    }
    .btn-whatsapp:hover { background: #1fb855; }
    .btn-disabled {
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.3);
      cursor: not-allowed;
      pointer-events: none;
    }
    .note { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">${actionEmoji(action)}</div>
    <h1>${actionLabel(action)}</h1>
    <p class="sub">Choisissez le moyen d'envoi du message</p>
    <p class="client"><strong>${booking.name}</strong> · ${booking.email}${booking.phone ? ` · ${booking.phone}` : ""}</p>
    <div class="buttons">
      <a href="${safeMailto}" class="btn btn-email">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        Envoyer par Email
      </a>
      <a href="${booking.phone ? safeWhatsapp : "#"}" class="btn ${booking.phone ? "btn-whatsapp" : "btn-disabled"}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        ${booking.phone ? "Envoyer par WhatsApp" : "WhatsApp (pas de numéro)"}
      </a>
    </div>
    <p class="note">Le message sera pré-rempli. Vous n'aurez qu'à l'envoyer.</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
