import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getInventoryByHospital, addInventory, updateInventory, deleteInventory, getLowStock
} from '../services/inventoryService';
import { getAllRequests, updateStatus } from '../services/requestService';
import InventoryTable from '../components/InventoryTable';
import AlertBanner    from '../components/AlertBanner';
import StatusBadge    from '../components/StatusBadge';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

export default function HospitalDashboard() {
  const { currentUser }                 = useAuth();
  const [inventory, setInventory]       = useState([]);
  const [requests, setRequests]         = useState([]);
  const [lowStock, setLowStock]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('inventory');
  const [addForm, setAddForm]           = useState({ bloodGroup:'', unitsAvailable:0 });
  const [editItem, setEditItem]         = useState(null);
  const [editUnits, setEditUnits]       = useState(0);
  const [saving, setSaving]             = useState(false);

  useEffect(() => {
    Promise.all([fetchInventory(), fetchRequests(), fetchLowStock()])
      .finally(() => setLoading(false));
  }, []);

  const fetchInventory = async () => {
    const res = await getInventoryByHospital(currentUser.id);
    setInventory(res.data);
  };

  const fetchRequests = async () => {
    const res = await getAllRequests();
    setRequests(res.data);
  };

  const fetchLowStock = async () => {
    try {
      const res = await getLowStock(10);
      setLowStock(res.data.filter(i => i.hospitalUser?.id === currentUser.id));
    } catch {}
  };

  const handleAddInventory = async e => {
    e.preventDefault();
    if (!addForm.bloodGroup) { toast.error('Select a blood group'); return; }
    setSaving(true);
    try {
      await addInventory({
        ...addForm,
        hospitalName: currentUser.name,
        hospitalUserId: currentUser.id,
        unitsAvailable: Number(addForm.unitsAvailable),
      });
      toast.success(`✅ ${addForm.bloodGroup} stock added`);
      setAddForm({ bloodGroup:'', unitsAvailable: 0 });
      await fetchInventory();
      await fetchLowStock();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add inventory');
    } finally { setSaving(false); }
  };

  const handleUpdate = (item) => {
    setEditItem(item);
    setEditUnits(item.unitsAvailable);
  };

  const saveUpdate = async () => {
    setSaving(true);
    try {
      await updateInventory(editItem.id, Number(editUnits));
      toast.success('Inventory updated');
      setEditItem(null);
      await fetchInventory();
      await fetchLowStock();
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this inventory entry?')) return;
    try {
      await deleteInventory(id);
      toast.success('Entry removed');
      await fetchInventory();
      await fetchLowStock();
    } catch { toast.error('Delete failed'); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      // Pass hospitalUserId only for APPROVED/COMPLETED statuses to trigger deduction
      const hospitalId = (status === 'APPROVED' || status === 'COMPLETED') ? currentUser.id : null;
      await updateStatus(id, status, hospitalId);
      
      toast.success(status === 'COMPLETED' || status === 'APPROVED' 
        ? '✅ Request Fulfilled & Stock Updated' 
        : `Request ${status.toLowerCase()}`);
      
      // Refresh both to show updated inventory and request state
      await fetchRequests();
      await fetchInventory();
      await fetchLowStock();
    } catch (err) {
      const msg = err.response?.data?.error || 'Status update failed';
      toast.error(msg);
      if (msg.includes('stock')) {
        toast('Insufficient Blood Units!', { icon: '🚨', duration: 4000 });
      }
    }
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  const tabs = [
    { id: 'inventory', label: `🏦 Blood Inventory (${inventory.length})` },
    { id: 'requests',  label: `📋 All Requests (${pendingCount} pending)` },
  ];

  if (loading) return (
    <div className="page-container flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="content-area">

        {/* Header */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center text-xl">🏦</div>
            <div>
              <h1 className="section-title mb-0">Hospital Dashboard</h1>
              <p className="text-gray-400 text-sm">
                <span className="text-white font-semibold">{currentUser.name}</span> — {currentUser.city}
              </p>
            </div>
          </div>
        </div>

        {/* Low stock alerts */}
        <AlertBanner alerts={lowStock} />

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-dark-800 border border-dark-700 rounded-2xl w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Inventory Tab ─── */}
        {activeTab === 'inventory' && (
          <div className="animate-slide-up flex flex-col gap-6">

            {/* Add Stock Form */}
            <div className="card">
              <h2 className="font-bold text-white mb-4">Add / Update Blood Stock</h2>
              <form onSubmit={handleAddInventory} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="label">Blood Group</label>
                  <select className="input" value={addForm.bloodGroup}
                    onChange={e => setAddForm(p => ({ ...p, bloodGroup: e.target.value }))}>
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="w-36">
                  <label className="label">Units</label>
                  <input type="number" min="0" className="input"
                    value={addForm.unitsAvailable}
                    onChange={e => setAddForm(p => ({ ...p, unitsAvailable: e.target.value }))} />
                </div>
                <button type="submit" disabled={saving} className="btn-success shrink-0">
                  {saving ? 'Adding...' : '+ Add Stock'}
                </button>
              </form>
            </div>

            {/* Update Modal */}
            {editItem && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="card w-full max-w-sm animate-slide-up">
                  <h3 className="font-bold text-white mb-4">
                    Update {editItem.bloodGroup} Stock
                  </h3>
                  <label className="label">New Unit Count</label>
                  <input type="number" min="0" className="input mb-4"
                    value={editUnits} onChange={e => setEditUnits(e.target.value)} />
                  <div className="flex gap-3">
                    <button onClick={saveUpdate} disabled={saving} className="btn-success flex-1">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditItem(null)} className="btn-secondary flex-1">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Table */}
            <InventoryTable items={inventory} onUpdate={handleUpdate} onDelete={handleDelete} />
          </div>
        )}

        {/* ─── Requests Tab ─── */}
        {activeTab === 'requests' && (
          <div className="animate-slide-up">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Patient</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 && (
                    <tr><td colSpan="7" className="text-center py-8 text-gray-500">No requests found.</td></tr>
                  )}
                  {requests.map(req => (
                    <tr key={req.id}>
                      <td><span className="font-bold text-blood-400">{req.bloodGroup}</span></td>
                      <td className="text-gray-300">{req.units} units</td>
                      <td className="text-gray-300">{req.patient?.name}</td>
                      <td className="text-gray-300">{req.city}</td>
                      <td><StatusBadge status={req.status} /></td>
                      <td>{req.emergency && <StatusBadge emergency />}</td>
                      <td>
                        <div className="flex gap-2 flex-wrap">
                          {req.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleStatusUpdate(req.id, 'APPROVED')}
                                className="btn-success btn-sm text-xs">✓ Approve</button>
                              <button onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                                className="btn-danger btn-sm text-xs">✕ Reject</button>
                            </>
                          )}
                          {req.status === 'APPROVED' && (
                            <button onClick={() => handleStatusUpdate(req.id, 'COMPLETED')}
                              className="btn-success btn-sm text-xs">✓ Complete</button>
                          )}
                          {(req.status === 'COMPLETED' || req.status === 'REJECTED') && (
                            <span className="text-gray-600 text-xs italic">No actions</span>
                          )}
                        </div>
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
