import { useState, useEffect } from 'react';
import { getAnalytics, getAllUsers } from '../services/adminService';
import { getAllInventory, getLowStock } from '../services/inventoryService';
import { RequestStatusChart, InventoryChart } from '../components/AnalyticsChart';
import AlertBanner from '../components/AlertBanner';
import toast from 'react-hot-toast';

const roleColor = {
  ADMIN:    'bg-purple-900/50 text-purple-300 border-purple-700',
  DONOR:    'bg-blood-900/50  text-blood-300  border-blood-700',
  PATIENT:  'bg-blue-900/50   text-blue-300   border-blue-700',
  HOSPITAL: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers]         = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    Promise.all([
      getAnalytics(),
      getAllUsers(),
      getAllInventory(),
      getLowStock(10),
    ]).then(([a, u, inv, ls]) => {
      setAnalytics(a.data);
      setUsers(u.data);
      setInventory(inv.data);
      setLowStock(ls.data);
    }).catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const statCards = analytics ? [
    { icon: '👥', label: 'Total Users',      value: analytics.totalUsers,      color: 'from-indigo-600  to-indigo-800' },
    { icon: '🩸', label: 'Donors',           value: analytics.totalDonors,     color: 'from-blood-600   to-blood-800' },
    { icon: '🏥', label: 'Patients',         value: analytics.totalPatients,   color: 'from-blue-600    to-blue-800' },
    { icon: '🏦', label: 'Hospitals',        value: analytics.totalHospitals,  color: 'from-emerald-600 to-emerald-800' },
    { icon: '📋', label: 'Total Requests',   value: analytics.totalRequests,   color: 'from-orange-600  to-orange-800' },
    { icon: '⚡', label: 'Emergency Reqs',   value: analytics.emergencyRequests,color:'from-red-700    to-red-900' },
    { icon: '✅', label: 'Eligible Donors',  value: analytics.eligibleDonors,  color: 'from-teal-600    to-teal-800' },
    { icon: '🚨', label: 'Low Stock Alerts', value: analytics.lowStockAlerts,  color: 'from-yellow-600  to-yellow-800' },
  ] : [];

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.city?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const tabs = [
    { id: 'overview',   label: '📊 Overview' },
    { id: 'users',      label: `👥 All Users (${users.length})` },
    { id: 'inventory',  label: '🏦 Inventory' },
  ];

  if (loading) return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-gray-400">Loading admin data...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="content-area">

        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-600/30 flex items-center justify-center text-xl">⚙️</div>
            <div>
              <h1 className="section-title mb-0">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">System overview and analytics</p>
            </div>
          </div>
        </div>

        {lowStock.length > 0 && <AlertBanner alerts={lowStock} />}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-dark-800 border border-dark-700 rounded-2xl w-fit flex-wrap">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-purple-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Overview Tab ─── */}
        {activeTab === 'overview' && (
          <div className="animate-slide-up flex flex-col gap-8">

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {statCards.map(s => (
                <div key={s.label} className="card flex items-center gap-4 animate-slide-up">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-lg shrink-0`}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-bold text-white mb-1">Request Status Distribution</h3>
                <p className="text-gray-500 text-xs mb-4">Breakdown of all blood requests by status</p>
                <RequestStatusChart analytics={analytics} />
              </div>
              <div className="card">
                <h3 className="font-bold text-white mb-1">Blood Inventory by Group</h3>
                <p className="text-gray-500 text-xs mb-4">Total units available across all hospitals</p>
                <InventoryChart inventoryByBloodGroup={analytics?.inventoryByBloodGroup} />
              </div>
            </div>

            {/* Request breakdown table */}
            <div className="card">
              <h3 className="font-bold text-white mb-4">Request Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label:'Pending',   value: analytics?.pendingRequests,   cls:'badge-pending' },
                  { label:'Approved',  value: analytics?.approvedRequests,  cls:'badge-approved' },
                  { label:'Completed', value: analytics?.completedRequests, cls:'badge-completed' },
                  { label:'Rejected',  value: analytics?.rejectedRequests,  cls:'badge-rejected' },
                ].map(r => (
                  <div key={r.label} className="bg-dark-900/60 border border-dark-700 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-white mb-2">{r.value ?? 0}</div>
                    <span className={r.cls}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Users Tab ─── */}
        {activeTab === 'users' && (
          <div className="animate-slide-up flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="🔍 Search by name, email, city..."
                className="input max-w-sm"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
              <span className="text-sm text-gray-500">{filteredUsers.length} results</span>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>City</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan="6" className="text-center py-8 text-gray-500">No users found.</td></tr>
                  )}
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td className="text-gray-500 text-xs">#{u.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blood-700 flex items-center justify-center text-white text-xs font-bold">
                            {u.name?.charAt(0)}
                          </div>
                          <span className="text-white font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="text-gray-400 text-xs">{u.email}</td>
                      <td>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${roleColor[u.role] || 'text-gray-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="text-gray-400">{u.city}</td>
                      <td className="text-gray-500 text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Inventory Tab ─── */}
        {activeTab === 'inventory' && (
          <div className="animate-slide-up flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
              {Object.entries(analytics?.inventoryByBloodGroup || {}).map(([bg, units]) => (
                <div key={bg} className="card text-center py-4">
                  <div className="text-2xl font-black text-blood-400">{bg}</div>
                  <div className="text-xl font-bold text-white mt-1">{units}</div>
                  <div className="text-xs text-gray-500 mt-0.5">total units</div>
                </div>
              ))}
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Blood Group</th>
                    <th>Hospital</th>
                    <th>City</th>
                    <th>Units</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td><span className="font-bold text-blood-400">{item.bloodGroup}</span></td>
                      <td className="text-gray-300">{item.hospitalName}</td>
                      <td className="text-gray-400">{item.hospitalUser?.city}</td>
                      <td className={`font-semibold ${item.unitsAvailable < 10 ? 'text-blood-400' : 'text-emerald-400'}`}>
                        {item.unitsAvailable}
                      </td>
                      <td>
                        {item.unitsAvailable === 0
                          ? <span className="badge-rejected">Out of Stock</span>
                          : item.unitsAvailable < 10
                            ? <span className="badge-pending">Low Stock</span>
                            : <span className="badge-completed">Available</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
