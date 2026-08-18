import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Server,
  Activity,
  ChevronDown
} from 'lucide-react';
import { api, API_BASE, isLocalhostTarget, isRunningOnProduction } from '../services/api';

export default function Header({ onOpenMobile }) {
  const [query, setQuery] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'checking' | 'offline'
  const [isRetrying, setIsRetrying] = useState(false);
  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const popoverRef = useRef(null);
  const navigate = useNavigate();

  async function checkBackend(showSpinner = false) {
    if (showSpinner) setIsRetrying(true);
    try {
      const res = await api.checkHealth(10000);
      if (res.status === 'healthy') {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    } finally {
      if (showSpinner) setIsRetrying(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    checkBackend();

    // Polling interval: 12s if offline/checking (to catch Render cold start wakeups), 60s if online
    const interval = setInterval(() => {
      if (isMounted) {
        checkBackend();
      }
    }, backendStatus === 'online' ? 60000 : 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [backendStatus]);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowStatusPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        {/* Backend Connection Indicator with Interactive Inspector */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setShowStatusPopover(!showStatusPopover)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition-all cursor-pointer shadow-xs ${
              backendStatus === 'online'
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/80'
                : backendStatus === 'checking'
                ? 'border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100/80'
                : 'border-rose-200 bg-rose-50/70 text-rose-800 hover:bg-rose-100/80'
            }`}
            title="Click to view API connection details"
          >
            {backendStatus === 'online' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold hidden sm:inline">API Active</span>
                <ChevronDown className="w-3 h-3 text-emerald-700 opacity-70" />
              </>
            ) : backendStatus === 'checking' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="font-semibold hidden sm:inline">Connecting</span>
                <ChevronDown className="w-3 h-3 text-amber-700 opacity-70" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="font-semibold hidden sm:inline">API Offline</span>
                <ChevronDown className="w-3 h-3 text-rose-700 opacity-70" />
              </>
            )}
          </button>

          {/* Status Inspector Dropdown */}
          {showStatusPopover && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-charcoal-border shadow-xl p-4 z-50 animate-fadeIn text-charcoal text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-charcoal-border pb-2.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Server className="w-4 h-4 text-primary" />
                  <span>Inference Server Status</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  backendStatus === 'online'
                    ? 'bg-emerald-100 text-emerald-800'
                    : backendStatus === 'checking'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {backendStatus.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">Target API Endpoint</span>
                <div className="p-2 mt-1 rounded-lg bg-surface-container-low font-mono text-[11px] break-all border border-charcoal-border/50 text-charcoal font-semibold">
                  {API_BASE}
                </div>
              </div>

              {/* Guidance alerts based on environment mismatch or Render cold starts */}
              {backendStatus !== 'online' && (
                <div className="space-y-2">
                  {isRunningOnProduction && isLocalhostTarget ? (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                      <strong>⚠️ Vercel Environment Variable Missing:</strong> Frontend is deployed at <code>{typeof window !== 'undefined' ? window.location.hostname : 'Vercel'}</code> but attempting to reach <code>{API_BASE}</code>.
                      <p className="mt-1">
                        Go to <strong>Vercel Dashboard → Project Settings → Environment Variables</strong>, add <code>VITE_API_URL</code> pointing to your Render backend URL (e.g. <code>https://your-service.onrender.com</code>), and trigger a <strong>Redeploy</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-charcoal-variant text-[11px] leading-relaxed">
                      <strong>💡 Render Free Tier Spin-Down:</strong> Render puts inactive web services into sleep mode. When a new request arrives, it may take <strong>30–50 seconds</strong> to cold-start.
                    </div>
                  )}
                </div>
              )}

              {backendStatus === 'online' && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>FastAPI inference engine is reachable. All 4 ML models and SHAP explainability pipelines are ready.</div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-charcoal-border">
                <button
                  type="button"
                  onClick={() => checkBackend(true)}
                  disabled={isRetrying}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-charcoal font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin text-primary' : ''}`} />
                  <span>{isRetrying ? 'Checking...' : 'Retry Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowStatusPopover(false);
                    navigate('/docs');
                  }}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  API Docs &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New Prediction Quick Action Button */}
        <button
          type="button"
          onClick={() => navigate('/predict')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Assessment</span>
        </button>
      </div>
    </header>
  );
}
