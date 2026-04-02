import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleLinks = {
  DONOR:    [{ to: '/donor',    label: '🩸 My Dashboard' }],
  PATIENT:  [{ to: '/patient',  label: '🏥 My Dashboard' }],
  HOSPITAL: [{ to: '/hospital', label: '🏦 Dashboard'    }],
  ADMIN:    [{ to: '/admin',    label: '⚙️ Admin Panel'  }],
};

const roleBadgeColor = {
  DONOR:    'bg-blood-900/60 text-blood-300 border-blood-700',
  PATIENT:  'bg-blue-900/60 text-blue-300 border-blue-700',
  HOSPITAL: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  ADMIN:    'bg-purple-900/60 text-purple-300 border-purple-700',
};

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const links     = currentUser ? (roleLinks[currentUser.role] || []) : [];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-dark-700/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blood-500 to-blood-700 rounded-lg flex items-center justify-center shadow-lg shadow-blood-900/40 group-hover:scale-110 transition-transform">
              <span className="text-lg">⚡</span>
            </div>
            <span className="text-xl font-black text-white tracking-tight">VitalPulse</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                ${location.pathname === '/' ? 'bg-blood-600/20 text-blood-400' : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'}`}>
              Home
            </Link>
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                  ${location.pathname === l.to ? 'bg-blood-600/20 text-blood-400' : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth Area */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blood-500 to-blood-700 flex items-center justify-center text-white text-sm font-bold shadow">
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold leading-tight">{currentUser.name}</div>
                    <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${roleBadgeColor[currentUser.role]}`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-secondary btn-sm text-xs">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-secondary btn-sm text-sm">Login</Link>
                <Link to="/register" className="btn-primary  btn-sm text-sm">Register</Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
