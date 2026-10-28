import { useMemo, useState } from 'react';
import { IMG } from '@/content/home';
import { ALL_SERVICES, OTHER_GROUP, RENOVATION_GROUP, defaultServiceIcon, fullHome, heroPromos, serviceGroups, serviceMeta, type HeroPromo, type IconName } from '@/content/services';
import type { Category } from '@/types/api';

export interface ServiceItem {
  id: number;
  name: string;
  description: string;
  icon: IconName;
  group: string;
  keywords: string[];
  image: string;
  blurb: string;
}

export type ResolvedPromo = HeroPromo & { serviceId?: number };

function toService(c: Category): ServiceItem {
  const meta = serviceMeta[c.name.toLowerCase()];
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? '',
    icon: meta?.icon ?? defaultServiceIcon,
    group: meta?.group ?? OTHER_GROUP,
    keywords: meta?.keywords ?? [],
    image: c.imageUrl ?? meta?.image ?? IMG.shell,
    blurb: meta?.blurb ?? c.description ?? '',
  };
}

const matches = (query: string, fields: string[]) => {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hay = fields.join(' ').toLowerCase();
  return terms.every((t) => hay.includes(t));
};

/** Search + group filtering over the individual services returned by the categories API. */
export function useServices(categories: Category[] | null) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState(ALL_SERVICES);

  const services = useMemo(
    () => (categories ?? []).filter((c) => c.serviceGroup === 'INDIVIDUAL_SERVICE').map(toService),
    [categories],
  );

  /** Only groups that actually contain a service, so no chip leads to an empty list. */
  const groups = useMemo(() => {
    const present = new Set(services.map((s) => s.group));
    return [ALL_SERVICES, RENOVATION_GROUP, ...[...serviceGroups, OTHER_GROUP].filter((g) => present.has(g))];
  }, [services]);

  const visible = useMemo(
    () =>
      group === RENOVATION_GROUP
        ? []
        : services.filter(
            (s) => (group === ALL_SERVICES || s.group === group) && (!query.trim() || matches(query, [s.name, s.description, s.group, ...s.keywords])),
          ),
    [services, group, query],
  );

  const showFeatured =
    (group === ALL_SERVICES || group === RENOVATION_GROUP) && (!query.trim() || matches(query, [fullHome.name, fullHome.tagline, ...fullHome.keywords]));

  /** Hero promos whose target exists in the live catalogue. */
  const promos = useMemo<ResolvedPromo[]>(
    () =>
      heroPromos.flatMap((p) => {
        if (p.target.kind === 'home') return [p];
        if (p.target.kind === 'group') return groups.includes(p.target.group) ? [p] : [];
        const name = p.target.name;
        const hit = services.find((x) => x.name.toLowerCase() === name);
        return hit ? [{ ...p, serviceId: hit.id }] : [];
      }),
    [services, groups],
  );

  const reset = () => {
    setQuery('');
    setGroup(ALL_SERVICES);
  };

  return { query, setQuery, group, setGroup, groups, services, promos, visible, total: services.length, showFeatured, reset };
}
