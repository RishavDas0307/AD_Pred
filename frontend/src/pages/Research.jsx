const metrics = [
  { label: 'Accuracy', value: '94.8%', tag: null, desc: 'Validated against clinical consensus across multiple test folds.' },
  { label: 'Precision (PPV)', value: '91.2%', tag: 'High Reliability', desc: 'Minimized false positives to reduce unnecessary patient anxiety.' },
  { label: 'Recall (Sensitivity)', value: '96.5%', tag: 'Early Detection', desc: 'Exceptional capability in identifying early-stage cognitive impairment.' },
]

const models = [
  { name: 'Random Forest Ensemble', desc: 'Initial screening using 500+ estimators to evaluate cognitive scores and demographic metadata.' },
  { name: 'Support Vector Machine', desc: 'RBF Kernel optimization for high-dimensional classification of clinical features.' },
  { name: 'XGBoost Classifier', desc: 'Gradient boosted trees for handling missing values and feature interactions.' },
  { name: 'Logistic Regression', desc: 'Baseline linear model providing interpretable coefficient-based predictions.' },
]

const code = `from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# Core Classification Pipeline
model = Pipeline([
    ('scaler', StandardScaler()),
    ('rf', RandomForestClassifier(
        n_estimators=500,
        max_depth=None,
        class_weight='balanced'
    ))
])

# Training on Kaggle Alzheimer Dataset
model.fit(X_train, y_train)
prediction = model.predict_proba(X_test)`

export default function Research() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Scientific Rigor</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Research & Methodology</h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Discover the mathematical foundations and clinical datasets powering our Alzheimer's
            prediction engine. We leverage advanced machine learning to identify neurodegenerative
            markers with high precision.
          </p>
        </div>

        {/* Dataset + Models */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">

          {/* Dataset card */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-slate-400">⊞</span>
              <h2 className="font-semibold text-slate-900">Dataset Overview</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Our models are trained on the Kaggle Alzheimer's Disease Dataset, a comprehensive
              collection of clinical, demographic, and cognitive features for binary classification.
            </p>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { val: '2,149', label: 'Total Subjects' },
                { val: '35', label: 'Features' },
                { val: '~85%', label: 'Label Confidence' },
                { val: 'Binary', label: 'Classification' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-bold text-slate-900">{s.val}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Models card */}
          <div className="w-full md:w-72 bg-blue-700 rounded-xl p-6 text-white">
            <h2 className="font-semibold mb-4">Model Architectures</h2>
            <div className="flex flex-col gap-4">
              {models.map(m => (
                <div key={m.name}>
                  <p className="text-sm font-semibold text-blue-100">{m.name}</p>
                  <p className="text-xs text-blue-300 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Model Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.map(m => (
              <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-500">{m.label}</p>
                  {m.tag && (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                      {m.tag}
                    </span>
                  )}
                </div>
                <p className="text-4xl font-bold text-blue-700 mb-3">{m.value}</p>
                <div className="w-full bg-slate-100 rounded-full h-1 mb-3">
                  <div className="bg-blue-700 h-1 rounded-full" style={{ width: m.value }} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm + Validation */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">

          {/* Code block */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Algorithm Implementation</h2>
            <p className="text-slate-500 text-sm mb-4">
              A simplified implementation of our Random Forest classifier used for baseline structural analysis.
            </p>
            <div className="bg-slate-900 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
                <span className="text-xs text-slate-400 font-mono">Python / Scikit-learn</span>
              </div>
              <pre className="p-4 text-xs text-green-400 font-mono leading-relaxed overflow-x-auto">
                {code}
              </pre>
            </div>
          </div>

          {/* Validation */}
          <div className="w-full md:w-72 flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex-1">
              <h3 className="font-semibold text-slate-900 mb-3">Scientific Validation</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Our methodology maintains full transparency in validation protocols with
                stratified k-fold cross validation.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Cross Validated', 'SHAP Explainability', 'Class Balanced', 'Open Source'].map(tag => (
                  <span key={tag} className="text-xs font-semibold bg-blue-700 text-white rounded-full px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}