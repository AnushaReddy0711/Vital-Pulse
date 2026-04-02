import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createRequest, getRequestsByPatient, matchDonorsForRequest } from '../services/requestService';
import BloodRequestCard from '../components/BloodRequestCard';
import DonorCard from '../components/DonorCard';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

const initialForm = { bloodGroup:'', units:1, city:'', emergency:false, notes:'' };

export default function PatientDashboard() {
  const { currentUser }               = useAuth();
  const [form, setForm]               = useState({ ...initialForm, city: currentUser.city || '' });
  const [requests, setRequests]       = useState([]);
  const [matchedDonors, setMatched]   = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [finding, setFinding]         = useState(false);
  const [activeTab, setActiveTab]     = useState('request');

  useEffect(() => { fetchMyRequests(); }, []);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const res = await getRequestsByPatient(currentUser.id);
      setRequests(res.data.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)));
    } catch { toast.error('Could not load requests'); }
    finally  { setLoading(false); }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.bloodGroup) { toast.error('Please select a blood group'); return; }
    if (!form.city.trim()) { toast.error('Please enter your city'); return; }
    if (form.units < 1)   { toast.error('Units must be at least 1'); return; }
    setSubmitting(true);
    try {
      await createRequest({ ...form, units: Number(form.units), patientId: currentUser.id });
      toast.success('🩸 Blood request submitted!');
      setForm({ ...initialForm, city: currentUser.city || '' });
      setActiveTab('track');
      await fetchMyRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit request');
    } finally { setSubmitting(false); }
  };

  const handleFindDonors = async (req) => {
    setSelectedReq(req);
    setFinding(true);
    setMatched([]);
    setActiveTab('donors');
    try {
      const res = await matchDonorsForRequest(req.bloodGroup, req.city);
      setMatched(res.data);
      if (res.data.length === 0) toast('No eligible donors found in your area', { icon: '😔' });
    } catch { toast.error('Could not find donors'); }
    finally  { setFinding(false); }
  };

  const tabs = [
    { id: 'request', label: '📋 Request Blood' },
    { id: 'track',   label: `📦 My Requests (${requests.length})` },
    { id: 'donors',  label: '🧑‍⚕️ Matched Donors' },
  ];

  return (
    <div className="page-container">
      <div className="content-area">

        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-xl">🏥</div>
            <div>
              <h1 className="section-title mb-0">Patient Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome, <span className="text-white font-semibold">{currentUser.name}</span></p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-dark-800 border border-dark-700 rounded-2xl w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-blood-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Tab: Request Blood ─── */}
        {activeTab === 'request' && (
          <div className="max-w-xl animate-slide-up">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-1">Request Blood</h2>
              <p className="text-gray-400 text-sm mb-6">Fill in the details and submit your blood request.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Blood Group */}
                <div>
                  <label className="label">Blood Group Needed*</label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="req-units">Units Required*</label>
                    <input id="req-units" name="units" type="number" min="1" max="20"
                      className="input" value={form.units} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label" htmlFor="req-city">City*</label>
                    <input id="req-city" name="city" type="text"
                      className="input" placeholder="Delhi..."
                      value={form.city} onChange={handleChange} />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="req-notes">Notes (optional)</label>
                  <textarea id="req-notes" name="notes" rows="2"
                    className="input resize-none" placeholder="Reason, hospital name, urgency..."
                    value={form.notes} onChange={handleChange} />
                </div>

                {/* Emergency toggle */}
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
                  ${form.emergency ? 'bg-blood-900/30 border-blood-700' : 'bg-dark-900/60 border-dark-700 hover:border-dark-500'}`}>
                  <div className="relative">
                    <input type="checkbox" name="emergency" id="emergency-toggle"
                      checked={form.emergency} onChange={handleChange} className="sr-only" />
                    <div className={`w-10 h-6 rounded-full transition-colors ${form.emergency ? 'bg-blood-600' : 'bg-dark-600'}`}/>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.emergency ? 'translate-x-5' : 'translate-x-1'}`}/>
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${form.emergency ? 'text-blood-300' : 'text-gray-300'}`}>
                      ⚡ Mark as Emergency
                    </div>
                    <div className="text-xs text-gray-500">Emergency requests are prioritised</div>
                  </div>
                </label>

                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : '🩸 Submit Blood Request'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ─── Tab: My Requests ─── */}
        {activeTab === 'track' && (
          <div className="animate-slide-up">
            <h2 className="section-title text-lg mb-1">My Blood Requests</h2>
            <p className="section-subtitle text-sm">Track the status of your submitted requests</p>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blood-600 border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : requests.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-400">No blood requests yet. Submit your first request!</p>
                <button onClick={() => setActiveTab('request')} className="btn-primary mt-4 btn-sm">Request Blood →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map(req => (
                  <div key={req.id}>
                    <BloodRequestCard request={req} />
                    {req.status === 'PENDING' && (
                      <button onClick={() => handleFindDonors(req)}
                        className="btn-secondary btn-sm text-xs w-full mt-2">
                        🔍 Find Matching Donors
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Tab: Matched Donors ─── */}
        {activeTab === 'donors' && (
          <div className="animate-slide-up">
            {selectedReq && (
              <div className="mb-6 p-4 bg-dark-800 border border-dark-700 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blood-600/20 border border-blood-600/30 flex items-center justify-center font-bold text-blood-400">
                  {selectedReq.bloodGroup}
                </div>
                <div>
                  <div className="text-white font-semibold">Matching donors for: {selectedReq.bloodGroup} × {selectedReq.units} units</div>
                  <div className="text-gray-400 text-sm">📍 {selectedReq.city}</div>
                </div>
              </div>
            )}
            {finding ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blood-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
                  <p className="text-gray-400">Searching for donors...</p>
                </div>
              </div>
            ) : matchedDonors.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-400">
                  {selectedReq ? 'No eligible donors found in your area.' : 'Select a request to find matching donors.'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="section-title text-lg mb-0">
                    {matchedDonors.length} Matching Donor{matchedDonors.length !== 1 ? 's' : ''} Found
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedDonors.map(d => <DonorCard key={d.id} donor={d} />)}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
