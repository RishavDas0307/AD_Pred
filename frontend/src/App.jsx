import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Predictor from './pages/Predictor';
import ModelComparison from './pages/ModelComparison';
import Explainability from './pages/Explainability';
import DatasetAnalysis from './pages/DatasetAnalysis';
import Research from './pages/Research';
import About from './pages/About';
import Docs from './pages/Docs';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#faf8ff] flex text-[#131b2e]">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          {/* Header Topbar */}
          <Header onOpenMobile={() => setMobileOpen(true)} />

          {/* Page Body Canvas */}
          <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/predict" element={<Predictor />} />
              <Route path="/predictor" element={<Predictor />} />
              <Route path="/models" element={<ModelComparison />} />
              <Route path="/comparison" element={<ModelComparison />} />
              <Route path="/explainability" element={<Explainability />} />
              <Route path="/dataset" element={<DatasetAnalysis />} />
              <Route path="/research" element={<Research />} />
              <Route path="/about" element={<About />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}