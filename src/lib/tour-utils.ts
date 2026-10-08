export function formatStatusLabel(status: string) {
  const labels: Record<string, string> = {
    visited: 'Visited',
    planned: 'Planned',
    cancelled: 'Cancelled',
    'one-day': 'One Day',
    never: 'Never Planned',
  }

  return labels[status] ?? 'Unknown'
}
