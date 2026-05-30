import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase/client";

type HabitStatusNotificationBody = {
  actorUserId?: string;
  actorName?: string;
  habitTitle?: string;
  status?: "yes" | "no";
  date?: string;
};

function buildNotificationBody(actorName: string, habitTitle: string, status: "yes" | "no") {
  return `${actorName} marked ${habitTitle} as ${status === "yes" ? "Yes" : "No"}.`;
}

function parseResponseBody(responseText: string) {
  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
}

export async function POST(request: NextRequest) {
  const oneSignalAppId = process.env.ONESIGNAL_APP_ID;
  const oneSignalRestApiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!oneSignalAppId || !oneSignalRestApiKey) {
    console.warn("OneSignal env missing", {
      hasAppId: Boolean(process.env.ONESIGNAL_APP_ID),
      hasRestKey: Boolean(process.env.ONESIGNAL_REST_API_KEY),
    });

    return Response.json(
      {
        error: "Missing OneSignal env",
        hasAppId: Boolean(process.env.ONESIGNAL_APP_ID),
        hasRestKey: Boolean(process.env.ONESIGNAL_REST_API_KEY),
      },
      { status: 500 },
    );
  }

  let body: HabitStatusNotificationBody;

  try {
    body = (await request.json()) as HabitStatusNotificationBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { actorUserId, actorName, habitTitle, status, date } = body;

  if (!actorUserId || !actorName || !habitTitle || (status !== "yes" && status !== "no")) {
    return Response.json({ error: "Missing notification fields." }, { status: 400 });
  }

  const [usersResult, preferencesResult] = await Promise.all([
    supabase
      .from("app_users")
      .select("id")
      .eq("is_active", true),
    supabase
      .from("notification_preferences")
      .select("user_id,push_enabled"),
  ]);

  const { data: users, error: usersError } = usersResult;
  const { data: preferences, error: preferencesError } = preferencesResult;

  if (usersError || preferencesError) {
    console.warn("Could not load notification target users", {
      actorUserId,
      actorName,
      habitTitle,
      status,
      date,
      message: usersError?.message ?? preferencesError?.message,
      code: usersError?.code ?? preferencesError?.code,
    });

    return Response.json(
      {
        error: "Could not load notification target users",
        details: usersError?.message ?? preferencesError?.message,
      },
      { status: 500 },
    );
  }

  const preferenceByUserId = new Map(
    (preferences ?? []).map((preference) => [preference.user_id as string, Boolean(preference.push_enabled)]),
  );
  const targetUserIds = (users ?? [])
    .map((user) => user.id)
    .filter((userId): userId is string => {
      if (typeof userId !== "string" || userId === actorUserId) {
        return false;
      }

      return preferenceByUserId.get(userId) ?? true;
    });

  if (targetUserIds.length === 0) {
    console.info("No notification target users", {
      actorUserId,
      actorName,
      targetCount: 0,
      habitTitle,
      status,
      date,
    });

    return Response.json({
      ok: true,
      targetCount: 0,
      details: "No target users.",
    });
  }

  const message = buildNotificationBody(actorName, habitTitle, status);

  console.info("Sending OneSignal habit notification", {
    hasAppId: Boolean(process.env.ONESIGNAL_APP_ID),
    hasRestKey: Boolean(process.env.ONESIGNAL_REST_API_KEY),
    actorUserId,
    actorName,
    targetCount: targetUserIds.length,
    habitTitle,
    status,
    date,
  });

  try {
    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        include_aliases: {
          external_id: targetUserIds,
        },
        target_channel: "push",
        headings: {
          en: "Yawm Habit",
        },
        contents: {
          en: message,
        },
      }),
    });

    const responseText = await response.text();
    const responseBody = parseResponseBody(responseText);

    console.info("OneSignal habit notification response", {
      hasAppId: Boolean(process.env.ONESIGNAL_APP_ID),
      hasRestKey: Boolean(process.env.ONESIGNAL_REST_API_KEY),
      actorUserId,
      actorName,
      targetCount: targetUserIds.length,
      habitTitle,
      status,
      date,
      oneSignalStatus: response.status,
      oneSignalResponseBody: responseBody,
    });

    if (!response.ok) {
      return Response.json(
        {
          error: "OneSignal request failed",
          status: response.status,
          targetCount: targetUserIds.length,
          details: responseBody,
        },
        { status: response.status },
      );
    }

    return Response.json({
      ok: true,
      targetCount: targetUserIds.length,
      status: response.status,
      details: responseBody,
    });
  } catch (error) {
    console.warn("OneSignal habit notification fetch threw", {
      hasAppId: Boolean(process.env.ONESIGNAL_APP_ID),
      hasRestKey: Boolean(process.env.ONESIGNAL_REST_API_KEY),
      actorUserId,
      actorName,
      targetCount: targetUserIds.length,
      habitTitle,
      status,
      date,
      message: error instanceof Error ? error.message : "Unknown fetch error.",
    });

    return Response.json(
      {
        error: "OneSignal fetch failed",
        details: error instanceof Error ? error.message : "Unknown fetch error.",
      },
      { status: 500 },
    );
  }
}
