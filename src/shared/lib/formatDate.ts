const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
};

function fromExcelSerial(serial: number): Date {
  // Excel epoch is Jan 1 1900; 25569 = days between Excel epoch and Unix epoch (1970-01-01),
  // adjusted for Excel's incorrect leap year bug in 1900.
  return new Date((serial - 25569) * 86400 * 1000);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';

  const num = Number(dateStr);
  if (isFinite(num) && num > 1000 && num < 200_000) {
    return new Intl.DateTimeFormat('en-US', DATE_FORMAT).format(fromExcelSerial(num));
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', DATE_FORMAT).format(d);
}
