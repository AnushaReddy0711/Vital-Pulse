import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAnalytics } from '../services/adminService';

const roleCards = [
  {
    role: 'DONOR',
    icon: '🩸',
    title: 'Blood Donor',
    desc: 'Register as a donor, manage your eligibility, and help save lives with your blood donation.',
    color: 'from-blood-600 to-blood-800',
    glow: 'hover:shadow-blood-900/40',
    link: '/register',
  },
  {
    role: 'PATIENT',
    icon: '🏥',
    title: 'Patient / Requester',
    desc: 'Request blood units for surgeries or emergencies. Track your requests and find matched donors.',
    color: 'from-blue-600 to-blue-800',
    glow: 'hover:shadow-blue-900/40',
    link: '/register',
  },
  {
    role: 'HOSPITAL',
    icon: '🏦',
    title: 'Hospital / Blood Bank',
    desc: 'Manage your blood inventory, approve patient requests, and maintain adequate blood stock levels.',
    color: 'from-emerald-600 to-emerald-800',
    glow: 'hover:shadow-emerald-900/40',
    link: '/register',
  },
  {
    role: 'ADMIN',
    icon: '⚙️',
    title: 'Administrator',
    desc: 'Monitor the entire system, view analytics dashboards, and manage all users and operations.',
    color: 'from-purple-600 to-purple-800',
    glow: 'hover:shadow-purple-900/40',
    link: '/login',
  },
];

const steps = [
  { icon: '📝', step: '01', title: 'Register', desc: 'Create your account and choose your role in the system.' },
  { icon: '🩸', step: '02', title: 'Connect', desc: 'Donors get matched with patients needing the same blood group.' },
  { icon: '💉', step: '03', title: 'Save Lives', desc: 'Complete the donation and update request status in real time.' },
];

export default function HomePage() {
  const { currentUser } = useAuth();
  const navigate        = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAnalytics().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const roleRoutes = { DONOR: '/donor', PATIENT: '/patient', HOSPITAL: '/hospital', ADMIN: '/admin' };

  return (
    <div className="page-container">

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-radial from-blood-900/30 via-dark-950 to-dark-950 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blood-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-0 w-80 h-80 bg-blood-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="content-area relative z-10 py-24 text-center">
          {/* Animated blood drop */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blood-500 to-blood-800 rounded-[40%_60%_60%_40%/60%_40%_60%_40%] shadow-2xl shadow-blood-900/60 animate-pulse-slow flex items-center justify-center">
                <span className="text-4xl">🩸</span>
              </div>
              <div className="absolute -inset-2 bg-blood-600/20 rounded-full blur-xl animate-pulse" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            VitalPulse.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blood-400 to-blood-600">
              Smart Blood Network.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time management for donors, patients, and hospitals to ensure 
            seamless blood supply across the city.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {currentUser ? (
              <button
                onClick={() => navigate(roleRoutes[currentUser.role] || '/')}
                className="btn-primary text-base px-8 py-3">
                Go to My Dashboard →
              </button>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-base px-8 py-3">Get Started Free</Link>
                <Link to="/login"    className="btn-secondary text-base px-8 py-3">Sign In</Link>
              </>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: 'Registered Donors',  value: stats.totalDonors,   icon: '🩸' },
                { label: 'Blood Requests',      value: stats.totalRequests,  icon: '📋' },
                { label: 'Hospitals / Banks',   value: stats.totalHospitals, icon: '🏦' },
                { label: 'Eligible Donors',     value: stats.eligibleDonors, icon: '✅' },
              ].map(s => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-3xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Role Cards ─── */}
      <section className="content-area py-16">
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl">Who are you?</h2>
          <p className="section-subtitle">Choose your role and get started in minutes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {roleCards.map(card => (
            <Link key={card.role} to={card.link}
              className={`card-hover flex flex-col gap-4 group ${card.glow} hover:shadow-2xl`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg`}>
                {card.icon}
              </div>
              <div>
                <div className="font-bold text-white text-lg mb-1">{card.title}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{card.desc}</div>
              </div>
              <div className="mt-auto flex items-center text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                Get Started <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="content-area py-12 border-t border-dark-800">
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl">How It Works</h2>
          <p className="section-subtitle">Simple, fast, and life-saving</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.step} className="text-center flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-dark-800 border-2 border-blood-700 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                  {s.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blood-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </div>
              </div>
              <div>
                <div className="font-bold text-white text-lg">{s.title}</div>
                <div className="text-sm text-gray-400 mt-1">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-dark-800 py-8 text-center text-gray-600 text-sm">
        <p>🩸 BloodDMS — Blood Donation & Management System © 2025</p>
      </footer>
    </div>
  );
}
