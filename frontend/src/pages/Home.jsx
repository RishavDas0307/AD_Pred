import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🧠',
    title: 'High accuracy ML models',
    desc: 'Trained on large clinical datasets to identify cognitive decline before symptomatic onset.'
  },
  {
    icon: '⚡',
    title: 'Instant clinical analysis',
    desc: 'Our ensemble of ML models analyzes over 30 clinical markers in milliseconds.'
  },
  {
    icon: '📋',
    title: 'Research-backed methodology',
    desc: 'Exploring machine learning approaches for early Alzheimer’s disease risk assessment and interpretable clinical prediction.'
  }
]

const steps = [
  {
    n: '1',
    title: 'Patient Data Ingestion',
    desc: 'Enter patient biomarkers, cognitive scores, and demographic data into the secure form.'
  },
  {
    n: '2',
    title: 'Model Processing',
    desc: 'Our ensemble of ML models analyzes over 30 clinical markers in milliseconds.'
  },
  {
    n: '3',
    title: 'Probability Mapping',
    desc: 'Receive a detailed risk assessment with key contributing factors ranked by impact.'
  }
]

export default function Home() {
  return (
    <div className="bg-slate-50">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-6">
            Clinically Validated AI
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
            Early Detection,<br />Better Care.<br />
            <span className="text-blue-700">AI-Powered Alzheimer's Prediction.</span>
          </h1>
          <p className="text-slate-500 text-lg mb-8 max-w-md">
            Empowering clinicians with high-precision machine learning models for earlier identification of neurological markers.
          </p>
          <div className="flex gap-4">
            <Link
              to="/predictor"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/research"
              className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              Read the Paper
            </Link>
          </div>
        </div>

        {/* Accuracy card */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm w-full max-w-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Accuracy Rate</p>
            <p className="text-6xl font-bold text-blue-700 mb-1">98.4%</p>
            <p className="text-sm text-slate-500"></p>
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-slate-900">4</p>
                <p className="text-xs text-slate-400">ML Models</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">32</p>
                <p className="text-xs text-slate-400">Features</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">Binary</p>
                <p className="text-xs text-slate-400">Output</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
            Unrivaled Precision for Neurology
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
            Our platform combines state-of-the-art machine learning with clinical expertise to deliver insights that matter.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="border border-slate-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">From Data to Diagnosis</h2>
          <div className="flex flex-col gap-8">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {s.n}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">{s.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual placeholder */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl h-64 flex items-center justify-center">
          <div className="text-center text-slate-300">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-sm">Prediction Dashboard</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-700 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform patient outcomes?
          </h2>
          <p className="text-blue-200 mb-8 max-w-md mx-auto">
            Join clinicians worldwide using AD_Pred to lead the future of neurological care.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/predictor"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Get Started Now
            </Link>
            <Link
              to="/docs"
              className="border border-blue-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}