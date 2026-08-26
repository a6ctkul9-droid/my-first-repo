const LINE_PUSH_URL = "https://api.line.me/v2/bot/message/push";

export async function sendLinePushMessage(text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;

  if (!token) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set.");
  }
  if (!userId) {
    throw new Error("LINE_USER_ID is not set.");
  }

  const response = await fetch(LINE_PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`LINE API error (${response.status}): ${body}`);
  }
}
