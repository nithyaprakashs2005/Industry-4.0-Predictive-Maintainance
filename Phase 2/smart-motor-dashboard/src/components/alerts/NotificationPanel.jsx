import { useMonitoring } from '../../context/MonitoringContext';

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function NotificationPanel({ onClose }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useMonitoring();

  return (
    <div className="absolute right-0 top-full mt-1 w-80 card-industrial animate-slide-in z-50 shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-industrial-700">
        <h3 className="text-xs font-semibold text-industrial-300">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-[10px] text-status-info hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-xs text-industrial-500 text-center py-8">No notifications</p>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => { markNotificationRead(n.id); }}
              className={`w-full text-left px-4 py-3 border-b border-industrial-700 hover:bg-industrial-800 transition-colors ${
                !n.read ? 'bg-status-info/10' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-status-info mt-1.5 shrink-0" />}
                <div className={!n.read ? '' : 'ml-3.5'}>
                  <p className="text-xs font-medium text-industrial-200">{n.title}</p>
                  <p className="text-[10px] text-industrial-400 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-industrial-500 mt-1">{timeAgo(n.timestamp)}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="px-4 py-2 border-t border-industrial-700">
        <button onClick={onClose} className="text-[10px] text-industrial-500 hover:text-industrial-300 w-full text-center">
          Close
        </button>
      </div>
    </div>
  );
}
