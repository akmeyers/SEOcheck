import React, { useState, useEffect } from 'react';
import { 
  EyeIcon, 
  CodeBracketIcon, 
  ArrowPathIcon, 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon,
  ViewColumnsIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

interface OptimizationPreviewProps {
  originalHtml: string;
  fixedHtml: string;
  summary: string;
}

const OptimizationPreview: React.FC<OptimizationPreviewProps> = ({ originalHtml, fixedHtml, summary }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [layout, setLayout] = useState<'split' | 'original' | 'fixed'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-switch to tabbed view on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayout('fixed');
      } else {
        setLayout('split');
      }
    };
    
    // Initial check
    if (window.innerWidth < 768) setLayout('fixed');

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Frame Content Component
  const FrameContent = ({ html, title, type }: { html: string, title: string, type: 'before' | 'after' }) => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-700 last:border-r-0">
      <div className={`px-4 py-2 border-b border-slate-700 flex justify-between items-center ${type === 'before' ? 'bg-rose-900/10' : 'bg-emerald-900/10'}`}>
         <span className={`text-xs font-bold uppercase tracking-wider ${type === 'before' ? 'text-rose-400' : 'text-emerald-400'}`}>
           {title}
         </span>
         <span className="text-[10px] text-slate-500 font-mono">
           {html.length.toLocaleString()} bytes
         </span>
      </div>
      <div className="flex-1 bg-white relative overflow-hidden group">
        {viewMode === 'visual' ? (
          <iframe 
            title={`${title} Preview`}
            srcDoc={html}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts" 
          />
        ) : (
          <textarea 
            readOnly
            className={`w-full h-full p-4 font-mono text-xs leading-relaxed resize-none outline-none ${
              type === 'before' ? 'bg-slate-50 text-slate-700' : 'bg-emerald-50/30 text-slate-800'
            }`}
            value={html}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className={`
      bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col
      transition-all duration-300 ease-in-out
      ${isFullscreen ? 'fixed inset-4 z-50 m-0 rounded-xl shadow-2xl ring-1 ring-slate-700' : 'mt-8 relative'}
    `}>
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-700 bg-slate-900 flex flex-col lg:flex-row justify-between items-center gap-4 shrink-0">
        
        {/* Left: Title & Summary */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ArrowPathIcon className="w-5 h-5 text-emerald-400" />
            Optimization Preview
          </h3>
          <p className="text-slate-400 text-sm mt-1 truncate" title={summary}>{summary}</p>
        </div>
        
        {/* Right: Controls */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Visual/Code Toggle */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('visual')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Visual Preview"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Code Source"
            >
              <CodeBracketIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-slate-700 mx-1"></div>

          {/* Layout Toggle */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setLayout('split')}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${layout === 'split' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <ViewColumnsIcon className="w-3 h-3" /> Split
            </button>
            <button
              onClick={() => setLayout('original')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${layout === 'original' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Original
            </button>
            <button
              onClick={() => setLayout('fixed')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${layout === 'fixed' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Optimized
            </button>
          </div>

          <div className="w-px h-6 bg-slate-700 mx-1"></div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-600"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <ArrowsPointingInIcon className="w-5 h-5" /> : <ArrowsPointingOutIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 min-h-0 bg-slate-950 ${isFullscreen ? '' : 'h-[600px]'}`}>
        <div className="h-full w-full">
          
          {layout === 'split' && (
            <div className="grid grid-cols-2 h-full">
              <FrameContent html={originalHtml} title="Original" type="before" />
              <FrameContent html={fixedHtml} title="Optimized" type="after" />
            </div>
          )}

          {layout === 'original' && (
             <div className="h-full">
                <FrameContent html={originalHtml} title="Original Version" type="before" />
             </div>
          )}

          {layout === 'fixed' && (
             <div className="h-full">
                <FrameContent html={fixedHtml} title="Optimized Version" type="after" />
             </div>
          )}

        </div>
      </div>
      
      {/* Fullscreen Backdrop (only for visual effect behind rounded corners if needed, usually handled by modal z-index) */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm -z-10" aria-hidden="true" />
      )}
    </div>
  );
};

export default OptimizationPreview;