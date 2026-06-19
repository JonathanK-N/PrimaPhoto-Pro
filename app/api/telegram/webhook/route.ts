import { sendMessageToChat } from "@/app/lib/telegram";

export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    chat: { id: number };
    text?: string;
  };
};

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
    if (headerSecret !== secret) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return Response.json({ ok: true });
  }

  const chatId = update.message?.chat.id;
  const text = update.message?.text?.trim();

  if (chatId && text) {
    if (text === "/start") {
      await sendMessageToChat(
        chatId,
        `✅ <b>Assistant PrimaPhoto est connecté !</b>\n\nVous recevrez ici une notification à chaque nouvelle réservation.\n\nVotre chat ID : <code>${chatId}</code>`
      );
    } else {
      await sendMessageToChat(
        chatId,
        "Je ne fais qu'envoyer les notifications de réservation pour le moment. Tapez /start pour vérifier la connexion."
      );
    }
  }

  return Response.json({ ok: true });
}
