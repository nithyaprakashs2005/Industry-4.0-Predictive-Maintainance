import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Cpu, Activity, BarChart3, Brain,
  AlertTriangle, FileText, Settings, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';

const menuSections = [
  {
    title: 'Main',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/motors', label: 'Motors', icon: Cpu },
      { to: '/live-monitoring', label: 'Live Monitoring', icon: Activity },
    ],
  },
  {
    title: 'Analysis',
    items: [
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/predictive-maintenance', label: 'Predictive Maintenance', icon: Brain },
      { to: '/fault-history', label: 'Fault History', icon: AlertTriangle },
    ],
  },
  {
    title: 'Management',
    items: [
      { to: '/reports', label: 'Reports', icon: FileText },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

function SidebarContent({ collapsed, onNavigate }) {
  return (
    <nav className="flex-1 py-4 overflow-y-auto">
      {menuSections.map((section) => (
        <div key={section.title} className="mb-4">
          {!collapsed && (
            <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-industrial-500">
              {section.title}
            </p>
          )}
          <ul className="space-y-0.5 px-2">
            {section.items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors group relative ${
                      isActive
                        ? 'bg-status-info/10 text-status-info border border-status-info/20'
                        : 'text-industrial-400 hover:bg-industrial-800 hover:text-industrial-300'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                  {collapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-industrial-800 border border-industrial-700 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                      {label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const {
    sidebarCollapsed, setSidebarCollapsed,
    mobileSidebarOpen, setMobileSidebarOpen,
  } = useMonitoring();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-industrial-900 border-r border-industrial-700 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
        <div className="p-2 border-t border-industrial-700">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded hover:bg-industrial-800 text-industrial-500 transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-64 bg-industrial-900 border-r border-industrial-700 flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-industrial-700">
              <span className="text-sm font-semibold text-industrial-300">Navigation</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 rounded hover:bg-industrial-800">
                <X className="w-4 h-4 text-industrial-400" />
              </button>
            </div>
            <SidebarContent collapsed={false} onNavigate={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
