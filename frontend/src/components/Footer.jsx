import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AD</span>
          </div>
          <span className="font-semibold text-slate-900 text-sm">AD_Pred</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a>
          <a href="https://github.com/RishavDas0307/AD_Pred" target="_blank" rel="noreferrer" className="hover:text-slate-700 transition-colors">GitHub</a>
          <Link to="/docs" className="hover:text-slate-700 transition-colors">Documentation</Link>
          <a href="#" className="hover:text-slate-700 transition-colors">Contact Support</a>
        </div>

        <p className="text-xs text-slate-400">© 2024 AD_Pred Clinical Systems. All rights reserved.</p>

      </div>
    </footer>
  )
}