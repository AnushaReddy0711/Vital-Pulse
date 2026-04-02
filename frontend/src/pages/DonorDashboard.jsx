import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDonorByUser, registerDonor, updateEligibility } from '../services/donorService';
import { getAllRequests } from '../services/requestService';
import BloodRequestCard from '../components/BloodRequestCard';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

const eligibilityRules = [
  { ok: true,  text: 'Aged between 18–65 years' },
  { ok: true,  text: 'Weight above 50 kg' },
  { ok: true,  text: 'Haemoglobin ≥ 12.5 g/dL' },
  { ok: null,  text: 'No donation in last 90 days' },
  { ok: true,  text: 'No active infections or fever' },
];

export default function DonorDashboard() {
  const { currentUser }      = useAuth();
  const [donor, setDonor]    = useState(null);
  const [loading, setLoading]= useState(true);
  const [saving, setSaving]  = useState(false);
  const [form, setForm]      = useState({ bloodGroup: '', eligible: true });
  const [nearbyReqs, setNearbyReqs] = useState([]);

  useEffect(() => {
    fetchDonor();
    fetchNearbyRequests();
  }, []);

  const fetchDonor = async () => {
    try {
      const res = await getDonorByUser(currentUser.id);
      setDonor(res.data);
    } catch {
      setDonor(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyRequests = async () => {
    try {
      const res = await getAllRequests();
      const filtered = res.data.filter(r =>
        r.city?.toLowerCase() === currentUser.city?.toLowerCase() &&
        r.status === 'PENDING'
      );
      setNearbyReqs(filtered);
    } catch {}
  };

  const handleRegister = async e => {
    e.preventDefault();
    if (!form.bloodGroup) { toast.error('Please select a blood group'); return; }
    setSaving(true);
    try {
      const res = await registerDonor({ ...form, userId: currentUser.id });
      setDonor(res.data);
      toast.success('🩸 Donor profile created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEligibility = async () => {
    setSaving(true);
    try {
      const res = await updateEligibility(donor.id, !donor.eligible);
      setDonor(res.data);
      toast.success(res.data.eligible ? '✅ Marked as eligible' : '🚫 Marked as donated (cooldown started)');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blood-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-gray-400">Loading your profile...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="content-area">

        {/* Page Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blood-600/20 border border-blood-600/30 flex items-center justify-center text-xl">🩸</div>
            <div>
              <h1 className="section-title mb-0">Donor Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome, <span className="text-white font-semibold">{currentUser.name}</span> — {currentUser.city}</p>
            </div>
          </div>
        </div>

        {!donor ? (
          /* ─── Register as Donor ─── */
          <div className="max-w-lg animate-slide-up">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-1">Register as a Blood Donor</h2>
              <p className="text-gray-400 text-sm mb-6">Set up your donor profile to start saving lives.</p>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                  <label className="label">Blood Group*</label>
                  <div className="grid grid-cols-4 gap-2">
                    {BLOOD_GROUPS.map(bg => (
                      <button type="button" key={bg}
                        onClick={() => setForm(p => ({ ...p, bloodGroup: bg }))}
                        className={`py-2.5 rounded-xl text-sm font-bold border transition-all duration-150
                          ${form.bloodGroup === bg
                            ? 'bg-blood-600 border-blood-500 text-white shadow-lg shadow-blood-900/40'
                            : 'bg-dark-900 border-dark-600 text-gray-400 hover:border-blood-700 hover:text-white'}`}>
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-dark-900/60 rounded-xl border border-dark-700">
                  <input type="checkbox" id="eligible-check" checked={form.eligible}
                    onChange={e => setForm(p => ({ ...p, eligible: e.target.checked }))}
                    className="w-4 h-4 rounded accent-blood-600" />
                  <label htmlFor="eligible-check" className="text-sm text-gray-300 cursor-pointer">
                    I confirm I am currently eligible to donate blood
                  </label>
                </div>

                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Registering...' : '🩸 Register as Donor'}
                </button>
              </form>
            </div>

            {/* Eligibility Criteria */}
            <div className="card mt-5">
              <h3 className="font-semibold text-white mb-3">Eligibility Criteria</h3>
              <ul className="space-y-2">
                {eligibilityRules.map((rule, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className={rule.ok ? 'text-emerald-400' : 'text-yellow-400'}>
                      {rule.ok ? '✓' : '⚠'}
                    </span>
                    <span className="text-gray-300">{rule.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* ─── Donor Profile ─── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">

            {/* Profile Card */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              <div className="card text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blood-500 to-blood-800 flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-blood-900/40 mx-auto mb-4">
                  {donor.bloodGroup}
                </div>
                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <p className="text-gray-400 text-sm mt-0.5">📍 {currentUser.city}</p>
                <p className="text-gray-500 text-xs mt-1">{currentUser.email}</p>

                <div className="mt-4 mb-5">
                  {donor.eligible
                    ? <span className="badge-completed text-sm px-4 py-1.5">✓ Eligible to Donate</span>
                    : <span className="badge-rejected  text-sm px-4 py-1.5">✕ Currently Ineligible</span>
                  }
                </div>

                {donor.lastDonationDate && (
                  <p className="text-xs text-gray-500 mb-4">
                    Last donated: <span className="text-gray-400">{donor.lastDonationDate}</span>
                  </p>
                )}

                <button
                  onClick={handleToggleEligibility}
                  disabled={saving}
                  className={donor.eligible ? 'btn-secondary w-full' : 'btn-success w-full'}>
                  {saving
                    ? 'Updating...'
                    : donor.eligible
                      ? '🚫 Mark as Donated'
                      : '✅ Mark as Eligible Again'}
                </button>
              </div>

              {/* Eligibility Info */}
              <div className="card">
                <h3 className="font-semibold text-white mb-3 text-sm">Donor Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Blood Group</span><span className="text-blood-400 font-bold">{donor.bloodGroup}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Status</span><span className={donor.eligible ? 'text-emerald-400' : 'text-red-400'}>{donor.eligible ? 'Eligible' : 'Ineligible'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Donor ID</span><span className="text-gray-300">#{donor.id}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">City</span><span className="text-gray-300">{currentUser.city}</span></div>
                </div>
              </div>
            </div>

            {/* Nearby Pending Requests */}
            <div className="lg:col-span-2">
              <h2 className="section-title text-lg mb-1">Pending Requests in {currentUser.city}</h2>
              <p className="section-subtitle text-sm">Blood requests near you that need attention</p>
              {nearbyReqs.length === 0 ? (
                <div className="card text-center py-12">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-gray-400">No pending blood requests in your city right now.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {nearbyReqs.map(r => <BloodRequestCard key={r.id} request={r} />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
