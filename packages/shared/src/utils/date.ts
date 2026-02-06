export function formatDate(dateStr: string, locale: string = 'tr'): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateStr: string, locale: string = 'tr'): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (locale === 'tr') {
    if (diffDays === 0) return 'Bugun';
    if (diffDays === 1) return 'Yarin';
    if (diffDays === -1) return 'Dun';
    if (diffDays > 0) return `${diffDays} gun sonra`;
    return `${Math.abs(diffDays)} gun once`;
  }

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

export function isUpcoming(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}
