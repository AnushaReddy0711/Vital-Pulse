import StatusBadge from './StatusBadge';

export default function BloodRequestCard({ request }) {
  const priorityBorder = request.emergency
    ? 'border-l-blood-500 animate-pulse-slow'
    : 'border-l-dark-600';

  return (
    <div className={`card border-l-4 ${priorityBorder} animate-slide-up`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blood-600/20 border border-blood-600/30 flex items-center justify-center">
            <span className="text-blood-400 font-black text-sm">{request.bloodGroup}</span>
          </div>
          <div>
            <div className="font-bold text-white text-base">
              {request.bloodGroup} &nbsp;
              <span className="text-gray-400 font-normal text-sm">× {request.units} units</span>
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
              <span>📍</span>{request.city}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={request.status} />
          {request.emergency && <StatusBadge emergency />}
        </div>
      </div>

      {request.notes && (
        <div className="mt-3 p-2.5 bg-dark-900/60 rounded-lg text-sm text-gray-400 border border-dark-700">
          💬 {request.notes}
        </div>
      )}

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-dark-700">
        <div className="text-xs text-gray-500">
          Requested by: <span className="text-gray-400">{request.patient?.name}</span>
        </div>
        {request.createdAt && (
          <div className="text-xs text-gray-600">
            {new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
}
