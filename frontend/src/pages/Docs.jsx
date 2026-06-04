import { useState } from 'react'

const sidebarSections = [
  {
    heading: 'PROJECT',
    links: ['Project Overview', 'Contributors', 'Repository']
  },
  {
    heading: 'API DOCS',
    links: ['Integration Guide', 'Endpoints', 'Authentication']
  }
]

const endpoints = [
  {
    method: 'POST',
    path: '/predict',
    desc: 'Run prediction for a single model. Returns prediction (0 or 1) and probability score.',
    body: `{
  "model": "random_forest",
  "features": {
    "Age": 72,
    "MMSE": 24,
    "FunctionalAssessment": 7,
    ...
  }
}`,
    response: `{
  "model": "random_forest",
  "prediction": 1,
  "probability": 0.82
}`
  },
  {
    method: 'POST',
    path: '/predict/all',
    desc: 'Run all 4 models simultaneously and return results for each.',
    body: `{
  "model": "random_forest",
  "features": { ... }
}`,
    response: `{
  "random_forest": { "prediction": 1, "probability": 0.82 },
  "xgboost": { "prediction": 1, "probability": 0.79 },
  "svm": { "prediction": 1, "probability": null },
  "logistic_regression": { "prediction": 0, "probability": 0.43 }
}`
  },
  {
    method: 'POST',
    path: '/explain',
    desc: 'Get SHAP-based feature attribution for a prediction. Returns top 10 contributing features.',
    body: `{
  "model": "random_forest",
  "features": { ... }
}`,
    response: `{
  "model": "random_forest",
  "top_features": [
    ["MemoryComplaints", 0.176],
    ["FunctionalAssessment", 0.153],
    ["MMSE", -0.043]
  ]
}`
  },
  {
    method: 'GET',
    path: '/models',
    desc: 'Returns a list of all available model names.',
    body: null,
    response: `{
  "models": [
    "logistic_regression",
    "random_forest",
    "xgboost",
    "svm"
  ]
}`
  },
  {
    method: 'GET',
    path: '/health',
    desc: 'Health check endpoint to verify the API is running.',
    body: null,
    response: `{ "status": "healthy" }`
  },
]

const contributors = [
  { name: 'Rishav Das', role: 'Lead Developer & ML Architect', initials: 'RD' },
]

const methodColors = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
}

export default function Docs() {
  const [active, setActive] = useState('Project Overview')
  const [openEndpoint, setOpenEndpoint] = useState(null)

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 py-8 px-4 sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto">
        {sidebarSections.map(section => (
          <div key={section.heading} className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {section.heading}
            </p>
            <div className="flex flex-col gap-1">
              {section.links.map(link => (
                <button
                  key={link}
                  onClick={() => setActive(link)}
                  className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    active === link
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-4">
          <a
            href="https://github.com/RishavDas0307/AD_Pred"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span>⌥</span> GitHub Repo
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto px-8 py-12">

        <h1 className="text-4xl font-bold text-slate-900 mb-3">Documentation</h1>
        <p className="text-slate-500 mb-10 max-w-xl leading-relaxed">
          A comprehensive guide to AD_Pred: a clinical-grade Alzheimer's Disease
          prediction system leveraging machine learning and tabular clinical data analysis.
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-2xl mb-3">🔬</div>
            <h3 className="font-semibold text-slate-900 mb-2">Scientific Basis</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Built on multi-modal clinical biomarkers including cognitive assessment
              metrics and demographic data to provide highly accurate early-stage detection.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-2xl mb-3">🔒</div>
            <h3 className="font-semibold text-slate-900 mb-2">Privacy & Ethics</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              All predictions are processed locally. No patient data is stored or
              transmitted externally. Built for academic and research use only.
            </p>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">API Endpoints</h2>
          <p className="text-slate-500 text-sm mb-6">
            The FastAPI backend runs on <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono text-xs">http://localhost:8000</code>.
            Interactive docs available at <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono text-xs">/docs</code>.
          </p>

          <div className="flex flex-col gap-3">
            {endpoints.map((ep, i) => (
              <div key={ep.path} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenEndpoint(openEndpoint === i ? null : i)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <span className={`text-xs font-bold px-2 py-1 rounded font-mono ${methodColors[ep.method]}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm text-slate-900 font-semibold">{ep.path}</span>
                  <span className="text-sm text-slate-400 flex-1">{ep.desc}</span>
                  <span className="text-slate-300 text-xs">{openEndpoint === i ? '▲' : '▼'}</span>
                </button>

                {openEndpoint === i && (
                  <div className="border-t border-slate-100 px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ep.body && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Request Body</p>
                        <pre className="bg-slate-900 text-green-400 text-xs font-mono p-4 rounded-lg overflow-x-auto leading-relaxed">
                          {ep.body}
                        </pre>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Response</p>
                      <pre className="bg-slate-900 text-green-400 text-xs font-mono p-4 rounded-lg overflow-x-auto leading-relaxed">
                        {ep.response}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contributors */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Lead Contributors</h2>
          <div className="flex gap-4 flex-wrap">
            {contributors.map(c => (
              <div key={c.name} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center gap-3 w-44">
                <div className="w-14 h-14 rounded-full bg-blue-700 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{c.initials}</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-blue-700">{c.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">Add your teammates to the contributors array in <code className="font-mono">Docs.jsx</code></p>
        </div>

        {/* Open Source CTA */}
        <div className="bg-blue-700 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Open Source Project</h3>
            <p className="text-blue-200 text-sm max-w-md">
              View the full source code, contribute improvements, and explore the ML notebooks on GitHub.
            </p>
          </div>
          <a
            href="https://github.com/RishavDas0307/AD_Pred"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-white text-blue-700 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            ⌥ View on GitHub
          </a>
        </div>

      </main>
    </div>
  )
}