const bloodGroupGradient = {
  'A+':  'from-red-500    to-red-700',
  'A-':  'from-rose-500   to-rose-700',
  'B+':  'from-orange-500 to-orange-700',
  'B-':  'from-amber-500  to-amber-700',
  'O+':  'from-blood-500  to-blood-700',
  'O-':  'from-pink-500   to-pink-700',
  'AB+': 'from-purple-500 to-purple-700',
  'AB-': 'from-violet-500 to-violet-700',
};

export default function DonorCard({ donor }) {
  const grad = bloodGroupGradient[donor.bloodGroup] || 'from-blood-500 to-blood-700';
  return (
    <div className="card-hover flex flex-col gap-3 animate-slide-up">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
        {donor.bloodGroup}
      </div>
      <div>
        <div className="font-semibold text-white text-base">{donor.user?.name}</div>
        <div className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
          <span>📍</span>{donor.user?.city}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{donor.user?.email}</div>
      </div>
      <div className="flex items-center gap-2">
        {donor.eligible
          ? <span className="badge-completed">✓ Eligible to Donate</span>
          : <span className="badge-rejected">✕ Not Eligible</span>
        }
      </div>
      {donor.lastDonationDate && (
        <div className="text-xs text-gray-600 border-t border-dark-700 pt-2 mt-1">
          Last donated: <span className="text-gray-400">{donor.lastDonationDate}</span>
        </div>
      )}
    </div>
  );
}
