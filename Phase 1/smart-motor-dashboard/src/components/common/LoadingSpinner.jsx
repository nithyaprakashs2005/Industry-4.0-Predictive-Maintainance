import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-industrial-400">
      <Loader2 className="w-8 h-8 animate-spin text-status-info mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
