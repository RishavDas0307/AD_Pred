import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Predictor', path: '/predictor' },
  { label: 'Research', path: '/research' },
  { label: 'Docs', path: '/docs' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AD</span>
          </div>
          <span className="font-semibold text-slate-900 text-sm">AD_Pred</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                pathname === link.path
                  ? 'text-blue-700 border-b-2 border-blue-700 pb-0.5'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/predictor"
          className="bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Try Predictor
        </Link>

      </div>
    </nav>
  )
}