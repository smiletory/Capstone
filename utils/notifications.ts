// utils/notifications.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../constants/firebaseConfig";

// 푸시 알림 토큰 등록 및 저장
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  const user = getAuth().currentUser;
  if (user?.uid) {
    await setDoc(
      doc(db, "users", user.uid),
      {
        expoPushToken: token,
      },
      { merge: true }
    );
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}

// 푸시 알림 전송
export async function sendPushNotification(
  toUid: string,
  message: string,
  title = "새 메시지 도착"
) {
  const userDoc = await getDoc(doc(db, "users", toUid));
  const expoPushToken = userDoc.data()?.expoPushToken;

  if (!expoPushToken) return;

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: "default",
      title,
      body: message,
      data: { userId: toUid },
    }),
  });
}
