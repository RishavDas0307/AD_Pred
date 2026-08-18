import { useState, useEffect } from 'react';
import {
  GitCompare,
  Cpu,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { RocCurveSvg, ConfusionMatrixCard, SparklineSvg } from '../components/Charts';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { api } from '../services/api';

const sampleBatchFeatures = {
  Age: 76,
  Gender: 0,
  Ethnicity: 0,
  EducationLevel: 1,
  BMI: 28.5,
  Smoking: 1,
  AlcoholConsumption: 8.0,
  PhysicalActivity: 2.0,
  DietQuality: 4.0,
  SleepQuality: 5.5,
  FamilyHistoryAlzheimers: 1,
  CardiovascularDisease: 1,
  Diabetes: 0,
  Depression: 1,
  HeadInjury: 0,
  Hypertension: 1,
  SystolicBP: 148,
  DiastolicBP: 92,
  CholesterolTotal: 245,
  CholesterolLDL: 155,
  CholesterolHDL: 42,
  CholesterolTriglycerides: 230,
  MMSE: 14.5,
  FunctionalAssessment: 4.2,
  ADL: 4.8,
  MemoryComplaints: 1,
  BehavioralProblems: 1,
  Confusion: 1,
  Disorientation: 0,
  PersonalityChanges: 1,
  DifficultyCompletingTasks: 1,
  Forgetfulness: 1
};

export default function ModelComparison() {
  const [evalData, setEvalData] = useState(null);
  const [activeModelKey, setActiveModelKey] = useState('xgboost');
  const [batchResults, setBatchResults] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getEvaluationMetrics()
      .then((data) => {
        if (mounted) {
          setEvalData(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.error(e);
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  async function runMultiModelConsensus() {
    setBatchLoading(true);
    try {
      const res = await api.predictAll(sampleBatchFeatures);
      setBatchResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setBatchLoading(false);
    }
  }

  const defaultModels = {
    random_forest: {
      key: 'random_forest',
      display_name: 'Random Forest',
      roc_auc: 0.937,
      confusion_matrix: { tn: 270, fp: 8, fn: 13, tp: 139, accuracy: 0.9512, sensitivity: 0.9145, specificity: 0.9712 }
    },
    xgboost: {
      key: 'xgboost',
      display_name: 'XGBoost',
      roc_auc: 0.945,
      confusion_matrix: { tn: 269, fp: 9, fn: 14, tp: 138, accuracy: 0.9465, sensitivity: 0.9079, specificity: 0.9676 }
    },
    svm: {
      key: 'svm',
      display_name: 'SVM',
      roc_auc: 0.897,
      confusion_matrix: { tn: 234, fp: 44, fn: 24, tp: 128, accuracy: 0.8419, sensitivity: 0.8421, specificity: 0.8417 }
    },
    logistic_regression: {
      key: 'logistic_regression',
      display_name: 'Logistic Regression',
      roc_auc: 0.883,
      confusion_matrix: { tn: 239, fp: 39, fn: 39, tp: 113, accuracy: 0.8186, sensitivity: 0.7434, specificity: 0.8597 }
    }
  };

  const detailedModels = evalData?.models || defaultModels;
  const activeModel = detailedModels[activeModelKey] || detailedModels['xgboost'];

  const benchmarks = evalData?.benchmarks || [
    { model_name: 'Random Forest', accuracy: 0.9512, precision: 0.9456, recall: 0.9145, f1_score: 0.9298, roc_auc: 0.9374 },
    { model_name: 'XGBoost', accuracy: 0.9465, precision: 0.9388, recall: 0.9079, f1_score: 0.9231, roc_auc: 0.9447 },
    { model_name: 'SVM', accuracy: 0.8419, precision: 0.7442, recall: 0.8421, f1_score: 0.7901, roc_auc: 0.8974 },
    { model_name: 'Logistic Regression', accuracy: 0.8163, precision: 0.6952, recall: 0.8553, f1_score: 0.7670, roc_auc: 0.8831 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Algorithmic Benchmarking</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container text-charcoal-variant font-bold">
            Test Size: 430 Cohort Patients
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal mt-1">
          Model Evaluation Matrix
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-variant mt-1 max-w-3xl leading-relaxed">
          Comparative analysis of the 4 machine learning algorithms trained and validated on the Alzheimer's structured clinical dataset.
        </p>
      </div>

      {/* Top 4 Model Algorithm Family Cards (Matching Stitch Screen 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XGBoost */}
        <div
          onClick={() => setActiveModelKey('xgboost')}
          className={`clinical-card p-5 cursor-pointer transition-all ${
            activeModelKey === 'xgboost' ? 'ring-2 ring-blue-600 border-blue-600 shadow-card-hover' : 'hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              ★ Highest ROC-AUC
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">XGBoost</h3>
          <p className="text-xs text-slate-500">Gradient Boosting</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Accuracy</span>
            <span className="text-2xl font-bold font-mono text-blue-700">94.7%</span>
          </div>
          {/* Sparkline curve */}
          <div className="mt-2">
            <SparklineSvg type="xgboost" />
          </div>
        </div>

        {/* Random Forest */}
        <div
          onClick={() => setActiveModelKey('random_forest')}
          className={`clinical-card p-5 cursor-pointer transition-all ${
            activeModelKey === 'random_forest' ? 'ring-2 ring-purple-600 border-purple-600 shadow-card-hover' : 'hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              ★ Best Overall Accuracy
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Random Forest</h3>
          <p className="text-xs text-slate-500">Ensemble Method</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Accuracy</span>
            <span className="text-2xl font-bold font-mono text-purple-700">95.1%</span>
          </div>
          {/* Sparkline curve */}
          <div className="mt-2">
            <SparklineSvg type="random_forest" />
          </div>
        </div>

        {/* SVM */}
        <div
          onClick={() => setActiveModelKey('svm')}
          className={`clinical-card p-5 cursor-pointer transition-all ${
            activeModelKey === 'svm' ? 'ring-2 ring-emerald-600 border-emerald-600 shadow-card-hover' : 'hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Linear / RBF Kernel
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">SVM</h3>
          <p className="text-xs text-slate-500">Kernel Support Vector</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Accuracy</span>
            <span className="text-2xl font-bold font-mono text-emerald-700">84.2%</span>
          </div>
          {/* Sparkline curve */}
          <div className="mt-2">
            <SparklineSvg type="svm" />
          </div>
        </div>

        {/* Logistic Regression */}
        <div
          onClick={() => setActiveModelKey('logistic_regression')}
          className={`clinical-card p-5 cursor-pointer transition-all ${
            activeModelKey === 'logistic_regression' ? 'ring-2 ring-slate-600 border-slate-600 shadow-card-hover' : 'hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Baseline Model
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Logistic Regression</h3>
          <p className="text-xs text-slate-500">Linear Log-Odds</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Accuracy</span>
            <span className="text-2xl font-bold font-mono text-slate-700">81.6%</span>
          </div>
          {/* Sparkline curve */}
          <div className="mt-2">
            <SparklineSvg type="logistic_regression" />
          </div>
        </div>
      </div>

      {/* Middle Section: Full Evaluation Matrix + ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Full Evaluation Matrix Table (7 Cols) */}
        <div className="lg:col-span-7 clinical-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Full Evaluation Matrix</h2>
              <p className="text-xs text-slate-500">Validated on held-out test cohort.</p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Validation Set
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Model</th>
                  <th className="pb-3 px-2">Accuracy</th>
                  <th className="pb-3 px-2">Precision</th>
                  <th className="pb-3 px-2">Recall</th>
                  <th className="pb-3 px-2">F1 Score</th>
                  <th className="pb-3 pl-2">ROC-AUC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {benchmarks.map((m) => {
                  const key = m.model_name.toLowerCase().replace(/\s+/g, '_');
                  const isSelected = key === activeModelKey;
                  return (
                    <tr
                      key={m.model_name}
                      onClick={() => setActiveModelKey(key)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/70 font-bold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 font-sans font-semibold text-slate-900 flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            key === 'random_forest'
                              ? 'bg-purple-600'
                              : key === 'xgboost'
                              ? 'bg-blue-600'
                              : key === 'svm'
                              ? 'bg-emerald-600'
                              : 'bg-slate-500'
                          }`}
                        />
                        <span>{m.model_name}</span>
                      </td>
                      <td className="py-3 px-2 text-slate-900 font-semibold">
                        {(m.accuracy * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {(m.precision * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {(m.recall * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-2 font-bold text-blue-700">
                        {(m.f1_score * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 pl-2 font-bold text-purple-700">
                        {m.roc_auc.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
            <strong>Clinical Note:</strong> High Recall (Sensitivity) ensures early detection of potential cognitive impairment with minimal missed cases.
          </p>
        </div>

        {/* Right: Interactive ROC Curves (5 Cols) */}
        <div className="lg:col-span-5 clinical-card p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Receiver Operating Characteristic (ROC)</h2>
            <p className="text-xs text-slate-500">True Positive vs False Positive trade-off.</p>
          </div>

          <RocCurveSvg
            models={detailedModels}
            activeModel={activeModelKey}
            onSelectModel={(key) => setActiveModelKey(key)}
          />
        </div>
      </div>

      {/* Bottom Section: Confusion Matrix Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 clinical-card p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900">
                Confusion Matrix: {activeModel?.display_name || 'Selected Model'}
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                N = 430 Test Cases
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Visualizing the performance of the selected <strong className="text-blue-700 font-semibold">{activeModel?.display_name}</strong> model on the held-out test cohort.
            </p>
          </div>

          <ConfusionMatrixCard
            matrix={activeModel?.confusion_matrix}
            modelName={activeModel?.display_name}
          />
        </div>

        {/* Multi-Model Live Consensus Tester */}
        <div className="lg:col-span-6 clinical-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Multi-Model Consensus Tester</h2>
              <p className="text-xs text-slate-500">
                Evaluate algorithmic consensus across all 4 models simultaneously for a sample high-risk patient vector.
              </p>
            </div>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between font-mono text-[11px]">
              <span>Sample Patient:</span>
              <span className="font-semibold text-slate-900">Age 76, MMSE 14.5, History: Positive</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Verifies whether decision tree ensembles, support vector machines, and linear pipelines agree on risk classification.
            </p>
          </div>

          <button
            type="button"
            disabled={batchLoading}
            onClick={runMultiModelConsensus}
            className="w-full py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {batchLoading ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Evaluating All 4 Inference Models...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Multi-Model Consensus Test</span>
              </>
            )}
          </button>

          {batchResults && (
            <div className="space-y-2 pt-2 animate-fadeIn">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Live Consensus Output:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(batchResults).map(([mKey, mRes]) => (
                  <div
                    key={mKey}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs"
                  >
                    <span className="text-xs font-bold text-slate-900 capitalize">
                      {mKey.replace('_', ' ')}
                    </span>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <span className={`text-xs font-mono font-bold ${
                        mRes.prediction === 1 ? 'text-rose-600' : 'text-emerald-700'
                      }`}>
                        {mRes.prediction === 1 ? 'Elevated Risk' : 'Low Risk'}
                      </span>
                      {mRes.probability !== null && (
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {(mRes.probability * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
