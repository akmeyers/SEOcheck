import React, { useState } from 'react';
import { FullAuditReport } from '../types';
import MetricCard from './MetricCard';
import RatioChart from './RatioChart';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  PhotoIcon,
  CodeBracketIcon,
  TagIcon,
  LinkIcon,
  CpuChipIcon,
  ShareIcon,
  CommandLineIcon,
  XMarkIcon,
  ShieldCheckIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  report: FullAuditReport;
  onReset: () => void;
}

// SEO Definitions for Tooltips - Updated based on Google Search Central
const SEO_DEFINITIONS = {
  title: "HTML <title>. Google typically displays the first 50-60 characters. It's the strongest relevance signal.",
  desc: "Meta descriptions don't directly affect ranking, but they strongly influence click-through rate (CTR). Aim for 150-160 chars.",
  h1: "The main heading. Google uses H1s to understand the primary topic. Multiple H1s are allowed in HTML5 but single H1 is still best practice.",
  structure: "Proper heading hierarchy (H1 -> H2 -> H3) helps Google and screen readers understand content structure.",
  viewport: "Required for mobile-friendly indexing. Without this, the page fails Google's Mobile Usability check.",
  canonical: "Prevents 'duplicate content' penalties by telling Google which URL is the original version.",
  cls: "Cumulative Layout Shift prevention. Images must have explicit 'width' and 'height' attributes to reserve space and prevent layout jumping.",
  security: "External links opening in new tabs (target='_blank') must use rel='noopener' to prevent security vulnerabilities (tabnabbing).",
  a11y: "Google favors accessible pages. All form inputs must have associated labels for screen readers.",
  alt: "Alt text describes images to search engines. Essential for Google Images ranking and accessibility.",
  anchors: "Anchor text tells Google what the linked page is about. Avoid 'click here'.",
  internal: "Internal links spread 'link juice' (PageRank) to other pages on your site.",
};

const Dashboard: React.FC<DashboardProps> = ({ report, onReset }) => {
  const { metrics, score, aiInsights } = report;
  const [modalData, setModalData] = useState<{ title: string; items: string[] } | null>(null);

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status 
      ? <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
      : <XCircleIcon className="w-5 h-5 text-rose-400" />;
  };

  const BooleanRow = ({ label, value, info }: { label: string, value: boolean, info?: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0 group">
      <div className="flex items-center gap-2">
         <span className="text-slate-400 text-sm">{label}</span>
         {info && (
           <div className="relative group/tooltip inline-block">
             <div className="w-4 h-4 rounded-full bg-slate-700 text-slate-400 text-[10px] flex items-center justify-center cursor-help">?</div>
             <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded border border-slate-700 shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10 text-center z-50">
               {info}
             </div>
           </div>
         )}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase ${value ? 'text-emerald-400' : 'text-rose-400'}`}>
          {value ? 'Pass' : 'Fail'}
        </span>
        <StatusIcon status={value} />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Header / Score */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-300">Objective Health Score</h2>
              <p className="text-slate-400 text-sm mt-1">Calculated from {Object.keys(metrics).length} verifiable data points</p>
            </div>
            <div className={`relative w-32 h-32 rounded-full flex items-center justify-center border-8 ${score >= 80 ? 'border-emerald-500' : score >= 50 ? 'border-amber-500' : 'border-rose-500'}`}>
               <span className="text-4xl font-bold text-white">{score}</span>
            </div>
        </div>
        
        <div className="md:w-1/3 bg-indigo-600 rounded-2xl p-6 shadow-xl shadow-indigo-500/10 flex flex-col justify-center items-start">
            <h3 className="text-white font-bold text-lg mb-2">Audit Status</h3>
            <p className="text-indigo-100 text-sm mb-4">
              {score > 80 ? 'Site is adhering to most technical standards.' : 'Critical technical or content issues detected.'}
            </p>
            <button onClick={onReset} className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
              New Audit
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Essentials */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-indigo-400" /> Essentials
          </h3>
          
          <MetricCard 
            title="Page Title" 
            value={metrics.titleLength + ' chars'}
            status={metrics.title && metrics.titleLength <= 70 && metrics.titleLength > 10 ? 'good' : 'warning'}
            details={metrics.title || "Missing Title Tag"}
            infoText={SEO_DEFINITIONS.title}
          />
          
          <MetricCard 
            title="Meta Description" 
            value={metrics.metaDescriptionLength + ' chars'}
            status={metrics.metaDescription && metrics.metaDescriptionLength >= 50 && metrics.metaDescriptionLength <= 300 ? 'good' : 'warning'}
            details={metrics.metaDescription || "Missing Meta Description"}
            infoText={SEO_DEFINITIONS.desc}
          />

          <div className="grid grid-cols-2 gap-4">
            <MetricCard 
                title="H1" 
                value={metrics.h1Count}
                status={metrics.h1Count === 1 ? 'good' : 'error'}
                infoText={SEO_DEFINITIONS.h1}
            />
            <MetricCard 
                title="Structure" 
                value={metrics.h2Count > 0 ? "Good" : "Flat"}
                status={metrics.h2Count > 0 ? 'good' : 'neutral'}
                details={`${metrics.h2Count} H2s Found`}
                infoText={SEO_DEFINITIONS.structure}
            />
          </div>
        </div>

        {/* 2. Technical Health */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CpuChipIcon className="w-5 h-5 text-rose-400" /> Technical Health
          </h3>
          <div className="bg-slate-900 rounded-xl p-4">
            <BooleanRow label="Mobile Viewport" value={!!metrics.viewport} info={SEO_DEFINITIONS.viewport} />
            <BooleanRow label="Canonical Tag" value={!!metrics.canonical} info={SEO_DEFINITIONS.canonical} />
            <BooleanRow label="Language Tag" value={!!metrics.lang} />
            <BooleanRow label="Valid Doctype" value={metrics.hasDoctype} />
            <div className="flex items-center justify-between py-2 border-b border-slate-700 group">
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">Forms Labeled</span>
                    <div className="relative group/tooltip inline-block">
                        <div className="w-4 h-4 rounded-full bg-slate-700 text-slate-400 text-[10px] flex items-center justify-center cursor-help">?</div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded border border-slate-700 shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10 text-center z-50">{SEO_DEFINITIONS.a11y}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase ${metrics.inputsWithoutLabels === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {metrics.inputsWithoutLabels === 0 ? 'Pass' : `${metrics.inputsWithoutLabels} Fail`}
                    </span>
                    <StatusIcon status={metrics.inputsWithoutLabels === 0} />
                </div>
            </div>
          </div>
        </div>

        {/* 3. Content Analysis */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CodeBracketIcon className="w-5 h-5 text-emerald-400" /> Content Analysis
          </h3>
          <RatioChart textRatio={metrics.textToHtmlRatio} />
          <div className="mt-4 grid grid-cols-2 gap-4">
             <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 group relative">
               <div className="text-xs text-slate-400 uppercase flex items-center gap-1">
                   Words
               </div>
               <div className="text-xl font-bold text-white">{metrics.wordCount}</div>
             </div>
             <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600 relative group">
               <div className="text-xs text-slate-400 uppercase">Code Size</div>
               <div className="text-xl font-bold text-white">{(metrics.htmlSizeBytes / 1024).toFixed(1)} KB</div>
             </div>
          </div>
        </div>

        {/* 4. Semantic Structure */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CommandLineIcon className="w-5 h-5 text-amber-400" /> Semantic Structure
          </h3>
          <div className="bg-slate-900 rounded-xl p-4">
            <BooleanRow label="<nav> used" value={metrics.hasNav} />
            <BooleanRow label="<footer> used" value={metrics.hasFooter} />
            <BooleanRow label="<main> used" value={metrics.hasMain} />
            <BooleanRow label="<article> used" value={metrics.hasArticle} />
            <BooleanRow label="<section> used" value={metrics.hasSection} />
          </div>
        </div>

        {/* 5. Social Signals */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShareIcon className="w-5 h-5 text-blue-400" /> Social Signals
          </h3>
          <div className="space-y-4">
             <MetricCard 
                title="OpenGraph Title" 
                value={metrics.ogTitle ? "Present" : "Missing"}
                status={metrics.ogTitle ? 'good' : 'warning'}
                details="Recommended for Facebook/LinkedIn"
             />
             <MetricCard 
                title="OpenGraph Image" 
                value={metrics.ogImage ? "Present" : "Missing"}
                status={metrics.ogImage ? 'good' : 'warning'}
             />
             <MetricCard 
                title="Twitter Card" 
                value={metrics.twitterCard ? "Present" : "Missing"}
                status={metrics.twitterCard ? 'good' : 'neutral'}
             />
          </div>
        </div>

        {/* 6. Media, Links & CLS */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-purple-400" /> Linking & Core Vitals
          </h3>

          {/* New: Security Check */}
          {metrics.unsafeCrossOriginLinks > 0 && (
              <div className="p-3 bg-rose-900/20 border border-rose-500/30 rounded-lg flex items-start gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                      <h4 className="text-sm font-bold text-rose-400">Security Risk</h4>
                      <p className="text-xs text-slate-400 mt-1">
                          {metrics.unsafeCrossOriginLinks} links use target="_blank" without rel="noopener".
                      </p>
                      <button onClick={() => setModalData({ title: 'Unsafe Cross-Origin Links', items: metrics.unsafeLinks })} className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 underline">View details</button>
                  </div>
              </div>
          )}

          <div className="grid grid-cols-2 gap-4">
             <MetricCard 
               title="Internal Links" 
               value={metrics.internalLinks}
               status={metrics.internalLinks > 0 ? 'good' : 'warning'}
               infoText={SEO_DEFINITIONS.internal}
             />
             <MetricCard 
               title="Anchor Quality" 
               value={metrics.linksWithGenericText === 0 ? "Good" : "Generic"}
               status={metrics.linksWithGenericText === 0 ? 'good' : 'warning'}
               infoText={SEO_DEFINITIONS.anchors}
               onInspect={metrics.linksWithGenericText > 0 ? () => setModalData({ title: 'Generic Anchor Text', items: metrics.genericTextLinks }) : undefined}
             />
          </div>

          <div className="pt-2 border-t border-slate-700">
            <MetricCard 
              title="Image Dimensions (CLS)" 
              value={`${metrics.imagesTotal - metrics.imagesWithoutDimensions} / ${metrics.imagesTotal}`}
              status={metrics.imagesWithoutDimensions === 0 ? 'good' : 'error'}
              details={metrics.imagesWithoutDimensions > 0 ? "Images missing width/height cause layout shifts" : "All images have explicit dimensions"}
              infoText={SEO_DEFINITIONS.cls}
              onInspect={metrics.imagesWithoutDimensions > 0 ? () => setModalData({ title: 'Images Missing Dimensions (CLS Risk)', items: metrics.missingDimensionImages }) : undefined}
            />
          </div>
          
           <div className="pt-2 border-t border-slate-700">
            <MetricCard 
              title="Image Alt Tags" 
              value={`${metrics.imagesTotal - metrics.imagesWithoutAlt} / ${metrics.imagesTotal}`}
              status={metrics.imagesWithoutAlt === 0 ? 'good' : 'warning'}
              details={metrics.imagesWithoutAlt > 0 ? "Missing description" : "Fully Optimized"}
              infoText={SEO_DEFINITIONS.alt}
              onInspect={metrics.imagesWithoutAlt > 0 ? () => setModalData({ title: 'Images Missing Alt Text', items: metrics.missingAltImages }) : undefined}
            />
          </div>
        </div>

      </div>

      {/* Strategic Insights Section */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Strategic Analysis</span>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded-full border border-indigo-500/30">Auto-Generated</span>
          </h3>
        </div>

        {(!aiInsights || aiInsights.length === 0) ? (
          <div className="text-slate-400 text-center py-8">Great job! No major critical issues were detected by the strategy engine.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 flex gap-4 transition-hover hover:border-slate-600">
                <div className="mt-1 shrink-0">
                  {insight.severity === 'high' ? <XCircleIcon className="w-6 h-6 text-rose-500" /> : 
                   insight.severity === 'medium' ? <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" /> : 
                   <CheckCircleIcon className="w-6 h-6 text-emerald-500" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2 flex-wrap">
                    {insight.title}
                    <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded border ${
                      insight.category === 'content' ? 'border-emerald-500/30 text-emerald-400' :
                      insight.category === 'technical' ? 'border-rose-500/30 text-rose-400' :
                      insight.category === 'keywords' ? 'border-amber-500/30 text-amber-400' :
                      insight.category === 'linking' ? 'border-purple-500/30 text-purple-400' :
                      'border-indigo-500/30 text-indigo-400'
                    }`}>{insight.category}</span>
                  </h4>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{insight.advice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 max-h-[80vh] flex flex-col animate-[fadeIn_0.2s_ease-out]">
             <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-white">{modalData.title}</h3>
                <button onClick={() => setModalData(null)} className="text-slate-400 hover:text-white">
                  <XMarkIcon className="w-6 h-6" />
                </button>
             </div>
             <div className="p-4 overflow-y-auto">
                <ul className="space-y-3">
                   {modalData.items.map((item, i) => (
                     <li key={i} className="text-sm bg-slate-900/50 p-3 rounded border border-slate-700/50 text-slate-300 break-all font-mono">
                        {item}
                     </li>
                   ))}
                </ul>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;