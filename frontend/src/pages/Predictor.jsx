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

const highRiskPreset = {
  Age: 78, Gender: 0, Ethnicity: 0, EducationLevel: 0,
  BMI: 31.4, Smoking: 1, AlcoholConsumption: 14.5, PhysicalActivity: 1.2,
  DietQuality: 3.1, SleepQuality: 5.0,
  FamilyHistoryAlzheimers: 1, CardiovascularDisease: 1,
  Diabetes: 1, Depression: 1, HeadInjury: 1, Hypertension: 1,
  SystolicBP: 155, DiastolicBP: 95,
  CholesterolTotal: 275, CholesterolLDL: 170, CholesterolHDL: 34, CholesterolTriglycerides: 290,
  MMSE: 9.5, FunctionalAssessment: 2.3,
  MemoryComplaints: 1, BehavioralProblems: 1, ADL: 2.8,
  Confusion: 1, Disorientation: 1, PersonalityChanges: 1,
  DifficultyCompletingTasks: 1, Forgetfulness: 1
}

const lowRiskPreset = {
  Age: 64, Gender: 1, Ethnicity: 1, EducationLevel: 2,
  BMI: 23.2, Smoking: 0, AlcoholConsumption: 2.0, PhysicalActivity: 7.5,
  DietQuality: 8.5, SleepQuality: 8.0,
  FamilyHistoryAlzheimers: 0, CardiovascularDisease: 0,
  Diabetes: 0, Depression: 0, HeadInjury: 0, Hypertension: 0,
  SystolicBP: 118, DiastolicBP: 76,
  CholesterolTotal: 180, CholesterolLDL: 95, CholesterolHDL: 65, CholesterolTriglycerides: 120,
  MMSE: 28.5, FunctionalAssessment: 9.0,
  MemoryComplaints: 0, BehavioralProblems: 0, ADL: 9.2,
  Confusion: 0, Disorientation: 0, PersonalityChanges: 0,
  DifficultyCompletingTasks: 0, Forgetfulness: 0
}

const steps = ['Demographics', 'Lifestyle & History', 'Clinical Measures', 'Cognitive & Symptoms']

function ToggleField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-2">{label}</label>
      <div className="flex rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => onChange(0)}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            value === 0 ? 'bg-blue-700 text-white shadow-inner' : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => onChange(1)}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            value === 1 ? 'bg-blue-700 text-white shadow-inner' : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Yes
        </button>
      </div>
    </div>
  )
}

function NumberField({ label, name, value, onChange, placeholder, min, max, unit }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="block text-xs font-semibold text-slate-600">{label}</label>
        {unit && <span className="text-[11px] text-slate-400 font-medium">{unit}</span>}
      </div>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step="any"
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
      />
    </div>
  )
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
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
  const [explanations, setExplanations] = useState([])
  const [topFeatures, setTopFeatures] = useState([])
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setFeatures(prev => ({ ...prev, [name]: value }))
  }

  function handleToggle(name, value) {
    setFeatures(prev => ({ ...prev, [name]: value }))
  }

  function loadPreset(presetData) {
    setFeatures(presetData)
    setResult(null)
    setExplanations([])
    setTopFeatures([])
    setError(null)
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    setExplanations([])
    setTopFeatures([])

    const parsed = {}
    for (const [k, v] of Object.entries(features)) {
      parsed[k] = typeof v === 'string' ? (v === '' ? 0 : parseFloat(v) || 0) : v
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

      if (!predRes.ok) {
        throw new Error(`Prediction API returned status ${predRes.status}`)
      }

      const predData = await predRes.json()
      let explainData = {}
      try {
        if (explainRes.ok) {
          explainData = await explainRes.json()
        }
      } catch {
        // Fallback gracefully
      }

      setResult(predData)
      const exps = predData.explanations || explainData.explanations || []
      setExplanations(exps)
      setTopFeatures(explainData.top_features || [])
    } catch (err) {
      console.error(err)
      setError('Could not connect to the backend API. Make sure FastAPI server is running on http://localhost:8000.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setFeatures(defaultFeatures)
    setResult(null)
    setExplanations([])
    setTopFeatures([])
    setError(null)
    setStep(0)
  }

  const modelLabels = {
    random_forest: 'Random Forest (95.1% Acc)',
    xgboost: 'XGBoost (94.7% Acc)',
    logistic_regression: 'Logistic Regression (81.6% Acc)',
    svm: 'Support Vector Machine (84.2% Acc)'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Clinical Risk Assessment & Explainability</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-2xl">
            Input patient clinical metrics to generate a risk estimate accompanied by human-readable explanations of the key contributing factors.
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset(highRiskPreset)}
            className="text-xs px-3 py-1.5 font-medium rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            ⚠️ High Risk Case
          </button>
          <button
            type="button"
            onClick={() => loadPreset(lowRiskPreset)}
            className="text-xs px-3 py-1.5 font-medium rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            ✅ Low Risk Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column — Multi-Step Form */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* Progress bar / Step Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap gap-1.5">
                {steps.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setStep(i)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      i === step
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}. {s}
                  </button>
                ))}
              </div>
              <span className="text-xs font-medium text-slate-400">Step {step + 1} of {steps.length}</span>
            </div>

            {/* Progress track */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-700 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 0 — Demographics */}
          {step === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                1. Patient Demographics & Body Metrics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberField label="Age" name="Age" value={features.Age} onChange={handleChange} placeholder="e.g. 72" min={50} max={95} unit="years (50-95)" />
                <SelectField label="Gender" name="Gender" value={features.Gender} onChange={handleChange}
                  options={[{ value: 0, label: 'Male' }, { value: 1, label: 'Female' }]} />
                <SelectField label="Ethnicity" name="Ethnicity" value={features.Ethnicity} onChange={handleChange}
                  options={[{ value: 0, label: 'Caucasian' }, { value: 1, label: 'African American' }, { value: 2, label: 'Asian' }, { value: 3, label: 'Other' }]} />
                <SelectField label="Education Level" name="EducationLevel" value={features.EducationLevel} onChange={handleChange}
                  options={[{ value: 0, label: 'None / Elementary' }, { value: 1, label: 'High School' }, { value: 2, label: "Bachelor's Degree" }, { value: 3, label: 'Higher Education' }]} />
                <div className="sm:col-span-2">
                  <NumberField label="Body Mass Index (BMI)" name="BMI" value={features.BMI} onChange={handleChange} placeholder="e.g. 26.5" unit="kg/m² (15-40)" />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Lifestyle & History */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                2. Lifestyle Factors & Medical History
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ToggleField label="Smoking History" value={features.Smoking} onChange={v => handleToggle('Smoking', v)} />
                <ToggleField label="Family History of Alzheimer's" value={features.FamilyHistoryAlzheimers} onChange={v => handleToggle('FamilyHistoryAlzheimers', v)} />
                <ToggleField label="Cardiovascular Disease" value={features.CardiovascularDisease} onChange={v => handleToggle('CardiovascularDisease', v)} />
                <ToggleField label="Diabetes" value={features.Diabetes} onChange={v => handleToggle('Diabetes', v)} />
                <ToggleField label="Depression History" value={features.Depression} onChange={v => handleToggle('Depression', v)} />
                <ToggleField label="Head Injury / Trauma" value={features.HeadInjury} onChange={v => handleToggle('HeadInjury', v)} />
                <ToggleField label="Hypertension" value={features.Hypertension} onChange={v => handleToggle('Hypertension', v)} />
                <NumberField label="Alcohol Consumption" name="AlcoholConsumption" value={features.AlcoholConsumption} onChange={handleChange} placeholder="e.g. 4.0" unit="units/week (0-20)" />
                <NumberField label="Physical Activity" name="PhysicalActivity" value={features.PhysicalActivity} onChange={handleChange} placeholder="e.g. 5.5" unit="hrs/week (0-10)" />
                <NumberField label="Diet Quality Score" name="DietQuality" value={features.DietQuality} onChange={handleChange} placeholder="e.g. 7.0" unit="scale 0-10" />
                <div className="sm:col-span-2">
                  <NumberField label="Sleep Quality Score" name="SleepQuality" value={features.SleepQuality} onChange={handleChange} placeholder="e.g. 7.5" unit="scale 4-10" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Clinical Measures */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                3. Clinical & Blood Biomarkers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberField label="Systolic Blood Pressure" name="SystolicBP" value={features.SystolicBP} onChange={handleChange} placeholder="e.g. 125" unit="mmHg (90-180)" />
                <NumberField label="Diastolic Blood Pressure" name="DiastolicBP" value={features.DiastolicBP} onChange={handleChange} placeholder="e.g. 82" unit="mmHg (60-120)" />
                <NumberField label="Total Cholesterol" name="CholesterolTotal" value={features.CholesterolTotal} onChange={handleChange} placeholder="e.g. 210" unit="mg/dL (150-300)" />
                <NumberField label="LDL Cholesterol ('Bad')" name="CholesterolLDL" value={features.CholesterolLDL} onChange={handleChange} placeholder="e.g. 115" unit="mg/dL (50-200)" />
                <NumberField label="HDL Cholesterol ('Good')" name="CholesterolHDL" value={features.CholesterolHDL} onChange={handleChange} placeholder="e.g. 55" unit="mg/dL (20-100)" />
                <NumberField label="Triglycerides" name="CholesterolTriglycerides" value={features.CholesterolTriglycerides} onChange={handleChange} placeholder="e.g. 160" unit="mg/dL (50-400)" />
              </div>
            </div>
          )}

          {/* Step 3 — Cognitive & Symptoms */}
          {step === 3 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                4. Cognitive Scores & Daily Symptoms
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberField label="MMSE Score" name="MMSE" value={features.MMSE} onChange={handleChange} placeholder="e.g. 24.5" unit="score 0-30" />
                <NumberField label="Functional Assessment" name="FunctionalAssessment" value={features.FunctionalAssessment} onChange={handleChange} placeholder="e.g. 6.8" unit="score 0-10" />
                <div className="sm:col-span-2">
                  <NumberField label="Activities of Daily Living (ADL)" name="ADL" value={features.ADL} onChange={handleChange} placeholder="e.g. 7.5" unit="score 0-10" />
                </div>
                <ToggleField label="Reported Memory Complaints" value={features.MemoryComplaints} onChange={v => handleToggle('MemoryComplaints', v)} />
                <ToggleField label="Reported Behavioral Problems" value={features.BehavioralProblems} onChange={v => handleToggle('BehavioralProblems', v)} />
                <ToggleField label="Confusion Episodes" value={features.Confusion} onChange={v => handleToggle('Confusion', v)} />
                <ToggleField label="Disorientation" value={features.Disorientation} onChange={v => handleToggle('Disorientation', v)} />
                <ToggleField label="Personality Changes" value={features.PersonalityChanges} onChange={v => handleToggle('PersonalityChanges', v)} />
                <ToggleField label="Difficulty Completing Tasks" value={features.DifficultyCompletingTasks} onChange={v => handleToggle('DifficultyCompletingTasks', v)} />
                <div className="sm:col-span-2">
                  <ToggleField label="Frequent Forgetfulness" value={features.Forgetfulness} onChange={v => handleToggle('Forgetfulness', v)} />
                </div>
              </div>
            </div>
          )}

          {/* Step Navigation Bar */}
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <button
              type="button"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous Step
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                className="px-5 py-2 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 shadow-sm transition-colors"
              >
                Next Step →
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold bg-blue-700 text-white rounded-lg hover:bg-blue-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Features...
                    </>
                  ) : (
                    '▶ Run Prediction & Explain'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Model Selector Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Classification Model</p>
              <span className="text-xs text-slate-400">All models provide direction-aware explainability</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['random_forest', 'xgboost', 'logistic_regression', 'svm'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={`text-xs font-semibold py-2.5 px-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                    model === m
                      ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{modelLabels[m]}</span>
                  {model === m && <span className="text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column — Results & Natural Language Explanations */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* Prediction Result Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-5 pb-2 border-b border-slate-100">
              Prediction Summary
            </h3>

            {!result && !error && !loading && (
              <div className="text-center py-10">
                <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-4 bg-slate-50">
                  <span className="text-2xl text-slate-300 font-light">📊</span>
                </div>
                <p className="text-sm font-medium text-slate-600">No Assessment Performed Yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Fill in the patient clinical measures on the left or select a quick preset to generate an assessment.
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-10">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm font-semibold text-slate-700">Calculating Model Attribution...</p>
                <p className="text-xs text-slate-400 mt-1">Extracting key contributing risk factors</p>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700">
                <div className="flex items-start gap-2">
                  <span className="text-base">⚠️</span>
                  <div>
                    <p className="font-semibold text-rose-800">Connection Error</p>
                    <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && !loading && (
              <>
                {/* Visual Status Indicator */}
                <div className={`p-4 rounded-xl border mb-5 flex items-center gap-4 ${
                  result.prediction === 1
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-sm ${
                    result.prediction === 1
                      ? 'bg-rose-100 border border-rose-300'
                      : 'bg-emerald-100 border border-emerald-300'
                  }`}>
                    {result.prediction === 1 ? '⚠️' : '✅'}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Model Assessment</span>
                    <h4 className="text-xl font-bold">
                      {result.prediction === 1 ? 'Elevated Risk' : 'Lower Risk Profile'}
                    </h4>
                    {result.probability !== null && (
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        Estimated Risk Probability: <span className="font-bold text-slate-900">{(result.probability * 100).toFixed(1)}%</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 rounded-lg px-3.5 py-2 mb-2">
                  <span>Active Classifier:</span>
                  <span className="font-semibold text-slate-700">{result.model.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
              </>
            )}
          </div>

          {/* Natural Language Explanations Card */}
          {result && explanations.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Key Factors Influencing This Prediction
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ranked by influence on the model's estimate
                  </p>
                </div>
                <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                  Top {explanations.length} Factors
                </span>
              </div>

              {/* Natural Language List */}
              <div className="space-y-3">
                {explanations.map((item, idx) => {
                  const isRiskIncrease = item.impact === 'increased_risk'
                  return (
                    <div
                      key={item.feature || idx}
                      className={`p-3.5 rounded-xl border transition-all text-sm ${
                        isRiskIncrease
                          ? 'bg-rose-50/60 border-rose-100 hover:border-rose-200'
                          : 'bg-emerald-50/60 border-emerald-100 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-bold shrink-0 mt-0.5 flex items-center gap-1 ${
                          isRiskIncrease
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isRiskIncrease ? '↑ Increased Risk' : '↓ Lower Risk'}
                        </span>
                        <div className="flex-1">
                          <p className="text-slate-800 font-medium leading-snug">
                            {item.statement}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                            <span>
                              <strong className="text-slate-700">{item.label}:</strong> {item.formatted_value}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Technical Attribution Toggle */}
              {topFeatures.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowTechnicalDetails(prev => !prev)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    <span>{showTechnicalDetails ? 'Hide technical attribution scores' : 'Show technical attribution scores'}</span>
                    <span>{showTechnicalDetails ? '▲' : '▼'}</span>
                  </button>

                  {showTechnicalDetails && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                      <p className="font-semibold text-slate-600 mb-1 text-[11px] uppercase tracking-wider">Raw Model Attribution Weights:</p>
                      {topFeatures.slice(0, 5).map(([feat, val]) => (
                        <div key={feat} className="flex justify-between items-center font-mono text-[11px]">
                          <span className="text-slate-600">{feat}</span>
                          <span className={val > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                            {val > 0 ? '+' : ''}{Number(val).toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Prominent Medical Disclaimer Card */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-2.5">
              <span className="text-base shrink-0">ℹ️</span>
              <div className="text-xs text-amber-900 leading-relaxed">
                <p className="font-bold text-amber-950 mb-1">Important Medical & Academic Notice</p>
                <p>
                  This risk score and its factor explanations are generated by a machine-learning model trained on clinical study data for screening and research demonstration.
                </p>
                <p className="mt-1 font-semibold text-amber-950">
                  This tool does not provide medical diagnosis or clinical treatment advice. Consult a certified physician or neurologist for medical evaluations.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}