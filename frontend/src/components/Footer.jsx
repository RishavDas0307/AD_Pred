import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-charcoal-border bg-white py-6 px-4 sm:px-8 text-xs text-charcoal-variant">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-charcoal-variant/90">
            <strong>AD_Pred:</strong> Alzheimer's Disease Clinical Intelligence & Explainability Platform.
          </p>
          <p className="text-[11px] text-charcoal-muted mt-0.5">
            Predictions are generated for scientific research and educational decision-support only. Not a medical diagnostic system.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-charcoal-muted">
          <Link to="/about" className="hover:text-primary transition-colors">Ethics Policy</Link>
          <Link to="/about" className="hover:text-primary transition-colors">Limitations</Link>
          <Link to="/docs" className="hover:text-primary transition-colors">API Reference</Link>
        </div>
      </div>
    </footer>
  );
}