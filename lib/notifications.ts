import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  return true;
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }
  const granted = await ensureNotificationPermission();
  if (!granted) return null;
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch {
    return null;
  }
}

export type CampaignTarget =
  | { kind: "product"; id: string }
  | { kind: "category"; id: string }
  | { kind: "home" };

export async function sendLocalCampaign(opts: {
  title: string;
  body: string;
  target: CampaignTarget;
  delaySeconds?: number;
}): Promise<boolean> {
  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  const seconds = opts.delaySeconds ?? 1;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: opts.title,
      body: opts.body,
      data: { target: opts.target },
    },
    trigger: seconds > 0 ? ({ seconds, repeats: false } as any) : null,
  });
  return true;
}

export function buildDeepLinkFromTarget(target: CampaignTarget): string {
  switch (target.kind) {
    case "product":
      return `/(main)/products/${target.id}`;
    case "category":
      return `/(main)/categories/${target.id}`;
    case "home":
      return "/(tabs)";
  }
}
