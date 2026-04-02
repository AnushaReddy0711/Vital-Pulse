import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'DONOR',    label: '🩸 Donor',            desc: 'I want to donate blood' },
  { value: 'PATIENT',  label: '🏥 Patient/Requester', desc: 'I need blood for treatment' },
  { value: 'HOSPITAL', label: '🏦 Hospital/Blood Bank',desc: 'I manage blood inventory' },
];

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

export default function RegisterPage() {
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  if (currentUser) {
    const map = { DONOR: '/donor', PATIENT: '/patient', HOSPITAL: '/hospital', ADMIN: '/admin' };
    navigate(map[currentUser.role] || '/');
  }

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())     errs.name     = 'Name is required';
    if (!form.email.trim())    errs.email    = 'Email is required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.role)            errs.role     = 'Please select a role';
    if (!form.city.trim())     errs.city     = 'City is required';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to BloodDMS, ${user.name}! 🩸`);
      const map = { DONOR: '/donor', PATIENT: '/patient', HOSPITAL: '/hospital', ADMIN: '/admin' };
      navigate(map[user.role] || '/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="w-full max-w-lg animate-slide-up">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-gradient-to-br from-blood-500 to-blood-700 rounded-xl items-center justify-center shadow-lg shadow-blood-900/50 mb-4">
            <span className="text-xl">🩸</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join BloodDMS and make a difference</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Role selector */}
            <div>
              <label className="label">Select Your Role*</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ROLES.map(r => (
                  <button type="button" key={r.value}
                    onClick={() => { setForm(p => ({ ...p, role: r.value })); setErrors(p => ({ ...p, role: '' })); }}
                    className={`p-3 rounded-xl border text-left transition-all duration-200
                      ${form.role === r.value
                        ? 'border-blood-500 bg-blood-600/20 text-white'
                        : 'border-dark-600 bg-dark-900 text-gray-400 hover:border-dark-500 hover:bg-dark-700'}`}>
                    <div className="font-semibold text-sm">{r.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-blood-400 text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="reg-name">Full Name*</label>
                <input id="reg-name" name="name" type="text" className="input"
                  placeholder="Rahul Sharma"
                  value={form.name} onChange={handleChange} />
                {errors.name && <p className="text-blood-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="label" htmlFor="reg-email">Email Address*</label>
                <input id="reg-email" name="email" type="email" className="input"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange} />
                {errors.email && <p className="text-blood-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="reg-password">Password*</label>
                <input id="reg-password" name="password" type="password" className="input"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} />
                {errors.password && <p className="text-blood-400 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="label" htmlFor="reg-city">City*</label>
                <input id="reg-city" name="city" type="text" className="input"
                  placeholder="Delhi, Mumbai..."
                  value={form.city} onChange={handleChange} />
                {errors.city && <p className="text-blood-400 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            {errors.general && (
              <div className="p-3 bg-blood-900/30 border border-blood-700 rounded-xl text-blood-300 text-sm">
                ⚠️ {errors.general}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blood-400 hover:text-blood-300 font-medium transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
