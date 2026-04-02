const LOW_THRESHOLD = 10;

const bloodGroupColor = {
  'A+':  'text-red-400',   'A-':  'text-rose-400',
  'B+':  'text-orange-400','B-':  'text-amber-400',
  'O+':  'text-blood-400', 'O-':  'text-pink-400',
  'AB+': 'text-purple-400','AB-': 'text-violet-400',
};

export default function InventoryTable({ items, onUpdate, onDelete }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Blood Group</th>
            <th>Hospital</th>
            <th>Units Available</th>
            <th>Status</th>
            {(onUpdate || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-500">No inventory records found.</td>
            </tr>
          )}
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <span className={`font-bold text-base ${bloodGroupColor[item.bloodGroup] || 'text-blood-400'}`}>
                  {item.bloodGroup}
                </span>
              </td>
              <td className="text-gray-300">{item.hospitalName}</td>
              <td>
                <span className={`font-semibold ${item.unitsAvailable < LOW_THRESHOLD ? 'text-blood-400' : 'text-emerald-400'}`}>
                  {item.unitsAvailable}
                </span>
                <span className="text-gray-500 text-xs ml-1">units</span>
              </td>
              <td>
                {item.unitsAvailable === 0
                  ? <span className="badge-rejected">Out of Stock</span>
                  : item.unitsAvailable < LOW_THRESHOLD
                    ? <span className="badge-pending">Low Stock</span>
                    : <span className="badge-completed">Available</span>
                }
              </td>
              {(onUpdate || onDelete) && (
                <td>
                  <div className="flex gap-2">
                    {onUpdate && (
                      <button
                        onClick={() => onUpdate(item)}
                        className="btn-secondary btn-sm text-xs">
                        ✏️ Update
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="btn-danger btn-sm text-xs">
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
