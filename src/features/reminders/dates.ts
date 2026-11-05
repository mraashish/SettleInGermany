/** dd.mm.yyyy (how German documents write it) or yyyy-mm-dd → ISO date, or null. */
export function parseDate(s: string): string | null {
  const de = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s.trim());
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  const parts = de ? [de[3], de[2], de[1]] : iso ? [iso[1], iso[2], iso[3]] : null;
  if (!parts) return null;
  const [y, m, d] = parts as [string, string, string];
  const date = new Date(Date.UTC(+y, +m - 1, +d));
  if (Number.isNaN(date.getTime()) || date.getUTCMonth() !== +m - 1) return null;
  return date.toISOString().slice(0, 10);
}
