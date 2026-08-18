import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Header({ onOpenMobile }) {
  const [query, setQuery] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api.checkHealth()
      .then((res) => {
        if (mounted) {
          setBackendStatus(res.status === 'healthy' ? 'online' : 'offline');
        }
      })
      .catch(() => {
        if (mounted) setBackendStatus('offline');
      });
    return () => { mounted = false; };
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.toLowerCase().trim();
    if (!q) return;

    if (q.includes('predict') || q.includes('patient') || q.includes('form') || q.includes('eval')) {
      navigate('/predict');
    } else if (q.includes('model') || q.includes('compare') || q.includes('roc') || q.includes('matrix')) {
      navigate('/models');
    } else if (q.includes('shap') || q.includes('explain') || q.includes('feature')) {
      navigate('/explainability');
    } else if (q.includes('data') || q.includes('cohort') || q.includes('distribution')) {
      navigate('/dataset');
    } else if (q.includes('research') || q.includes('method')) {
      navigate('/research');
    } else if (q.includes('about') || q.includes('scope')) {
      navigate('/about');
    } else if (q.includes('api') || q.includes('doc')) {
      navigate('/docs');
    } else {
      navigate('/predict');
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-charcoal-border h-16 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="p-2 rounded-lg text-charcoal-variant hover:bg-surface-container lg:hidden"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar matching Stitch */}
        <form onSubmit={handleSearch} className="relative w-56 sm:w-80 md:w-96">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search records, models, features..."
            className="w-full bg-white border border-charcoal-border rounded-full pl-9 pr-4 py-1.5 text-xs text-charcoal placeholder-charcoal-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-xs"
          />
        </form>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Backend Connection Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border border-charcoal-border bg-white shadow-xs">
          {backendStatus === 'online' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-medium hidden sm:inline">API Active</span>
            </>
          ) : backendStatus === 'checking' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-700 font-medium hidden sm:inline">Connecting</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-rose-700 font-medium hidden sm:inline">Offline (Port 8000)</span>
            </>
          )}
        </div>

        {/* New Prediction Quick Action Button */}
        <button
          type="button"
          onClick={() => navigate('/predict')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Assessment</span>
        </button>
      </div>
    </header>
  );
}
