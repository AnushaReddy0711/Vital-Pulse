export default function StatusBadge({ status, emergency }) {
  if (emergency) {
    return (
      <span className="badge-emergency">
        ⚡ Emergency
      </span>
    );
  }
  const map = {
    PENDING:   <span className="badge-pending">  ● Pending   </span>,
    APPROVED:  <span className="badge-approved"> ✓ Approved  </span>,
    COMPLETED: <span className="badge-completed">✓ Completed </span>,
    REJECTED:  <span className="badge-rejected"> ✕ Rejected  </span>,
  };
  return map[status] ?? <span className="badge-pending">{status}</span>;
}
