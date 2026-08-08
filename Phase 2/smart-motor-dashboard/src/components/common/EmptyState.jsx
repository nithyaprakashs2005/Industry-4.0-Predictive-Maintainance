import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-industrial-500">
      <Icon className="w-10 h-10 mb-3 opacity-50" />
      <p className="text-sm font-medium text-industrial-400">{title}</p>
      {description && <p className="text-xs mt-1 text-industrial-500">{description}</p>}
    </div>
  );
}
