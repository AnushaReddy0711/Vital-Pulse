import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (currentUser) {
    const map = { DONOR: '/donor', PATIENT: '/patient', HOSPITAL: '/hospital', ADMIN: '/admin' };
    navigate(map[currentUser.role] || '/');
  }

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 🩸`);
      const map = { DONOR: '/donor', PATIENT: '/patient', HOSPITAL: '/hospital', ADMIN: '/admin' };
      navigate(map[user.role] || '/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const demoLogins = [
    { label: 'Admin',    email: 'admin@blood.com',    password: 'admin123',    color: 'text-purple-400' },
    { label: 'Hospital', email: 'hospital@blood.com', password: 'hospital123', color: 'text-emerald-400' },
    { label: 'Donor',    email: 'rahul@donor.com',    password: 'donor123',    color: 'text-blood-400' },
    { label: 'Patient',  email: 'patient@blood.com',  password: 'patient123',  color: 'text-blue-400' },
  ];

  const fillDemo = (d) => setForm({ email: d.email, password: d.password });

  return (
    <div className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blood-500 to-blood-700 rounded-xl flex items-center justify-center shadow-lg shadow-blood-900/50">
              <span className="text-xl">🩸</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your BloodDMS account</p>
        </div>

        {/* Card */}
        <div className="card">
          {/* Demo quick logins */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              {demoLogins.map(d => (
                <button key={d.label} onClick={() => fillDemo(d)}
                  className="bg-dark-900 border border-dark-600 hover:border-dark-500 rounded-xl py-2 px-3 text-left transition-all hover:bg-dark-700 group">
                  <div className={`text-xs font-semibold ${d.color}`}>{d.label}</div>
                  <div className="text-xs text-gray-500 truncate group-hover:text-gray-400">{d.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-dark-700 my-4" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="login-email">Email Address</label>
              <input id="login-email" name="email" type="email" className="input"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="login-password">Password</label>
              <input id="login-password" name="password" type="password" className="input"
                placeholder="••••••••"
                value={form.password} onChange={handleChange} />
            </div>

            {error && (
              <div className="p-3 bg-blood-900/30 border border-blood-700 rounded-xl text-blood-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blood-400 hover:text-blood-300 font-medium transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
