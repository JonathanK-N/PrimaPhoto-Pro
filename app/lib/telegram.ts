async function callTelegramApi(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("Telegram non configuré : appel ignoré.", method, payload);
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Échec de l'appel Telegram:", method, await res.text());
    }
  } catch (err) {
    console.error("Erreur lors de l'appel Telegram:", method, err);
  }
}

export async function sendMessageToChat(chatId: string | number, text: string) {
  await callTelegramApi("sendMessage", { chat_id: chatId, text, parse_mode: "HTML" });
}

type BookingNotification = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  sessionType: string;
  location: string | null;
  message: string | null;
  formattedDate: string;
  origin: string;
};

export async function sendBookingNotification(booking: BookingNotification) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) {
    console.warn("Telegram non configuré : notification de réservation ignorée.");
    return;
  }

  const text =
    `📸 <b>Nouvelle réservation</b>\n\n` +
    `<b>Client :</b> ${booking.name}\n` +
    `<b>Courriel :</b> ${booking.email}\n` +
    (booking.phone ? `<b>Téléphone :</b> ${booking.phone}\n` : "") +
    `<b>Type de séance :</b> ${booking.sessionType}\n` +
    `<b>Date :</b> ${booking.formattedDate}\n` +
    (booking.location ? `<b>Lieu :</b> ${booking.location}\n` : "") +
    (booking.message ? `<b>Message :</b> ${booking.message}\n` : "");

  const mailLink = (action: "confirm" | "cancel") =>
    `${booking.origin}/api/telegram/mail?bookingId=${booking.id}&action=${action}`;

  await callTelegramApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Confirmer", url: mailLink("confirm") },
          { text: "❌ Annuler", url: mailLink("cancel") },
        ],
      ],
    },
  });
}
