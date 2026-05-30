"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { fetchNotificationPreference, upsertNotificationPreference } from "@/lib/notifications/preferences";
import { cn } from "@/lib/utils";

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

type ReminderStatus = "idle" | "loading" | "on" | "off" | "needs-permission" | "blocked" | "unsupported";

type OneSignalApi = {
  init: (options: { appId: string; notifyButton: { enable: boolean } }) => Promise<void>;
  login?: (externalId: string) => Promise<void>;
  logout?: () => Promise<void>;
  Notifications?: {
    requestPermission?: () => Promise<boolean>;
  };
};

declare global {
  interface Window {
    OneSignalDeferred?: Array<(oneSignal: OneSignalApi) => void | Promise<void>>;
    __yawmOneSignalInitialized?: boolean;
    __yawmOneSignalExternalId?: string;
  }
}

function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    window.isSecureContext
  );
}

function getBrowserPermission(): NotificationPermission | "unsupported" {
  if (!isPushSupported()) {
    return "unsupported";
  }

  return Notification.permission;
}

function getStatusLabel(status: ReminderStatus) {
  if (status === "on") {
    return "On";
  }

  if (status === "off") {
    return "Off";
  }

  if (status === "needs-permission") {
    return "Allow notifications to enable reminders";
  }

  if (status === "blocked") {
    return "Notifications blocked in browser settings";
  }

  if (status === "unsupported") {
    return "Push reminders are not available here";
  }

  if (status === "loading") {
    return "Checking...";
  }

  return null;
}

function resolveStatus(preferenceEnabled: boolean, permission: NotificationPermission | "unsupported"): ReminderStatus {
  if (permission === "unsupported" || !ONESIGNAL_APP_ID) {
    return "unsupported";
  }

  if (!preferenceEnabled) {
    return "off";
  }

  if (permission === "granted") {
    return "on";
  }

  if (permission === "denied") {
    return "blocked";
  }

  return "needs-permission";
}

async function initializeOneSignalAndLogin(currentUserId: string) {
  if (!ONESIGNAL_APP_ID || !isPushSupported() || Notification.permission !== "granted") {
    return false;
  }

  return new Promise<boolean>((resolve) => {
    window.OneSignalDeferred = window.OneSignalDeferred ?? [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        if (!window.__yawmOneSignalInitialized) {
          await OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            notifyButton: { enable: false },
          });
          window.__yawmOneSignalInitialized = true;
        }

        if (window.__yawmOneSignalExternalId !== currentUserId && typeof OneSignal.login === "function") {
          await OneSignal.login(currentUserId);
          window.__yawmOneSignalExternalId = currentUserId;
        }

        resolve(true);
      } catch {
        resolve(false);
      }
    });
  });
}

async function requestNotificationPermission(currentUserId: string) {
  if (!ONESIGNAL_APP_ID || !isPushSupported()) {
    return "unsupported" as const;
  }

  return new Promise<Exclude<ReminderStatus, "idle" | "loading" | "off">>((resolve) => {
    window.OneSignalDeferred = window.OneSignalDeferred ?? [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        if (!window.__yawmOneSignalInitialized) {
          await OneSignal.init({
            appId: ONESIGNAL_APP_ID,
            notifyButton: { enable: false },
          });
          window.__yawmOneSignalInitialized = true;
        }

        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
          const granted =
            typeof OneSignal.Notifications?.requestPermission === "function"
              ? await OneSignal.Notifications.requestPermission()
              : (await Notification.requestPermission()) === "granted";
          const permissionAfterRequest = Notification.permission as NotificationPermission;

          if (!granted && permissionAfterRequest === "denied") {
            resolve("blocked");
            return;
          }
        }

        if (Notification.permission === "denied") {
          resolve("blocked");
          return;
        }

        if (Notification.permission !== "granted") {
          resolve("needs-permission");
          return;
        }

        if (window.__yawmOneSignalExternalId !== currentUserId && typeof OneSignal.login === "function") {
          await OneSignal.login(currentUserId);
          window.__yawmOneSignalExternalId = currentUserId;
        }

        resolve("on");
      } catch {
        resolve("unsupported");
      }
    });
  });
}

export async function autoLinkOneSignalIfAllowed(currentUserId: string) {
  try {
    const preferenceEnabled = await fetchNotificationPreference(currentUserId);

    if (!preferenceEnabled || getBrowserPermission() !== "granted") {
      return false;
    }

    return initializeOneSignalAndLogin(currentUserId);
  } catch {
    return false;
  }
}

export function logoutOneSignal() {
  if (typeof window === "undefined") {
    return;
  }

  window.OneSignalDeferred = window.OneSignalDeferred ?? [];
  window.OneSignalDeferred.push(async (OneSignal) => {
    try {
      if (typeof OneSignal.logout === "function") {
        await OneSignal.logout();
      }
      window.__yawmOneSignalExternalId = undefined;
    } catch {
      // Logout should never block app logout.
    }
  });
}

export function EnableReminders({ currentUserId }: { currentUserId: string }) {
  const [preferenceEnabled, setPreferenceEnabled] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [status, setStatus] = useState<ReminderStatus>("loading");
  const isEnabled = status === "on";
  const isBusy = status === "loading";
  const statusLabel = getStatusLabel(status);

  useEffect(() => {
    let isMounted = true;

    async function loadPreference() {
      setStatus("loading");

      try {
        const enabled = await fetchNotificationPreference(currentUserId);
        const currentPermission = getBrowserPermission();

        if (!isMounted) {
          return;
        }

        setPreferenceEnabled(enabled);
        setPermission(currentPermission);
        setStatus(resolveStatus(enabled, currentPermission));

        if (enabled && currentPermission === "granted") {
          void initializeOneSignalAndLogin(currentUserId);
        }
      } catch {
        if (isMounted) {
          const currentPermission = getBrowserPermission();
          setPreferenceEnabled(true);
          setPermission(currentPermission);
          setStatus(resolveStatus(true, currentPermission));
        }
      }
    }

    loadPreference();

    return () => {
      isMounted = false;
    };
  }, [currentUserId]);

  async function turnRemindersOff() {
    setStatus("loading");
    setPreferenceEnabled(false);

    try {
      await upsertNotificationPreference(currentUserId, false);
      logoutOneSignal();
      setStatus("off");
    } catch {
      const currentPermission = getBrowserPermission();
      setPreferenceEnabled(true);
      setPermission(currentPermission);
      setStatus(resolveStatus(true, currentPermission));
    }
  }

  async function turnRemindersOn() {
    setStatus("loading");

    try {
      await upsertNotificationPreference(currentUserId, true);
      setPreferenceEnabled(true);
      const nextStatus = await requestNotificationPermission(currentUserId);
      const currentPermission = getBrowserPermission();
      setPermission(currentPermission);
      setStatus(nextStatus === "on" ? "on" : resolveStatus(true, currentPermission));
    } catch {
      const currentPermission = getBrowserPermission();
      setPermission(currentPermission);
      setStatus(resolveStatus(preferenceEnabled ?? true, currentPermission));
    }
  }

  async function handleToggleReminders() {
    if (isBusy || !ONESIGNAL_APP_ID) {
      return;
    }

    if (preferenceEnabled && permission === "granted") {
      await turnRemindersOff();
      return;
    }

    await turnRemindersOn();
  }

  return (
    <section className="rounded-[20px] border border-white/10 bg-[#101a25]/74 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#16261f] text-[#83db76]">
          <Bell className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-zinc-100">Reminders</p>
          <p className="mt-0.5 text-xs leading-snug text-zinc-500">
            Get notified when someone updates a habit.
          </p>
          {statusLabel ? (
            <p className={cn("mt-1.5 text-xs font-medium", isEnabled ? "text-[#8be184]" : "text-zinc-400")}>
              {statusLabel}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleToggleReminders}
          disabled={isBusy || !ONESIGNAL_APP_ID}
          role="switch"
          aria-checked={isEnabled}
          aria-label="Toggle reminders"
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70",
            isEnabled
              ? "border-[#8be184]/50 bg-[#63c650]"
              : "border-white/10 bg-[#2a3440]",
          )}
        >
          <span
            className={cn(
              "absolute left-0.5 top-0.5 grid h-6 w-6 place-items-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-transform duration-200",
              isEnabled ? "translate-x-5" : "translate-x-0",
            )}
          >
            {isBusy ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" /> : null}
          </span>
          <span className="sr-only">{isEnabled ? "Reminders on" : "Reminders off"}</span>
        </button>
      </div>
    </section>
  );
}
