import React, { useState } from 'react';
import { analyzeHtml, calculateScore } from './utils/seoAnalyzer';
import { getSeoInsights } from './services/geminiService';
import { FullAuditReport } from './types';
import AuditForm from './components/AuditForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [report, setReport] = useState<FullAuditReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async (html: string) => {
    setLoading(true);
    try {
      // 1. Deterministic Analysis
      const metrics = analyzeHtml(html);
      const score = calculateScore(metrics);

      // 2. Local Rules Engine (Replaces AI)
      const aiResponse = await getSeoInsights(metrics, html);

      setReport({
        metrics,
        score,
        aiInsights: aiResponse.insights,
      });
    } catch (err) {
      console.error("Audit failed", err);
      alert("An error occurred during the audit. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">OptiFlow</span>
          </div>
          <div>
            <span className="text-xs font-mono text-slate-500">v1.2.0-offline</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!report ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Master Your <span className="text-indigo-500">On-Page SEO</span>
              </h1>
              <p className="text-lg text-slate-400">
                Audit your semantic structure, social signals, and technical health instantly.
                Powered by verifiable metrics and strategic rule-based analysis.
              </p>
            </div>
            <AuditForm onAnalyze={handleAudit} isLoading={loading} />
          </div>
        ) : (
          <Dashboard report={report} onReset={() => setReport(null)} />
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} OptiFlow. Local Analysis Engine.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;