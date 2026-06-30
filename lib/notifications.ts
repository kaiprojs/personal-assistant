import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { parseDateString } from './dates';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleTaskReminder(
  taskId: string,
  title: string,
  dueDate: string,
  dueTime: string | null,
): Promise<string | null> {
  const granted = await requestNotificationPermissions();
  if (!granted) return null;

  const [hours, minutes] = dueTime
    ? dueTime.split(':').map(Number)
    : [9, 0];
  const triggerDate = parseDateString(dueDate);
  triggerDate.setHours(hours, minutes, 0, 0);

  if (triggerDate.getTime() <= Date.now()) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task reminder',
      body: title,
      data: { taskId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  return id;
}

export async function cancelNotification(
  notificationId: string | null,
): Promise<void> {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('tasks', {
      name: 'Task reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}
