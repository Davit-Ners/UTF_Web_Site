export async function POST(req: Request) {
  const payload = await req.json();
  console.log("BOOKING REQUEST", payload);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
