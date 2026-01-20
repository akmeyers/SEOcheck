import React, { useState } from 'react';

interface AuditFormProps {
  onAnalyze: (html: string) => void;
  isLoading: boolean;
}

const AuditForm: React.FC<AuditFormProps> = ({ onAnalyze, isLoading }) => {
  const [htmlInput, setHtmlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!htmlInput.trim()) {
      setError("Please paste some HTML content to analyze.");
      return;
    }
    setError(null);
    onAnalyze(htmlInput);
  };

  const loadExample = () => {
    const example = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example Page Title That Is A Bit Too Long For SEO Best Practices And Should Be Shortened</title>
    <meta name="description" content="This is a meta description example.">
</head>
<body>
    <h1>Welcome to the Example</h1>
    <p>This is a paragraph of text content. It is very short.</p>
    <img src="image.jpg" />
    <a href="https://example.com">Link</a>
</body>
</html>
    `;
    setHtmlInput(example.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">New Audit</h2>
        <p className="text-slate-400">Paste your raw HTML source code below. For the most accurate audit, use "View Page Source" on your target page and copy everything.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="w-full h-64 bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
            placeholder="<!DOCTYPE html>..."
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setHtmlInput('')}
            className="absolute top-2 right-2 text-xs text-slate-500 hover:text-white bg-slate-800 px-2 py-1 rounded border border-slate-700"
          >
            Clear
          </button>
        </div>

        {error && <div className="text-rose-400 text-sm">{error}</div>}

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={loadExample}
            className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
          >
            Load Example
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all transform active:scale-95 flex items-center gap-2 ${
              isLoading 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <span>Run Audit</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuditForm;