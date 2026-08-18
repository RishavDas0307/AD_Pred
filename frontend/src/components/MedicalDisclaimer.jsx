import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MedicalDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-charcoal-variant/80 bg-surface-container-low px-3 py-1.5 rounded-lg border border-charcoal-border">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span>For clinical research and decision-support evaluation only. Not a standalone diagnostic tool.</span>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3 text-sm text-charcoal-variant">
      <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-charcoal text-xs uppercase tracking-wider block mb-0.5">Research & Decision-Support Notice</span>
        <p className="text-xs leading-relaxed text-charcoal-variant">
          AD_Pred is an investigational machine learning platform designed to assist researchers and clinicians in exploring risk factors associated with cognitive decline. Predictions and risk estimates are generated from statistical patterns in clinical datasets and must not replace professional clinical evaluation, biomarker confirmation, or physician diagnosis.
        </p>
      </div>
    </div>
  );
}
