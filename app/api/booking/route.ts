export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }

  const { name, email, phone, sessionType, date, message } = data ?? {};

  if (!name || !email || !sessionType) {
    return Response.json(
      { error: "Veuillez remplir les champs obligatoires." },
      { status: 400 }
    );
  }

  console.log("Nouvelle demande de réservation Prima Photo:", {
    name,
    email,
    phone,
    sessionType,
    date,
    message,
  });

  return Response.json({ success: true });
}
