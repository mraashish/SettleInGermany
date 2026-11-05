import { usePrefs } from '@/store/prefs';
import { useCities } from './client';
import { citySlug, GERMAN_CITIES } from './germanCities';

/**
 * The user's city: profile.city holds a slug (e.g. "leipzig"). Returns its display name
 * and the city page from the content database, if there is one.
 */
export function useMyCity() {
  const slug = usePrefs((s) => s.profile.city);
  const typed = usePrefs((s) => s.profile.cityName);
  const { data: cities = [] } = useCities();
  if (!slug || slug === 'undecided') return { slug: null, name: '', page: undefined };
  const page = cities.find((c) => c.slug === slug && (c.facts.length || c.appointments.length));
  const name = page?.name ?? cities.find((c) => c.slug === slug)?.name ?? GERMAN_CITIES.find((c) => citySlug(c) === slug) ?? typed ?? slug;
  return { slug, name, page };
}
