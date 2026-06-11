export async function POST(request: Request) {
  const data = await request.json();
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
