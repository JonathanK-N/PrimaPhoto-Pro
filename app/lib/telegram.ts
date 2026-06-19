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

export async function sendTelegramMessage(text: string) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) {
    console.warn("Telegram non configuré : message ignoré.", text);
    return;
  }
  await sendMessageToChat(chatId, text);
}
