export function getDateFromTimestamp(
  timestamp: any,
  dateStyle: 'short' | 'full' | 'long' | 'medium',
  timeStyle: 'short' | 'full' | 'long' | 'medium',
) {
  if (!timestamp) return
  const date = new Date(parseFloat(timestamp))
  return Intl.DateTimeFormat('pt-BR', {
    dateStyle,
    timeStyle,
  }).format(date)
}
