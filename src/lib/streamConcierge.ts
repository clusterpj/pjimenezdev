import type { Message } from "@/components/ai/ConciergeSurface";

export async function streamConcierge(
  messages: Message[],
  onToken: (token: string) => void,
): Promise<void> {
  const apiMessages = messages.map(m => ({
    role: (m.role === "ai" ? "assistant" : "user") as "assistant" | "user",
    content: m.content,
  }));

  const res = await fetch("/api/concierge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: apiMessages, stream: true }),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json() as { error?: string };
      msg = body.error ?? msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }

  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const token = decoder.decode(value, { stream: true });
      if (token) onToken(token);
    }
  } finally {
    reader.releaseLock();
  }
}
