/** Guides verified more than 6 months ago show "We're re-checking this guide" (HANDOFF §7.8). */
export function isOutdated(lastVerified: string, now = new Date()): boolean {
  const d = new Date(lastVerified);
  if (Number.isNaN(d.getTime())) return false;
  const six = new Date(now);
  six.setMonth(six.getMonth() - 6);
  return d < six;
}
