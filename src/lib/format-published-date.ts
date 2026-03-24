/**
 * Safe locale date for CMS publish fields. Avoids `new Date(null)` → Jan 1, 1970.
 */
export function formatPublishedDate(
  dateStr: string | null | undefined,
  options: Intl.DateTimeFormatOptions,
): string {
  if (dateStr == null || dateStr === '') return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, options)
}

export const publishedDateFormatShort: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

export const publishedDateFormatLong: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}
