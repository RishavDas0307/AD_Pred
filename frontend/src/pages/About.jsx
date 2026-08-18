import {
  Info,
  ShieldCheck,
  Cpu,
  Layers,
  Code2,
  CheckCircle2,
  AlertCircle,
  FlaskConical
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function About() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Project Overview</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container text-charcoal-variant font-bold">
            AD_Pred v1.0
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal mt-1">
          About AD_Pred
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-variant mt-1 max-w-3xl leading-relaxed">
          An open-source clinical intelligence platform exploring machine learning architectures and Explainable AI (XAI) for early Alzheimer's disease risk assessment.
        </p>
      </div>

      {/* Mission & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 clinical-card p-6 space-y-4">
          <h2 className="text-base font-bold text-charcoal">Mission &amp; Clinical Focus</h2>
          <p className="text-xs sm:text-sm text-charcoal-variant leading-relaxed">
            AD_Pred was created to bridge advanced statistical machine learning with clinical transparency. Rather than operating as a black-box model, the platform pairs high-accuracy classifiers with directional SHAP explainability, allowing researchers and clinicians to understand the specific clinical variables driving each prediction.
          </p>
          <p className="text-xs sm:text-sm text-charcoal-variant leading-relaxed">
            By focusing on non-invasive, structured clinical biomarkers (MMSE cognitive exams, activities of daily living, lipid panels, cardiovascular metrics, and lifestyle markers), AD_Pred investigates early risk estimation without relying exclusively on expensive imaging hardware.
          </p>
        </div>

        <div className="lg:col-span-4 clinical-card p-6 space-y-3 bg-surface-container-low">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">Technology Stack</h3>
          <ul className="space-y-2 text-xs font-mono text-charcoal-variant">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>FastAPI (Python Backend)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>scikit-learn &amp; XGBoost</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              <span>SHAP (Tree &amp; Kernel Explainer)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>React 18 + Vite + Tailwind CSS</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Supported Modalities vs Future Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currently Supported */}
        <div className="clinical-card p-6 space-y-3 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-charcoal">Currently Supported Modalities</h3>
          </div>
          <p className="text-xs text-charcoal-variant leading-relaxed">
            The active release is 100% powered by the Kaggle Alzheimer's Disease structured dataset (2,149 subjects):
          </p>
          <ul className="space-y-1.5 text-xs text-charcoal-variant list-disc list-inside">
            <li>Demographics (Age, Gender, Ethnicity, Education, BMI)</li>
            <li>Lifestyle Factors (Physical Activity, Diet, Sleep, Smoking, Alcohol)</li>
            <li>Medical Comorbidities (Hypertension, Diabetes, Depression, Head Trauma)</li>
            <li>Hemodynamic &amp; Lipid Panel (BP, Total Cholesterol, LDL, HDL, Triglycerides)</li>
            <li>Cognitive Scores (MMSE, Functional Assessment, ADL Independence)</li>
            <li>7 Neuropsychiatric Symptoms (Memory Complaints, Confusion, Disorientation)</li>
          </ul>
        </div>

        {/* Future Scope */}
        <div className="clinical-card p-6 space-y-3 border-t-4 border-t-primary">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-charcoal">Prospective Future Scope</h3>
          </div>
          <p className="text-xs text-charcoal-variant leading-relaxed">
            Future research directions for extended multi-modal integration:
          </p>
          <ul className="space-y-1.5 text-xs text-charcoal-variant list-disc list-inside">
            <li>Prospective integration of volumetric structural MRI (hippocampal atrophy)</li>
            <li>PET imaging tracer quantification (Amyloid-β / Tau burden)</li>
            <li>Genomic risk score integration (APOE-ε4 allele sequencing)</li>
            <li>Longitudinal time-series modeling of cognitive trajectory decay</li>
            <li>EHR interoperability via HL7 / FHIR standards for clinical trials</li>
          </ul>
        </div>
      </div>

      {/* Ethics & Academic Notice */}
      <MedicalDisclaimer />
    </div>
  );
}
