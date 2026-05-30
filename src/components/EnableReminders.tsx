"use client";

import { useState } from "react";

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

type ReminderStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

type OneSignalApi = {
  init: (options: { appId: string; notifyButton: { enable: boolean } }) => Promise<void>;
  login?: (externalId: string) => Promise<void>;
  logout?: () => Promise<void>;
  Notifications?: {
    permission?: boolean;
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

function getStatusLabel(status: ReminderStatus) {
  if (status === "granted") {
    return "granted";
  }

  if (status === "denied") {
    return "denied";
  }

  if (status === "unsupported") {
    return "unsupported";
  }

  return null;
}

async function initializeAndRequestPermission(currentUserId: string) {
  if (!ONESIGNAL_APP_ID) {
    return "unsupported" as const;
  }

  if (!isPushSupported()) {
    return "unsupported" as const;
  }

  return new Promise<Exclude<ReminderStatus, "idle" | "loading">>((resolve) => {
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

        if (Notification.permission === "granted") {
          resolve("granted");
          return;
        }

        if (Notification.permission === "denied") {
          resolve("denied");
          return;
        }

        const permissionGranted =
          typeof OneSignal.Notifications?.requestPermission === "function"
            ? await OneSignal.Notifications.requestPermission()
            : (await Notification.requestPermission()) === "granted";
        const permissionAfterRequest = Notification.permission as NotificationPermission;

        resolve(permissionGranted ? "granted" : permissionAfterRequest === "denied" ? "denied" : "unsupported");
      } catch {
        resolve("unsupported");
      }
    });
  });
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

export function isOneSignalReadyForPartnerNotify() {
  return (
    typeof window !== "undefined" &&
    window.__yawmOneSignalInitialized === true &&
    "Notification" in window &&
    Notification.permission === "granted"
  );
}

export function EnableReminders({ currentUserId }: { currentUserId: string }) {
  const [status, setStatus] = useState<ReminderStatus>("idle");
  const isConfigured = Boolean(ONESIGNAL_APP_ID);
  const statusLabel = isConfigured ? getStatusLabel(status) : "setup needed";

  async function handleEnableReminders() {
    setStatus("loading");
    const nextStatus = await initializeAndRequestPermission(currentUserId);
    setStatus(nextStatus);
  }

  return (
    <section className="mt-4 rounded-[18px] border border-white/10 bg-[#101a25]/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-100">Enable reminders</p>
          {statusLabel ? <p className="mt-1 text-xs font-medium text-zinc-500">{statusLabel}</p> : null}
        </div>
        <button
          type="button"
          onClick={handleEnableReminders}
          disabled={!isConfigured || status === "loading"}
          className="min-h-9 shrink-0 rounded-xl bg-[#58ad42] px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {!isConfigured ? "Setup" : status === "loading" ? "Checking..." : "Enable"}
        </button>
      </div>
    </section>
  );
}
