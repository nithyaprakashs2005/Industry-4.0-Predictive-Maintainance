import { useState, useEffect } from 'react';
import { Cog, Bell, User, ChevronDown, Menu } from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import NotificationPanel from '../alerts/NotificationPanel';

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { unreadNotifications, setMobileSidebarOpen } = useMonitoring();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('en-US', { hour12: true });
  const unreadCount = unreadNotifications.length;

  return (
    <>
      <header className="sticky top-0 z-40 h-14 bg-industrial-900 border-b border-industrial-700 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded hover:bg-industrial-800 text-industrial-400"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-status-info/20 border border-status-info/30 flex items-center justify-center">
              <Cog className="w-4 h-4 text-status-info" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-industrial-300 leading-tight">
                Smart Motor Monitoring
              </h1>
              <p className="text-[10px] text-industrial-500 leading-tight">
                Predictive Maintenance Platform
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-industrial-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-normal opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-normal animate-pulse-live" />
            </span>
            <span className="text-status-normal font-medium">System Online</span>
          </div>
          <span>Last Update: {timeStr}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="md:hidden flex items-center gap-1.5 mr-1">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-normal animate-pulse-live" />
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2 rounded hover:bg-industrial-800 text-industrial-400 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-status-critical text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-2 p-1.5 rounded hover:bg-industrial-800 text-industrial-400 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-industrial-700 flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:block text-xs">Operator</span>
              <ChevronDown className="w-3 h-3 hidden sm:block" />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full mt-1 w-48 card-industrial animate-slide-in z-50">
                <div className="p-3 border-b border-industrial-700">
                  <p className="text-xs font-medium text-industrial-300">Plant Operator</p>
                  <p className="text-[10px] text-industrial-500">operator@plant.local</p>
                </div>
                <div className="p-1">
                  <button className="w-full text-left px-3 py-2 text-xs rounded hover:bg-industrial-800 text-industrial-400">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs rounded hover:bg-industrial-800 text-industrial-400">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
