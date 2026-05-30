import { supabase } from "@/lib/supabase/client";

type NotificationPreferenceRow = {
  user_id: string;
  push_enabled: boolean;
};

export async function fetchNotificationPreference(userId: string) {
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("user_id,push_enabled")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load reminder preference.");
  }

  if (!data) {
    return true;
  }

  return (data as NotificationPreferenceRow).push_enabled;
}

export async function upsertNotificationPreference(userId: string, enabled: boolean) {
  const { error } = await supabase.from("notification_preferences").upsert(
    {
      user_id: userId,
      push_enabled: enabled,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    },
  );

  if (error) {
    throw new Error("Could not save reminder preference.");
  }
}
