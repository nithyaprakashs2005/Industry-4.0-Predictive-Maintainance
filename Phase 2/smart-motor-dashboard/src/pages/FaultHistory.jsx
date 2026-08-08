import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useMonitoring } from '../context/MonitoringContext';
import PageHeader from '../components/layout/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import { MOTORS } from '../data/motors';

const PAGE_SIZE = 5;

export default function FaultHistory() {
  const { faultHistory } = useMonitoring();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [motorFilter, setMotorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return faultHistory.filter((f) => {
      if (search && !f.fault.toLowerCase().includes(search.toLowerCase()) && !f.motorId.toLowerCase().includes(search.toLowerCase())) return false;
      if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
      if (motorFilter !== 'all' && f.motorId !== motorFilter) return false;
      if (statusFilter !== 'all' && f.status.toLowerCase() !== statusFilter) return false;
      if (dateFilter && f.date !== dateFilter) return false;
      return true;
    });
  }, [faultHistory, search, severityFilter, motorFilter, statusFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader title="Fault History" subtitle="Complete log of detected faults and maintenance actions" />

      <div className="card-industrial p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-industrial-500" />
            <input
              type="text"
              placeholder="Search faults..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-industrial w-full pl-9"
            />
          </div>
          <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }} className="input-industrial">
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
          </select>
          <select value={motorFilter} onChange={(e) => { setMotorFilter(e.target.value); setPage(1); }} className="input-industrial">
            <option value="all">All Motors</option>
            {MOTORS.map((m) => <option key={m.id} value={m.id}>{m.id}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-industrial">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
          <input type="date" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} className="input-industrial" />
        </div>
      </div>

      <div className="card-industrial overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-industrial-800/50 text-industrial-500 border-b border-industrial-700">
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Motor ID</th>
                <th className="text-left px-4 py-3 font-medium">Fault</th>
                <th className="text-left px-4 py-3 font-medium">Parameter</th>
                <th className="text-left px-4 py-3 font-medium">Value</th>
                <th className="text-left px-4 py-3 font-medium">Severity</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-industrial-500">No faults match your filters</td>
                </tr>
              ) : (
                paginated.map((f) => (
                  <tr key={f.id} className="border-b border-industrial-800 hover:bg-industrial-800/30">
                    <td className="px-4 py-3 text-industrial-400">{f.date}</td>
                    <td className="px-4 py-3 text-industrial-400">{f.time}</td>
                    <td className="px-4 py-3 font-medium text-industrial-300">{f.motorId}</td>
                    <td className="px-4 py-3 text-industrial-300">{f.fault}</td>
                    <td className="px-4 py-3 text-industrial-400">{f.parameter}</td>
                    <td className="px-4 py-3 tabular-nums text-industrial-300">{f.value}</td>
                    <td className="px-4 py-3"><StatusBadge status={f.severity} /></td>
                    <td className="px-4 py-3"><StatusBadge status={f.status.toLowerCase()} /></td>
                    <td className="px-4 py-3 text-industrial-400">{f.action}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-industrial-700">
          <span className="text-[10px] text-industrial-500">
            Showing {paginated.length} of {filtered.length} faults
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="text-[10px] px-3 py-1.5 rounded bg-industrial-800 border border-industrial-700 disabled:opacity-40 hover:bg-industrial-700"
            >
              Previous
            </button>
            <span className="text-[10px] text-industrial-400">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="text-[10px] px-3 py-1.5 rounded bg-industrial-800 border border-industrial-700 disabled:opacity-40 hover:bg-industrial-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
