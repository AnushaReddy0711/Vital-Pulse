export default function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-blood-900/30 border border-blood-700/50 rounded-2xl animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blood-400 text-lg">🚨</span>
        <h3 className="font-bold text-blood-300 text-sm uppercase tracking-wider">
          Low Blood Stock Alerts ({alerts.length})
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {alerts.map(item => (
          <div key={item.id}
            className="flex items-center gap-2 bg-dark-800/80 border border-blood-700/40 rounded-xl px-3 py-1.5">
            <span className="font-bold text-blood-400 text-sm">{item.bloodGroup}</span>
            <span className="text-gray-400 text-xs">at</span>
            <span className="text-gray-300 text-xs">{item.hospitalName}</span>
            <span className="badge-rejected text-xs">{item.unitsAvailable} units</span>
          </div>
        ))}
      </div>
    </div>
  );
}
