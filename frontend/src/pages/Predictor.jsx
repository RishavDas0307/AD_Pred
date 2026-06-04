import { useState } from 'react'

const defaultFeatures = {
  Age: '', Gender: 0, Ethnicity: 0, EducationLevel: 0,
  BMI: '', Smoking: 0, AlcoholConsumption: '', PhysicalActivity: '',
  DietQuality: '', SleepQuality: '',
  FamilyHistoryAlzheimers: 0, CardiovascularDisease: 0,
  Diabetes: 0, Depression: 0, HeadInjury: 0, Hypertension: 0,
  SystolicBP: '', DiastolicBP: '',
  CholesterolTotal: '', CholesterolLDL: '', CholesterolHDL: '', CholesterolTriglycerides: '',
  MMSE: '', FunctionalAssessment: '',
  MemoryComplaints: 0, BehavioralProblems: 0, ADL: '',
  Confusion: 0, Disorientation: 0, PersonalityChanges: 0,
  DifficultyCompletingTasks: 0, Forgetfulness: 0
}

const steps = ['Demographics', 'Lifestyle & History', 'Clinical Measures', 'Cognitive & Symptoms']

function ToggleField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-2">{label}</label>
      <div className="flex rounded-lg border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(0)}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${value === 0 ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => onChange(1)}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${value === 1 ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          Yes
        </button>
      </div>
    </div>
  )
}

function NumberField({ label, name, value, onChange, placeholder, min, max }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-2">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export default function Predictor() {
  const [step, setStep] = useState(0)
  const [features, setFeatures] = useState(defaultFeatures)
  const [model, setModel] = useState('random_forest')
  const [result, setResult] = useState(null)
  const [topFeatures, setTopFeatures] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setFeatures(prev => ({ ...prev, [name]: value }))
  }

  function handleToggle(name, value) {
    setFeatures(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    setTopFeatures([])

    const parsed = {}
    for (const [k, v] of Object.entries(features)) {
      parsed[k] = typeof v === 'string' ? parseFloat(v) || 0 : v
    }

    try {
      const [predRes, explainRes] = await Promise.all([
        fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, features: parsed })
        }),
        fetch('http://localhost:8000/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, features: parsed })
        })
      ])

      const predData = await predRes.json()
      const explainData = await explainRes.json()

      setResult(predData)
      setTopFeatures(explainData.top_features || [])
    } catch (err) {
      setError('Could not connect to the backend. Make sure FastAPI is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setFeatures(defaultFeatures)
    setResult(null)
    setTopFeatures([])
    setError(null)
    setStep(0)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Clinical Feature Assessment</h1>
        <p className="text-slate-500">Enter patient clinical data to generate a prediction. All data is processed locally.</p>
      </div>

      <div className="flex gap-8">

        {/* Left — Form */}
        <div className="flex-1">

          {/* Progress bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {steps.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setStep(i)}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                      i === step ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400">Step {step + 1} of {steps.length}</span>
            </div>

            {/* Progress track */}
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-blue-700 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 0 — Demographics */}
          {step === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-2 gap-4">
              <NumberField label="Age" name="Age" value={features.Age} onChange={handleChange} placeholder="e.g. 70" min={45} max={90} />
              <SelectField label="Gender" name="Gender" value={features.Gender} onChange={handleChange}
                options={[{ value: 0, label: 'Male' }, { value: 1, label: 'Female' }]} />
              <SelectField label="Ethnicity" name="Ethnicity" value={features.Ethnicity} onChange={handleChange}
                options={[{ value: 0, label: 'Caucasian' }, { value: 1, label: 'African American' }, { value: 2, label: 'Asian' }, { value: 3, label: 'Other' }]} />
              <SelectField label="Education Level" name="EducationLevel" value={features.EducationLevel} onChange={handleChange}
                options={[{ value: 0, label: 'None' }, { value: 1, label: 'High School' }, { value: 2, label: 'Bachelor\'s' }, { value: 3, label: 'Higher' }]} />
              <NumberField label="BMI" name="BMI" value={features.BMI} onChange={handleChange} placeholder="e.g. 27.5" />
            </div>
          )}

          {/* Step 1 — Lifestyle & History */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-2 gap-4">
              <ToggleField label="Smoking" value={features.Smoking} onChange={v => handleToggle('Smoking', v)} />
              <ToggleField label="Family History of Alzheimer's" value={features.FamilyHistoryAlzheimers} onChange={v => handleToggle('FamilyHistoryAlzheimers', v)} />
              <ToggleField label="Cardiovascular Disease" value={features.CardiovascularDisease} onChange={v => handleToggle('CardiovascularDisease', v)} />
              <ToggleField label="Diabetes" value={features.Diabetes} onChange={v => handleToggle('Diabetes', v)} />
              <ToggleField label="Depression" value={features.Depression} onChange={v => handleToggle('Depression', v)} />
              <ToggleField label="Head Injury" value={features.HeadInjury} onChange={v => handleToggle('HeadInjury', v)} />
              <ToggleField label="Hypertension" value={features.Hypertension} onChange={v => handleToggle('Hypertension', v)} />
              <NumberField label="Alcohol Consumption (units/week)" name="AlcoholConsumption" value={features.AlcoholConsumption} onChange={handleChange} placeholder="e.g. 5" />
              <NumberField label="Physical Activity (hrs/week)" name="PhysicalActivity" value={features.PhysicalActivity} onChange={handleChange} placeholder="e.g. 3" />
              <NumberField label="Diet Quality (0-10)" name="DietQuality" value={features.DietQuality} onChange={handleChange} placeholder="e.g. 7" />
              <NumberField label="Sleep Quality (4-10)" name="SleepQuality" value={features.SleepQuality} onChange={handleChange} placeholder="e.g. 7" />
            </div>
          )}

          {/* Step 2 — Clinical Measures */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-2 gap-4">
              <NumberField label="Systolic BP (mmHg)" name="SystolicBP" value={features.SystolicBP} onChange={handleChange} placeholder="e.g. 120" />
              <NumberField label="Diastolic BP (mmHg)" name="DiastolicBP" value={features.DiastolicBP} onChange={handleChange} placeholder="e.g. 80" />
              <NumberField label="Total Cholesterol" name="CholesterolTotal" value={features.CholesterolTotal} onChange={handleChange} placeholder="e.g. 200" />
              <NumberField label="LDL Cholesterol" name="CholesterolLDL" value={features.CholesterolLDL} onChange={handleChange} placeholder="e.g. 130" />
              <NumberField label="HDL Cholesterol" name="CholesterolHDL" value={features.CholesterolHDL} onChange={handleChange} placeholder="e.g. 50" />
              <NumberField label="Triglycerides" name="CholesterolTriglycerides" value={features.CholesterolTriglycerides} onChange={handleChange} placeholder="e.g. 150" />
            </div>
          )}

          {/* Step 3 — Cognitive & Symptoms */}
          {step === 3 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-2 gap-4">
              <NumberField label="MMSE Score (0-30)" name="MMSE" value={features.MMSE} onChange={handleChange} placeholder="e.g. 24" />
              <NumberField label="Functional Assessment (0-10)" name="FunctionalAssessment" value={features.FunctionalAssessment} onChange={handleChange} placeholder="e.g. 7" />
              <NumberField label="ADL Score (0-10)" name="ADL" value={features.ADL} onChange={handleChange} placeholder="e.g. 8" />
              <ToggleField label="Memory Complaints" value={features.MemoryComplaints} onChange={v => handleToggle('MemoryComplaints', v)} />
              <ToggleField label="Behavioral Problems" value={features.BehavioralProblems} onChange={v => handleToggle('BehavioralProblems', v)} />
              <ToggleField label="Confusion" value={features.Confusion} onChange={v => handleToggle('Confusion', v)} />
              <ToggleField label="Disorientation" value={features.Disorientation} onChange={v => handleToggle('Disorientation', v)} />
              <ToggleField label="Personality Changes" value={features.PersonalityChanges} onChange={v => handleToggle('PersonalityChanges', v)} />
              <ToggleField label="Difficulty Completing Tasks" value={features.DifficultyCompletingTasks} onChange={v => handleToggle('DifficultyCompletingTasks', v)} />
              <ToggleField label="Forgetfulness" value={features.Forgetfulness} onChange={v => handleToggle('Forgetfulness', v)} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                className="px-4 py-2 text-sm font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Next →
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Reset Form
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Running...' : '▶ Run Prediction Model'}
                </button>
              </div>
            )}
          </div>

          {/* Model selector */}
          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">Select Model</p>
            <div className="grid grid-cols-2 gap-2">
              {['random_forest', 'xgboost', 'logistic_regression', 'svm'].map(m => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  className={`text-xs font-medium py-2 px-3 rounded-lg border transition-colors ${
                    model === m ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {m.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right — Results Panel */}
        <div className="w-80 shrink-0 flex flex-col gap-4">

          {/* Prediction result */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-center mb-6">
              Prediction Analysis
            </h3>

            {!result && !error && (
              <div className="text-center py-8">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-slate-300">—</span>
                </div>
                <p className="text-xs text-slate-400">Fill the form and run the model</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {result && (
              <>
                <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center mx-auto mb-4 ${
                  result.prediction === 1 ? 'border-red-400 bg-red-50' : 'border-green-400 bg-green-50'
                }`}>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${result.prediction === 1 ? 'text-red-600' : 'text-green-600'}`}>
                      {result.prediction === 1 ? '⚠️' : '✅'}
                    </p>
                    <p className={`text-xs font-semibold ${result.prediction === 1 ? 'text-red-600' : 'text-green-600'}`}>
                      {result.prediction === 1 ? 'POSITIVE' : 'NEGATIVE'}
                    </p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className={`text-3xl font-bold ${result.prediction === 1 ? 'text-red-600' : 'text-green-600'}`}>
                    {result.prediction === 1 ? 'Alzheimer\'s Likely' : 'Not Likely'}
                  </p>
                  {result.probability !== null && (
                    <p className="text-sm text-slate-500 mt-1">
                      Confidence: <span className="font-semibold text-slate-700">{(result.probability * 100).toFixed(1)}%</span>
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-slate-500">
                    Model: <span className="font-semibold text-slate-700">{result.model.replace(/_/g, ' ')}</span>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* SHAP top features */}
          {topFeatures.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                Key Contributing Factors
              </p>
              <div className="flex flex-col gap-3">
                {topFeatures.slice(0, 5).map(([feat, val]) => (
                  <div key={feat} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 truncate max-w-[60%]">{feat}</span>
                    <span className={`text-xs font-semibold ${val > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {val > 0 ? '↑' : '↓'} {Math.abs(val).toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical note */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">ℹ Clinical Note</p>
            <p className="text-xs text-blue-600 leading-relaxed">
              This tool is for academic purposes only and is not a substitute for professional medical diagnosis.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}