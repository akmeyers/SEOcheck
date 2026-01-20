import React from 'react';
import { InformationCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline';

interface MetricCardProps {
  title: string;
  value: string | number;
  status?: 'good' | 'warning' | 'error' | 'neutral';
  icon?: React.ReactNode;
  details?: string;
  infoText?: string;
  onInspect?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  status = 'neutral', 
  icon, 
  details, 
  infoText,
  onInspect 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'warning': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'error': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default: return 'text-slate-200 border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getStatusColor()} flex flex-col justify-between relative group`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium opacity-80 uppercase tracking-wide">{title}</h3>
          
          {/* Tooltip Icon */}
          {infoText && (
            <div className="relative group/tooltip inline-block">
              <InformationCircleIcon className="w-4 h-4 text-slate-400 cursor-help hover:text-white" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded border border-slate-700 shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10 text-center">
                {infoText}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-slate-900 border-r border-b border-slate-700 transform rotate-45 -mt-1"></div>
              </div>
            </div>
          )}
        </div>
        {icon && <div className="opacity-70">{icon}</div>}
      </div>
      
      <div>
        <div className="text-2xl font-bold flex items-center justify-between">
            <span>{value}</span>
            {onInspect && (
                <button 
                  onClick={onInspect}
                  className="p-1 rounded bg-slate-900/50 hover:bg-slate-900 text-indigo-400 border border-indigo-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                  title="View list of items"
                >
                    <ListBulletIcon className="w-4 h-4" />
                    <span className="hidden group-hover:inline">Details</span>
                </button>
            )}
        </div>
        {details && <div className="text-xs mt-1 opacity-70 truncate" title={details}>{details}</div>}
      </div>
    </div>
  );
};

export default MetricCard;
