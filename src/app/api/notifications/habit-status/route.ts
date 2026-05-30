import { NextRequest, NextResponse } from "next/server";

type HabitStatusNotificationBody = {
  actorName?: string;
  partnerUserId?: string;
  habitTitle?: string;
  status?: "yes" | "no";
};

const YES_MESSAGES = [
  "{actorName} completed {habitTitle}. Your turn — keep going for Allah.",
  "{actorName} marked {habitTitle} Yes. Small deeds, done regularly.",
  "{actorName} completed {habitTitle}. MashaAllah — stay consistent.",
  "{actorName} marked {habitTitle} Yes. Your brother is moving. Your turn.",
];

function buildNotificationBody(actorName: string, habitTitle: string, status: "yes" | "no") {
  if (status === "no") {
    return `${actorName} marked ${habitTitle} No. A gentle reminder for both of you.`;
  }

  const message = YES_MESSAGES[Math.floor(Math.random() * YES_MESSAGES.length)];
  return message.replace("{actorName}", actorName).replace("{habitTitle}", habitTitle);
}

export async function POST(request: NextRequest) {
  const oneSignalAppId = process.env.ONESIGNAL_APP_ID;
  const oneSignalRestApiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!oneSignalAppId || !oneSignalRestApiKey) {
    return NextResponse.json({ error: "Notification service is not configured." }, { status: 500 });
  }

  let body: HabitStatusNotificationBody;

  try {
    body = (await request.json()) as HabitStatusNotificationBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { actorName, partnerUserId, habitTitle, status } = body;

  if (!actorName || !partnerUserId || !habitTitle || (status !== "yes" && status !== "no")) {
    return NextResponse.json({ error: "Missing notification fields." }, { status: 400 });
  }

  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${oneSignalRestApiKey}`,
    },
    body: JSON.stringify({
      app_id: oneSignalAppId,
      include_aliases: { external_id: [partnerUserId] },
      target_channel: "push",
      headings: { en: "Yawm Habit" },
      contents: { en: buildNotificationBody(actorName, habitTitle, status) },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn("OneSignal habit notification failed", {
      status: response.status,
      statusText: response.statusText,
      body: errorText.slice(0, 300),
    });
    return NextResponse.json({ error: "Could not send notification." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
