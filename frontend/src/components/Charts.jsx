import { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle } from 'lucide-react';

/**
 * 1. High-Fidelity Risk Gauge (Matching Stitch Prediction Result Screen)
 */
export function RiskGauge({ probability = 0.5, size = 320 }) {
  const rawProb = typeof probability === 'number' && !isNaN(probability) ? probability : (parseFloat(probability) || 0);
  const pct = Math.max(0, Math.min(100, Math.round(rawProb * 100)));

  // Risk Classification colors & text
  const { category, labelColor, bgBadge, mainColor, gradientId, needleColor } = useMemo(() => {
    if (pct < 35) {
      return {
        category: 'Low Risk',
        labelColor: 'text-emerald-700',
        bgBadge: 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold',
        mainColor: '#059669', // Emerald Green
        needleColor: '#10b981',
        gradientId: 'lowRiskGrad'
      };
    } else if (pct < 65) {
      return {
        category: 'Moderate Risk',
        labelColor: 'text-[#6b38d4]',
        bgBadge: 'bg-purple-50 border-purple-300 text-[#6b38d4] font-bold',
        mainColor: '#8455ef', // Purple
        needleColor: '#8455ef',
        gradientId: 'modRiskGrad'
      };
    } else {
      return {
        category: 'Elevated Risk',
        labelColor: 'text-rose-600',
        bgBadge: 'bg-rose-50 border-rose-300 text-rose-600 font-bold',
        mainColor: '#e11d48', // Rose Red
        needleColor: '#f43f5e',
        gradientId: 'highRiskGrad'
      };
    }
  }, [pct]);

  // Semicircle parameters
  const cx = 115;
  const cy = 120;
  const r = 88;
  const circumference = Math.PI * r; // ~276.46

  // Ensure even at 0% we have a tiny visible starter arc (min 2%) so it never looks blank
  const arcPct = Math.max(2.5, pct);
  const strokeDashoffset = circumference - (arcPct / 100) * circumference;

  // Calculate endpoint of the active progress arc for indicator dot & needle
  const angleRad = Math.PI - (pct / 100) * Math.PI; // from PI (left/0%) to 0 (right/100%)
  const dotX = cx + r * Math.cos(angleRad);
  const dotY = cy - r * Math.sin(angleRad);

  // Needle tip
  const needleLen = 65;
  const needleX = cx + needleLen * Math.cos(angleRad);
  const needleY = cy - needleLen * Math.sin(angleRad);

  return (
    <div className="flex flex-col items-center justify-center relative select-none w-full">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.7 }}>
        <svg
          viewBox="0 0 230 145"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="lowRiskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="modRiskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#6b38d4" />
            </linearGradient>

            <linearGradient id="highRiskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>

            <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.28" floodColor={mainColor} />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 27 120 A 88 88 0 0 1 203 120"
            fill="none"
            stroke="#eaedff"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Scale Tick Dashes */}
          <path
            d="M 38 120 A 77 77 0 0 1 192 120"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="3 8"
          />

          {/* Active Value Progress Arc */}
          <path
            d="M 27 120 A 88 88 0 0 1 203 120"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            filter="url(#gaugeShadow)"
          />

          {/* Scale Labels */}
          <text x="27" y="138" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b" fontFamily="JetBrains Mono">0%</text>
          <text x="115" y="24" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b" fontFamily="JetBrains Mono">50%</text>
          <text x="203" y="138" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b" fontFamily="JetBrains Mono">100%</text>

          {/* Needle Pointer */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke={mainColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Center Hub */}
          <circle cx={cx} cy={cy} r="6" fill={mainColor} />
          <circle cx={cx} cy={cy} r="3" fill="#ffffff" />

          {/* Leading Indicator Dot at Edge */}
          <circle
            cx={dotX}
            cy={dotY}
            r="9"
            fill="#ffffff"
            stroke={mainColor}
            strokeWidth="4"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <div className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 font-mono">
            {pct}%
          </div>
          <div className={`text-xs sm:text-sm font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full border mt-1 shadow-xs ${bgBadge}`}>
            {category}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center mt-2 max-w-sm leading-relaxed">
        Estimated statistical probability computed from multi-dimensional clinical and cognitive indicators.
      </p>
    </div>
  );
}

/**
 * 2. Sparkline SVG for Model Cards (Matching Stitch Screen 3)
 */
export function SparklineSvg({ type = 'xgboost', width = 200, height = 36 }) {
  const configs = {
    xgboost: {
      color: '#0058be',
      fill: 'rgba(0, 88, 190, 0.1)',
      points: 'M 0,30 Q 30,28 60,18 T 120,22 T 160,10 T 200,6'
    },
    random_forest: {
      color: '#6b38d4',
      fill: 'rgba(107, 56, 212, 0.1)',
      points: 'M 0,32 Q 40,30 80,24 T 140,14 T 200,4'
    },
    svm: {
      color: '#00685d',
      fill: 'rgba(0, 104, 93, 0.1)',
      points: 'M 0,26 Q 50,28 100,20 T 160,16 T 200,12'
    },
    logistic_regression: {
      color: '#727785',
      fill: 'rgba(114, 119, 133, 0.08)',
      points: 'M 0,28 Q 60,32 120,26 T 170,30 T 200,24'
    }
  };

  const c = configs[type] || configs.xgboost;

  return (
    <svg viewBox="0 0 200 36" className="w-full h-8 overflow-visible">
      <path
        d={`${c.points} L 200,36 L 0,36 Z`}
        fill={c.fill}
      />
      <path
        d={c.points}
        fill="none"
        stroke={c.color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 3. SHAP Feature Contribution Bars
 */
export function FeatureContributionBar({ explanations = [], maxItems = 6 }) {
  if (!explanations || explanations.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-200">
        No feature attribution data available for this prediction.
      </div>
    );
  }

  const items = explanations.slice(0, maxItems);
  const maxAbs = Math.max(...items.map(e => Math.abs(e.contribution || 0)), 0.001);

  return (
    <div className="space-y-3">
      {items.map((exp, idx) => {
        const isInc = exp.impact === 'increased_risk' || exp.contribution > 0;
        const widthPct = Math.min(100, Math.max(15, (Math.abs(exp.contribution || 0) / maxAbs) * 100));

        return (
          <div
            key={exp.feature || idx}
            className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-xs"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <span className={`p-1.5 rounded-lg ${isInc ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {isInc ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{exp.label || exp.feature}</h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Patient Value: <strong className="text-slate-800 font-semibold">{exp.formatted_value || exp.value}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-mono font-bold ${isInc ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isInc ? `+${Math.abs(exp.contribution || 0).toFixed(3)}` : `-${Math.abs(exp.contribution || 0).toFixed(3)}`}
                </span>
                <span className={`block text-[10px] font-bold uppercase tracking-wider ${isInc ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isInc ? 'Increased Risk' : 'Protective Factor'}
                </span>
              </div>
            </div>

            {/* Impact Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden my-1.5 border border-slate-200/80">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isInc ? 'bg-gradient-to-r from-rose-400 to-rose-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                }`}
                style={{ width: `${widthPct}%` }}
              />
            </div>

            {/* Plain language clinical statement */}
            {exp.statement && (
              <p className="text-xs text-slate-600 leading-snug mt-1.5 pt-1.5 border-t border-slate-100 italic">
                "{exp.statement}"
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * 4. High-Resolution ROC Curves Chart (Matching Stitch Screen 3)
 */
export function RocCurveSvg({ models = {}, activeModel = 'xgboost', onSelectModel }) {
  const modelConfigs = {
    xgboost: { name: 'XGBoost', color: '#0058be', auc: '0.945' },
    random_forest: { name: 'Random Forest', color: '#6b38d4', auc: '0.937' },
    svm: { name: 'SVM', color: '#00685d', auc: '0.897' },
    logistic_regression: { name: 'Logistic Regression', color: '#727785', auc: '0.883' }
  };

  const viewBoxWidth = 340;
  const viewBoxHeight = 280;
  const padding = { top: 25, right: 25, bottom: 45, left: 50 };
  const graphWidth = viewBoxWidth - padding.left - padding.right;
  const graphHeight = viewBoxHeight - padding.top - padding.bottom;

  const fallbackCurves = {
    xgboost: [
      { fpr: 0, tpr: 0 }, { fpr: 0.02, tpr: 0.65 }, { fpr: 0.05, tpr: 0.85 }, { fpr: 0.1, tpr: 0.92 },
      { fpr: 0.2, tpr: 0.96 }, { fpr: 0.4, tpr: 0.98 }, { fpr: 0.7, tpr: 0.99 }, { fpr: 1.0, tpr: 1.0 }
    ],
    random_forest: [
      { fpr: 0, tpr: 0 }, { fpr: 0.03, tpr: 0.60 }, { fpr: 0.08, tpr: 0.82 }, { fpr: 0.15, tpr: 0.90 },
      { fpr: 0.25, tpr: 0.95 }, { fpr: 0.5, tpr: 0.97 }, { fpr: 0.8, tpr: 0.99 }, { fpr: 1.0, tpr: 1.0 }
    ],
    svm: [
      { fpr: 0, tpr: 0 }, { fpr: 0.08, tpr: 0.50 }, { fpr: 0.18, tpr: 0.74 }, { fpr: 0.3, tpr: 0.86 },
      { fpr: 0.5, tpr: 0.92 }, { fpr: 0.75, tpr: 0.96 }, { fpr: 1.0, tpr: 1.0 }
    ],
    logistic_regression: [
      { fpr: 0, tpr: 0 }, { fpr: 0.1, tpr: 0.45 }, { fpr: 0.22, tpr: 0.70 }, { fpr: 0.4, tpr: 0.82 },
      { fpr: 0.6, tpr: 0.90 }, { fpr: 0.8, tpr: 0.95 }, { fpr: 1.0, tpr: 1.0 }
    ]
  };

  const getPoints = (key) => {
    const livePoints = models[key]?.roc_curve;
    if (livePoints && livePoints.length > 3) return livePoints;
    return fallbackCurves[key] || fallbackCurves.xgboost;
  };

  const pointsToSvgPath = (points) => {
    return points
      .map((p, i) => {
        const x = padding.left + p.fpr * graphWidth;
        const y = padding.top + (1 - p.tpr) * graphHeight;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full bg-white p-3 rounded-xl border border-slate-200">
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-auto">
          {/* Subtle Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((v) => {
            const y = padding.top + (1 - v) * graphHeight;
            const x = padding.left + v * graphWidth;
            return (
              <g key={v}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + graphWidth}
                  y2={y}
                  stroke="#f1f3fd"
                  strokeWidth="1.5"
                />
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + graphHeight}
                  stroke="#f1f3fd"
                  strokeWidth="1.5"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9.5"
                  fill="#727785"
                  fontFamily="JetBrains Mono"
                >
                  {v.toFixed(2)}
                </text>
                <text
                  x={x}
                  y={padding.top + graphHeight + 16}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#727785"
                  fontFamily="JetBrains Mono"
                >
                  {v.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Random Baseline Diagonal */}
          <line
            x1={padding.left}
            y1={padding.top + graphHeight}
            x2={padding.left + graphWidth}
            y2={padding.top}
            stroke="#c2c6d6"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />

          {/* Render Curve Paths */}
          {Object.keys(modelConfigs).map((key) => {
            const pts = getPoints(key);
            const pathD = pointsToSvgPath(pts);
            const isSelected = key === activeModel;
            const cfg = modelConfigs[key];

            return (
              <g key={key} onClick={() => onSelectModel && onSelectModel(key)} className="cursor-pointer">
                {/* Curve Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={cfg.color}
                  strokeWidth={isSelected ? '3.5' : '2'}
                  strokeOpacity={isSelected ? '1' : '0.5'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Point markers */}
                {isSelected && pts.filter((_, idx) => idx % 2 === 0).map((p, idx) => (
                  <circle
                    key={idx}
                    cx={padding.left + p.fpr * graphWidth}
                    cy={padding.top + (1 - p.tpr) * graphHeight}
                    r="4"
                    fill="#ffffff"
                    stroke={cfg.color}
                    strokeWidth="2"
                  />
                ))}
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left + graphWidth / 2}
            y={viewBoxHeight - 6}
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#424754"
          >
            False Positive Rate (1 - Specificity)
          </text>
          <text
            x={-padding.top - graphHeight / 2}
            y={14}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#424754"
          >
            True Positive Rate (Sensitivity)
          </text>
        </svg>
      </div>

      {/* Interactive Model Legend */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(modelConfigs).map(([key, cfg]) => {
          const isSelected = key === activeModel;
          const liveAuc = models[key]?.roc_auc || cfg.auc;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectModel && onSelectModel(key)}
              className={`p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                isSelected
                  ? 'bg-blue-50/80 border-2 border-blue-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                <span className="text-xs font-bold text-slate-800">{cfg.name}</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">
                AUC {liveAuc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 5. High-Impact Confusion Matrix (Matching Stitch Screen 3)
 */
export function ConfusionMatrixCard({ matrix, modelName = 'XGBoost' }) {
  const {
    tn = 269,
    fp = 9,
    fn = 14,
    tp = 138,
    total = 430,
    sensitivity = 0.908,
    specificity = 0.968,
    accuracy = 0.947
  } = matrix || {};

  return (
    <div className="space-y-5">
      {/* 2x2 Grid Matching Stitch Screen 3 */}
      <div>
        {/* Column Headers */}
        <div className="grid grid-cols-2 gap-4 ml-24 mb-2 text-center text-xs font-bold text-slate-600">
          <div>Negative (Normal)</div>
          <div>Positive (AD)</div>
        </div>

        <div className="flex items-stretch gap-3">
          {/* Row Headers */}
          <div className="w-20 flex flex-col justify-around text-right text-xs font-bold text-slate-600 pr-2">
            <span>Negative</span>
            <span>Positive</span>
          </div>

          {/* 2x2 Colored Blocks */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            {/* Top-Left: True Negative (Dark Blue) */}
            <div className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">{tn}</span>
              <span className="text-xs font-semibold text-blue-100 mt-1">True Negative</span>
            </div>

            {/* Top-Right: False Positive (Soft Rose Pink) */}
            <div className="bg-[#fce8e6] text-[#93000a] rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-rose-200">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#93000a]">{fp}</span>
              <span className="text-xs font-semibold text-rose-800 mt-1">False Positive</span>
            </div>

            {/* Bottom-Left: False Negative (Soft Peach/Orange) */}
            <div className="bg-[#fdf0e6] text-[#b45309] rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-amber-200">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#b45309]">{fn}</span>
              <span className="text-xs font-semibold text-amber-800 mt-1">False Negative</span>
            </div>

            {/* Bottom-Right: True Positive (Dark Blue) */}
            <div className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">{tp}</span>
              <span className="text-xs font-semibold text-blue-100 mt-1">True Positive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stitch-Style Summary Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">True Positives (TP)</div>
            <div className="text-base font-bold font-mono text-blue-900">{tp} <span className="text-xs font-normal text-slate-500">cases identified</span></div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">False Negatives (FN)</div>
            <div className="text-base font-bold font-mono text-rose-900">{fn} <span className="text-xs font-normal text-slate-500">missed cases</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 6. Responsive Distribution Histogram Bar Chart
 */
export function DistributionBarChart({ bins = [], title = 'Distribution', color = '#0058be' }) {
  if (!bins || bins.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center bg-slate-50 rounded-xl text-xs text-slate-400">
        Loading distribution...
      </div>
    );
  }

  const maxCount = Math.max(...bins.map(b => b.count), 1);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2 h-40 pt-6 pb-2 px-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
        {bins.map((b, i) => {
          const heightPct = Math.max(8, (b.count / maxCount) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
              {/* Tooltip */}
              <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                {b.count} subjects ({b.range})
              </div>

              {/* Bar */}
              <div
                className="w-full rounded-t-md transition-all duration-500 group-hover:brightness-110 shadow-xs"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: color
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[11px] font-mono text-slate-500 px-1">
        <span>Min: {bins[0]?.range.split('-')[0]}</span>
        <span className="font-sans font-semibold text-slate-700">{title}</span>
        <span>Max: {bins[bins.length - 1]?.range.split('-')[1]}</span>
      </div>
    </div>
  );
}
