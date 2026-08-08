import { useMonitoring } from '../context/MonitoringContext';

export function useSensorData() {
  const { sensorData, history } = useMonitoring();
  return { sensorData, history };
}

export function useMotorHealth() {
  const { sensorData } = useMonitoring();
  return {
    health: sensorData.health,
    healthLabel: sensorData.healthLabel,
    status: sensorData.status,
  };
}

export function useNotifications() {
  const {
    notifications,
    unreadNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useMonitoring();
  return {
    notifications,
    unreadCount: unreadNotifications.length,
    markRead: markNotificationRead,
    markAllRead: markAllNotificationsRead,
  };
}
