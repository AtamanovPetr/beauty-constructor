import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const VK_TOKEN = process.env.VK_ACCESS_TOKEN!;
    const VK_USER_ID = process.env.VK_USER_ID!;

    const message = `🔥 Новая заявка на PRO!\nEmail: ${email}\nДата: ${new Date().toLocaleString()}`;

    const vkRes = await fetch(`https://api.vk.com/method/messages.send`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        user_id: VK_USER_ID,
        message: message,
        access_token: VK_TOKEN,
        v: "5.199",
        random_id: Date.now().toString(),
      }),
    });

    const data = await vkRes.json();
    if (data.error) {
      throw new Error(data.error.error_msg);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
