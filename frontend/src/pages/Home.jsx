import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  GitCompare,
  Eye,
  Database,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { api } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [datasetStats, setDatasetStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.getEvaluationMetrics().catch(() => null),
      api.getDatasetSummary().catch(() => null)
    ]).then(([evalData, dsData]) => {
      if (mounted) {
        if (evalData) setMetrics(evalData);
        if (dsData) setDatasetStats(dsData);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const benchmarkList = metrics?.benchmarks || [
    { model_name: 'Random Forest', accuracy: 0.9512, precision: 0.9456, recall: 0.9145, f1_score: 0.9298, roc_auc: 0.9374 },
    { model_name: 'XGBoost', accuracy: 0.9465, precision: 0.9388, recall: 0.9079, f1_score: 0.9231, roc_auc: 0.9447 },
    { model_name: 'SVM', accuracy: 0.8419, precision: 0.7442, recall: 0.8421, f1_score: 0.7901, roc_auc: 0.8974 },
    { model_name: 'Logistic Regression', accuracy: 0.8163, precision: 0.6952, recall: 0.8553, f1_score: 0.7670, roc_auc: 0.8831 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-surface rounded-2xl p-6 sm:p-8 border border-primary/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Intelligence Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-charcoal">
            Alzheimer's Disease Prediction & Explainability
          </h1>
          <p className="text-sm text-charcoal-variant leading-relaxed">
            A high-precision machine learning decision-support system analyzing 32 structured clinical, cognitive, lifestyle, and biochemical risk factors with SHAP-based feature interpretability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/predict')}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>New Patient Assessment</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/models')}
            className="px-5 py-2.5 rounded-xl bg-white border border-charcoal-border text-charcoal text-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-2"
          >
            <GitCompare className="w-4 h-4 text-secondary" />
            <span>Compare Models</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between text-charcoal-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Validated Models</span>
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold font-mono text-charcoal">4</div>
          <p className="text-xs text-charcoal-variant mt-1">
            Random Forest, XGBoost, SVM &amp; Logistic Regression
          </p>
        </div>

        {/* Metric 2 */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between text-charcoal-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-mono text-primary">95.1%</div>
          <p className="text-xs text-charcoal-variant mt-1">
            Random Forest (500 Estimators) on validation test set
          </p>
        </div>

        {/* Metric 3 */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between text-charcoal-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Top ROC-AUC</span>
            <Activity className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-3xl font-bold font-mono text-secondary">0.945</div>
          <p className="text-xs text-charcoal-variant mt-1">
            XGBoost Gradient Boosting (Optimal discrimination)
          </p>
        </div>

        {/* Metric 4 */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between text-charcoal-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Clinical Cohort</span>
            <Database className="w-4 h-4 text-tertiary" />
          </div>
          <div className="text-3xl font-bold font-mono text-charcoal">2,149</div>
          <p className="text-xs text-charcoal-variant mt-1">
            Structured records across 32 validated clinical markers
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Modules */}
      <div>
        <h2 className="text-lg font-bold text-charcoal mb-4">Core Clinical Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <Link
            to="/predict"
            className="clinical-card clinical-card-interactive p-5 group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-charcoal mb-1">Patient Assessment</h3>
              <p className="text-xs text-charcoal-variant leading-relaxed">
                Input multi-domain parameters to calculate risk probability with instant validation.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Run Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            to="/models"
            className="clinical-card clinical-card-interactive p-5 group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-white transition-colors">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-charcoal mb-1">Model Evaluation Matrix</h3>
              <p className="text-xs text-charcoal-variant leading-relaxed">
                Compare ROC curves, confusion matrices, precision, and recall across all 4 algorithms.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-secondary gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>View Benchmarks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            to="/explainability"
            className="clinical-card clinical-card-interactive p-5 group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-3 group-hover:bg-tertiary group-hover:text-white transition-colors">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-charcoal mb-1">Explainable AI (SHAP)</h3>
              <p className="text-xs text-charcoal-variant leading-relaxed">
                Directional feature attribution explaining precisely why the model formed its estimate.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-tertiary gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Explore XAI Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            to="/dataset"
            className="clinical-card clinical-card-interactive p-5 group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary-dark flex items-center justify-center mb-3 group-hover:bg-primary-dark group-hover:text-white transition-colors">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-charcoal mb-1">Dataset Intelligence</h3>
              <p className="text-xs text-charcoal-variant leading-relaxed">
                Explore clinical cohort demographics, MMSE cognitive distributions, and feature correlations.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Browse Dataset</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Model Benchmark Summary Table */}
      <div className="clinical-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-charcoal-border gap-2">
          <div>
            <h2 className="text-base font-bold text-charcoal">Trained Model Performance Matrix</h2>
            <p className="text-xs text-charcoal-variant">
              Empirically evaluated on held-out test cohort (430 patients) using standardized 80/20 stratified split.
            </p>
          </div>
          <Link
            to="/models"
            className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1"
          >
            <span>Interactive ROC &amp; Confusion Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal-border text-charcoal-variant font-semibold uppercase tracking-wider">
                <th className="pb-3 pr-4">Algorithm</th>
                <th className="pb-3 px-3">Accuracy</th>
                <th className="pb-3 px-3">Precision (PPV)</th>
                <th className="pb-3 px-3">Recall (Sensitivity)</th>
                <th className="pb-3 px-3">F1 Score</th>
                <th className="pb-3 px-3">ROC-AUC</th>
                <th className="pb-3 pl-3 text-right">Primary Trait</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border font-mono">
              {benchmarkList.map((m, i) => {
                const isBest = i === 0 || m.accuracy >= 0.95;
                return (
                  <tr key={m.model_name} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 pr-4 font-sans font-semibold text-charcoal flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span>{m.model_name}</span>
                      {isBest && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                          Best Accuracy
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-charcoal">
                      {(m.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-charcoal-variant">
                      {(m.precision * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-charcoal-variant">
                      {(m.recall * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-primary">
                      {(m.f1_score * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-secondary">
                      {m.roc_auc.toFixed(3)}
                    </td>
                    <td className="py-3.5 pl-3 text-right font-sans text-xs text-charcoal-variant">
                      {m.model_name === 'Random Forest' && 'High stability on non-linear cognitive scores'}
                      {m.model_name === 'XGBoost' && 'Highest discrimination & ROC-AUC score'}
                      {m.model_name === 'SVM' && 'Kernel boundary separation for hyperplanes'}
                      {m.model_name === 'Logistic Regression' && 'Linear log-odds baseline interpretability'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Support Workflow Stages */}
      <div className="clinical-card p-6">
        <h2 className="text-base font-bold text-charcoal mb-1">Clinical Assessment Workflow</h2>
        <p className="text-xs text-charcoal-variant mb-6">
          How patient inputs are ingested, normalized, evaluated, and explained.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'Clinical Intake', desc: 'Ingest 32 patient biomarkers, MMSE scores, ADL, and medical history.' },
            { step: '02', title: 'Data Preprocessing', desc: 'StandardScaler normalization and categorical feature encoding.' },
            { step: '03', title: 'Multi-Model Inference', desc: 'Ensemble evaluation across trained RF, XGB, SVM, and LR pipelines.' },
            { step: '04', title: 'SHAP Attribution', desc: 'TreeSHAP & KernelSHAP calculate local directional contributions.' },
            { step: '05', title: 'Clinical Insights', desc: 'Ranked natural-language statements for research decision support.' }
          ].map((item, idx) => (
            <div key={item.step} className="p-4 rounded-xl bg-surface-container-low border border-charcoal-border relative">
              <div className="text-xs font-mono font-bold text-primary mb-1">{item.step}</div>
              <h3 className="text-xs font-bold text-charcoal mb-1">{item.title}</h3>
              <p className="text-[11px] text-charcoal-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}