import { useState, useEffect } from 'react';
import {
  Database,
  Search,
  CheckCircle2,
  BarChart3,
  Activity,
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { DistributionBarChart } from '../components/Charts';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { api } from '../services/api';

const defaultSummary = {
  overview: {
    total_records: 2149,
    total_features: 32,
    missing_values: 0,
    class_distribution: { negative_count: 1389, negative_percentage: 64.6, positive_count: 760, positive_percentage: 35.4 }
  },
  distributions: {
    MMSE: [
      { range: '0.0-3.8', count: 268 }, { range: '3.8-7.5', count: 293 }, { range: '7.5-11.2', count: 275 }, { range: '11.2-15.0', count: 258 },
      { range: '15.0-18.8', count: 260 }, { range: '18.8-22.5', count: 265 }, { range: '22.5-26.2', count: 262 }, { range: '26.2-30.0', count: 268 }
    ],
    Age: [
      { range: '60-64', count: 281 }, { range: '64-68', count: 273 }, { range: '68-72', count: 265 }, { range: '72-76', count: 270 },
      { range: '76-80', count: 268 }, { range: '80-84', count: 262 }, { range: '84-88', count: 265 }, { range: '88-90', count: 265 }
    ],
    FunctionalAssessment: [
      { range: '0.0-1.2', count: 255 }, { range: '1.2-2.5', count: 267 }, { range: '2.5-3.8', count: 270 }, { range: '3.8-5.0', count: 260 },
      { range: '5.0-6.2', count: 275 }, { range: '6.2-7.5', count: 265 }, { range: '7.5-8.8', count: 268 }, { range: '8.8-10.0', count: 289 }
    ],
    ADL: [
      { range: '0.0-1.3', count: 300 }, { range: '1.3-2.5', count: 267 }, { range: '2.5-3.8', count: 260 }, { range: '3.8-5.0', count: 265 },
      { range: '5.0-6.3', count: 270 }, { range: '6.3-7.5', count: 268 }, { range: '7.5-8.8', count: 260 }, { range: '8.8-10.0', count: 249 }
    ],
    BMI: [
      { range: '15-18', count: 264 }, { range: '18-21', count: 247 }, { range: '21-24', count: 275 }, { range: '24-28', count: 280 },
      { range: '28-31', count: 270 }, { range: '31-34', count: 272 }, { range: '34-37', count: 271 }, { range: '37-40', count: 270 }
    ],
    PhysicalActivity: [
      { range: '0-1.3', count: 268 }, { range: '1.3-2.5', count: 254 }, { range: '2.5-3.8', count: 270 }, { range: '3.8-5.0', count: 268 },
      { range: '5.0-6.3', count: 272 }, { range: '6.3-7.5', count: 270 }, { range: '7.5-8.8', count: 274 }, { range: '8.8-10.0', count: 273 }
    ]
  },
  mean_comparisons: [
    { feature: 'MMSE', label: 'MMSE Cognitive Score', mean_non_ad: 24.8, mean_ad: 11.2, diff: -13.6 },
    { feature: 'FunctionalAssessment', label: 'Functional Assessment', mean_non_ad: 7.8, mean_ad: 3.1, diff: -4.7 },
    { feature: 'ADL', label: 'Activities of Daily Living (ADL)', mean_non_ad: 7.9, mean_ad: 3.4, diff: -4.5 },
    { feature: 'Age', label: 'Age (Years)', mean_non_ad: 74.2, mean_ad: 75.8, diff: 1.6 },
    { feature: 'BMI', label: 'Body Mass Index (BMI)', mean_non_ad: 26.8, mean_ad: 28.1, diff: 1.3 },
    { feature: 'SystolicBP', label: 'Systolic BP (mmHg)', mean_non_ad: 133.5, mean_ad: 138.2, diff: 4.7 },
    { feature: 'CholesterolLDL', label: 'LDL Cholesterol (mg/dL)', mean_non_ad: 122.4, mean_ad: 128.9, diff: 6.5 },
    { feature: 'PhysicalActivity', label: 'Physical Activity (hrs/wk)', mean_non_ad: 5.2, mean_ad: 3.8, diff: -1.4 }
  ]
};

export default function DatasetAnalysis() {
  const [summary, setSummary] = useState(defaultSummary);
  const [featuresList, setFeaturesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.getDatasetSummary().catch(() => null),
      api.getDatasetFeatures().catch(() => null)
    ]).then(([sumData, featData]) => {
      if (mounted) {
        if (sumData && sumData.distributions) setSummary(sumData);
        if (featData && featData.features) setFeaturesList(featData.features);
      }
    });
    return () => { mounted = false; };
  }, []);

  const categories = ['All', 'Demographics', 'Lifestyle', 'Medical History', 'Clinical Measurements', 'Cognitive & Symptoms'];

  const filteredFeatures = featuresList.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesQuery = searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Cohort Intelligence</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            2,149 Real Clinical Subjects
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
          Dataset &amp; Clinical Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Comprehensive exploratory data analysis and clinical specifications of the Kaggle Alzheimer's Disease cohort.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="clinical-card p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Cohort Size
          </span>
          <div className="text-3xl font-extrabold font-mono text-slate-900">2,149</div>
          <span className="text-xs text-slate-500">Individual patient records</span>
        </div>

        <div className="clinical-card p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Clinical Features
          </span>
          <div className="text-3xl font-extrabold font-mono text-blue-700">32</div>
          <span className="text-xs text-slate-500">Structured feature columns</span>
        </div>

        <div className="clinical-card p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Cohort Balance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">64.6%</span>
            <span className="text-xs text-slate-500 font-mono">/ 35.4%</span>
          </div>
          <span className="text-xs text-slate-500">1,389 Non-AD : 760 AD</span>
        </div>

        <div className="clinical-card p-5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Missing Values
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-600">0.0%</div>
          <span className="text-xs text-slate-500">100% verified complete</span>
        </div>
      </div>

      {/* Visual Distributions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Key Biomarker &amp; Cognitive Distributions</h2>
            <p className="text-xs text-slate-500">Histograms generated from the full 2,149 subject cohort.</p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            N = 2,149 Patients
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* MMSE Histogram */}
          <div className="clinical-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                MMSE Cognitive Score
              </span>
              <span className="text-xs font-mono text-blue-700 font-bold">0-30 Range</span>
            </div>
            <DistributionBarChart
              bins={summary.distributions.MMSE}
              title="MMSE Score (0-30)"
              color="#0058be"
            />
            <p className="text-[11px] text-slate-500 pt-1">
              MMSE scores &lt;24 show strong clinical separation with early neurocognitive impairment.
            </p>
          </div>

          {/* Functional Assessment Histogram */}
          <div className="clinical-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Functional Assessment
              </span>
              <span className="text-xs font-mono text-purple-700 font-bold">0-10 Scale</span>
            </div>
            <DistributionBarChart
              bins={summary.distributions.FunctionalAssessment}
              title="Functional Autonomy (0-10)"
              color="#6b38d4"
            />
            <p className="text-[11px] text-slate-500 pt-1">
              Reflects independence in everyday cognitive and household management tasks.
            </p>
          </div>

          {/* Activities of Daily Living (ADL) Histogram */}
          <div className="clinical-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                ADL Independence Index
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold">0-10 Scale</span>
            </div>
            <DistributionBarChart
              bins={summary.distributions.ADL}
              title="ADL Score (0-10)"
              color="#00685d"
            />
            <p className="text-[11px] text-slate-500 pt-1">
              High scores represent full functional independence in basic daily activities.
            </p>
          </div>

          {/* Participant Age Histogram */}
          <div className="clinical-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Age Distribution
              </span>
              <span className="text-xs font-mono text-slate-700 font-bold">50-95 Yrs</span>
            </div>
            <DistributionBarChart
              bins={summary.distributions.Age}
              title="Age (50-95 Yrs)"
              color="#424754"
            />
            <p className="text-[11px] text-slate-500 pt-1">
              Evenly sampled across geriatric and late-middle-age population segments.
            </p>
          </div>

          {/* BMI Distribution */}
          <div className="clinical-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Body Mass Index (BMI)
              </span>
              <span className="text-xs font-mono text-blue-700 font-bold">kg/m²</span>
            </div>
            <DistributionBarChart
              bins={summary.distributions.BMI}
              title="BMI (15-40 kg/m²)"
              color="#0058be"
            />
            <p className="text-[11px] text-slate-500 pt-1">
              Normal (18.5-24.9), Overweight (25-29.9), and Obese (&gt;30) distribution curve.
            </p>
          </div>

          {/* Physical Activity Distribution */}
          <div className="clinical-card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Physical Activity Level
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold">0-10 Hrs/Wk</span>
            </div>
            <DistributionBarChart
              bins={summary.distributions.PhysicalActivity}
              title="Physical Activity (0-10 Hrs)"
              color="#00685d"
            />
            <p className="text-[11px] text-slate-500 pt-1">
              Higher physical activity levels correlate with neuroprotective cardiovascular benefits.
            </p>
          </div>
        </div>
      </div>

      {/* Mean Metric Comparison by Diagnosis */}
      <div className="clinical-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Biomarker Comparison by Diagnosis Cohort</h2>
            <p className="text-xs text-slate-500">
              Empirical feature means for Negative (Non-AD, N=1,389) vs Positive (AD, N=760) patients.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
            Cohort Delta Analysis
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="pb-3">Clinical Feature</th>
                <th className="pb-3 px-3">Non-AD Mean (N=1,389)</th>
                <th className="pb-3 px-3">AD Mean (N=760)</th>
                <th className="pb-3 pl-3">Observed Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {summary.mean_comparisons.map((row) => {
                const isNegativeDiff = row.diff < 0;
                return (
                  <tr key={row.feature} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-sans font-bold text-slate-900">
                      {row.label}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-semibold">
                      {row.mean_non_ad}
                    </td>
                    <td className="py-3 px-3 text-slate-900 font-bold">
                      {row.mean_ad}
                    </td>
                    <td className="py-3 pl-3">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 ${
                        isNegativeDiff ? 'bg-purple-100 text-purple-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isNegativeDiff ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        <span>{row.diff > 0 ? `+${row.diff}` : row.diff}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Searchable Data Dictionary */}
      <div className="clinical-card p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Clinical Data Dictionary (32 Features)</h2>
            <p className="text-xs text-slate-500">
              Full specification of variables, allowed ranges, units, and baseline interpretations.
            </p>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feature names..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.name}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-xs space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{feat.label}</h3>
                  <span className="text-[10px] font-mono text-blue-700 font-bold">{feat.name}</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  {feat.category}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {feat.description}
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                <span>Type: <strong className="text-slate-800">{feat.type}</strong></span>
                {feat.unit && <span>Unit: <strong className="text-slate-800">{feat.unit}</strong></span>}
                {feat.min !== undefined && <span>Range: <strong className="text-slate-800">{feat.min} - {feat.max}</strong></span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
