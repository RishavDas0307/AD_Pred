import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  GitCompare,
  Eye,
  Database,
  FlaskConical,
  Info,
  FileCode,
  ShieldCheck,
  Cpu
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Prediction', to: '/predict', icon: Activity, badge: 'Live' },
  { name: 'Model Comparison', to: '/models', icon: GitCompare, badge: '4 Models' },
  { name: 'Explainability', to: '/explainability', icon: Eye, badge: 'SHAP' },
  { name: 'Dataset & Analysis', to: '/dataset', icon: Database, badge: '2,149' },
  { name: 'Research', to: '/research', icon: FlaskConical },
  { name: 'About', to: '/about', icon: Info },
  { name: 'API Docs', to: '/docs', icon: FileCode },
];

export default function Sidebar({ mobileOpen = false, onCloseMobile }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#ffffff] border-r border-charcoal-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-charcoal-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/30">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-primary tracking-tight">AD_Pred</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-charcoal-variant font-medium">Clinical Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-6 space-y-1 flex-1">
            <div className="px-3 pb-2">
              <span className="text-[11px] font-bold text-charcoal-variant/70 uppercase tracking-wider">
                Clinical Workflow
              </span>
            </div>

            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold shadow-xs'
                        : 'text-charcoal-variant hover:text-charcoal hover:bg-surface-container-low'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-surface-container text-charcoal-variant">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* System Spec & Architecture Footnote */}
          <div className="p-4 m-3 rounded-xl bg-surface-container-low border border-charcoal-border">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-charcoal">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>Inference Engine</span>
            </div>
            <p className="text-[11px] text-charcoal-variant leading-relaxed mb-2">
              Ensemble of 4 validated classifiers with SHAP additive feature attribution.
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-charcoal-variant/80 pt-2 border-t border-charcoal-border/60">
              <span>Structured Cohort</span>
              <span className="font-semibold text-charcoal">2,149 Patients</span>
            </div>
          </div>

          {/* Research Disclaimer Pill */}
          <div className="p-4 border-t border-charcoal-border text-[11px] text-charcoal-variant/80 flex items-center gap-2 bg-surface">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>Research & Decision Support Prototype</span>
          </div>
        </div>
      </aside>
    </>
  );
}
