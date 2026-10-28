/**
 * Editorial content for the Explore tab.
 *
 * BACKEND GAP: the Velora API exposes only `GET /api/categories` to customers. There is no
 * public endpoint for stories, moodboards, the design gallery, projects or favorites (portfolio
 * browsing is admin-only by design). Until those exist, this file is the content source; rooms
 * and the room chips come from the real categories API. `room` values match backend category
 * names so the two stay joined.
 *
 * Everything here is presented as design inspiration. It deliberately carries no prices,
 * ratings, like counts or completed-project claims, because none are backed by data.
 */
import { IMG } from './home';

export type RoomName = 'Living Room' | 'Kitchen' | 'Bedroom' | 'Bathroom' | 'Dining Room' | 'Balcony/Outdoor' | 'Office/Study';

export interface DesignItem {
  id: string;
  title: string;
  subtitle: string;
  /** Backend category name, e.g. "Living Room". */
  room: RoomName;
  image: string;
  /** Image height / width, used for the masonry layout. */
  ratio: number;
  /** Style + material tags, matched by search and filters. */
  tags: string[];
  /** Curated order, lower = earlier. */
  rank: number;
  /** Higher = newer. */
  recency: number;
  /** Short badge shown on the image, e.g. "Spa Ensuite". */
  label: string;
}

export const story = {
  id: 'story-sculpted-sanctuary',
  label: 'Curated story',
  readMinutes: 4,
  tags: ['Japandi', 'Large homes'],
  title: 'The Sculpted Sanctuary',
  description: 'How limewash, rift oak and soft layered light turn a large living space into a calm retreat.',
  byline: 'Velora design desk',
  image: IMG.livingWarm,
};

export const styleOptions = ['Japandi', 'Contemporary', 'Warm Minimal', 'Biophilic', 'Classic'] as const;

export const materialGroups = ['Wood', 'Countertops', 'Walls', 'Paint', 'Tile & Stone', 'Metal', 'Fabric'] as const;
export type MaterialGroup = (typeof materialGroups)[number];

export interface Material {
  id: string;
  name: string;
  /** Group shown as a tab in the Materials section. */
  group: MaterialGroup;
  color: string;
}

export const materials: Material[] = [
  { id: 'rift-oak', name: 'Rift Oak', group: 'Wood', color: '#D9A47A' },
  { id: 'smoked-walnut', name: 'Smoked Walnut', group: 'Wood', color: '#6B3A22' },
  { id: 'teak', name: 'Teak', group: 'Wood', color: '#B07A45' },
  { id: 'calacatta', name: 'Calacatta', group: 'Countertops', color: '#E6E0D6' },
  { id: 'black-granite', name: 'Black Granite', group: 'Countertops', color: '#2E3033' },
  { id: 'terrazzo', name: 'Terrazzo', group: 'Countertops', color: '#CFC4B4' },
  { id: 'limewash', name: 'Limewash', group: 'Walls', color: '#D8D2C6' },
  { id: 'fluted-panel', name: 'Fluted Panel', group: 'Walls', color: '#C8B9A0' },
  { id: 'sage-plaster', name: 'Sage Plaster', group: 'Walls', color: '#A9B8A0' },
  { id: 'warm-ivory', name: 'Warm Ivory', group: 'Paint', color: '#F1E9DA' },
  { id: 'forest-green', name: 'Forest Green', group: 'Paint', color: '#2F5D46' },
  { id: 'terracotta', name: 'Terracotta', group: 'Paint', color: '#C26A4A' },
  { id: 'travertine', name: 'Travertine', group: 'Tile & Stone', color: '#DCCFB8' },
  { id: 'slate', name: 'Slate', group: 'Tile & Stone', color: '#3C4650' },
  { id: 'zellige', name: 'Zellige', group: 'Tile & Stone', color: '#7FA39B' },
  { id: 'brass', name: 'Brass', group: 'Metal', color: '#C9A24B' },
  { id: 'matte-black', name: 'Matte Black', group: 'Metal', color: '#1F2122' },
  { id: 'brushed-steel', name: 'Brushed Steel', group: 'Metal', color: '#A8ADB0' },
  { id: 'boucle', name: 'Bouclé', group: 'Fabric', color: '#EFE8DB' },
  { id: 'linen', name: 'Linen', group: 'Fabric', color: '#D6C9B1' },
  { id: 'velvet', name: 'Velvet', group: 'Fabric', color: '#4C6B5A' },
];

export interface Moodboard {
  id: string;
  title: string;
  blurb: string;
  /** Key materials, shown as a single line on the card. */
  materials: string;
  image: string;
  room: RoomName;
  tags: string[];
}

export const moodboards: Moodboard[] = [
  { id: 'mb-warm-minimal', title: 'Warm Minimal Living', blurb: 'Bouclé seating, limewash walls and arched glazing.', materials: 'Limewash · Bouclé · Rift Oak', image: IMG.living, room: 'Living Room', tags: ['Warm Minimal', 'Limewash', 'Rift Oak', 'Bouclé'] },
  { id: 'mb-marble-kitchen', title: 'Marble & Walnut Kitchen', blurb: 'Calacatta island with brass pulls and smoked walnut.', materials: 'Calacatta · Brass · Smoked Walnut', image: IMG.kitchen, room: 'Kitchen', tags: ['Contemporary', 'Calacatta', 'Brass', 'Smoked Walnut'] },
  { id: 'mb-quiet-suite', title: 'Quiet Luxury Suite', blurb: 'Layered neutrals, fluted headboard, soft ambient light.', materials: 'Fluted Panel · Linen · Rift Oak', image: IMG.bedroom, room: 'Bedroom', tags: ['Japandi', 'Fluted Panel', 'Rift Oak', 'Linen'] },
  { id: 'mb-terrace', title: 'Biophilic Terrace', blurb: 'Planters, teak decking and warm pendant lighting.', materials: 'Teak · Terracotta · Brass', image: IMG.lounge, room: 'Balcony/Outdoor', tags: ['Biophilic', 'Teak', 'Terracotta', 'Brass'] },
  { id: 'mb-spa-bath', title: 'Travertine Spa Bath', blurb: 'Honed stone, matte black fittings and a rain shower.', materials: 'Travertine · Matte Black', image: IMG.bathroom, room: 'Bathroom', tags: ['Contemporary', 'Travertine', 'Matte Black'] },
  { id: 'mb-heritage-dining', title: 'Heritage Dining Room', blurb: 'Dark timber, brass lighting and velvet-upholstered chairs.', materials: 'Smoked Walnut · Velvet · Brass', image: IMG.lounge2, room: 'Dining Room', tags: ['Classic', 'Smoked Walnut', 'Velvet', 'Brass'] },
  { id: 'mb-green-study', title: 'Forest Green Study', blurb: 'Deep green paint, teak shelving and a linen reading chair.', materials: 'Forest Green · Teak · Linen', image: IMG.livingModern, room: 'Office/Study', tags: ['Classic', 'Forest Green', 'Teak', 'Linen'] },
];

const d = (
  id: string,
  rank: number,
  title: string,
  subtitle: string,
  room: RoomName,
  label: string,
  image: string,
  ratio: number,
  tags: string[],
): DesignItem => ({ id, rank, recency: 100 - rank, title, subtitle, room, label, image, ratio, tags });

export const galleryItems: DesignItem[] = [
  d('g1', 1, 'Calm Bouclé Lounge', 'Warm Minimal', 'Living Room', 'Living Room', IMG.living, 1.25, ['Warm Minimal', 'Limewash', 'Bouclé']),
  d('g2', 2, 'Marble Island & Brass', 'Contemporary', 'Kitchen', 'Kitchen', IMG.kitchen, 1.5, ['Contemporary', 'Calacatta', 'Brass']),
  d('g3', 3, 'Spa Ensuite with Travertine', 'Contemporary', 'Bathroom', 'Spa Ensuite', IMG.bathroom, 1.35, ['Contemporary', 'Travertine', 'Matte Black']),
  d('g4', 4, 'Fluted Oak Study Nook', 'Japandi', 'Office/Study', 'Work Nook', IMG.livingModern, 1.15, ['Japandi', 'Rift Oak', 'Fluted Panel']),
  d('g5', 5, 'Terracotta Sunroom', 'Biophilic', 'Balcony/Outdoor', 'Terrace', IMG.lounge, 1.45, ['Biophilic', 'Terracotta', 'Teak']),
  d('g6', 6, 'Japandi Master Suite', 'Japandi', 'Bedroom', 'Master Suite', IMG.bedroomSoft, 1.3, ['Japandi', 'Rift Oak', 'Linen']),
  d('g7', 7, 'Walnut Dining Hall', 'Classic', 'Dining Room', 'Dining', IMG.lounge2, 1.2, ['Classic', 'Smoked Walnut', 'Brass']),
  d('g8', 8, 'Sage Plaster Living', 'Biophilic', 'Living Room', 'Living Room', IMG.livingWarm, 1.4, ['Biophilic', 'Sage Plaster', 'Linen']),
  d('g9', 9, 'Handleless Kitchen Run', 'Contemporary', 'Kitchen', 'Kitchen', IMG.kitchenDining, 1.25, ['Contemporary', 'Rift Oak', 'Brushed Steel']),
  d('g10', 10, 'Slate & Gold Powder Room', 'Classic', 'Bathroom', 'Powder Room', IMG.bathroom, 1.5, ['Classic', 'Slate', 'Brass']),
  d('g11', 11, 'Reading Loft Bedroom', 'Warm Minimal', 'Bedroom', 'Bedroom', IMG.bedroom, 1.2, ['Warm Minimal', 'Rift Oak', 'Linen']),
  d('g12', 12, 'Courtyard Study', 'Biophilic', 'Office/Study', 'Study', IMG.villa, 1.35, ['Biophilic', 'Smoked Walnut', 'Teak']),
  d('g13', 13, 'Terrazzo Breakfast Counter', 'Warm Minimal', 'Kitchen', 'Compact Kitchen', IMG.kitchenDining, 1.4, ['Warm Minimal', 'Terrazzo', 'Brushed Steel']),
  d('g14', 14, 'Velvet Corner Sofa', 'Classic', 'Living Room', 'Furniture', IMG.livingModern, 1.3, ['Classic', 'Velvet', 'Brass']),
  d('g15', 15, 'Zellige Wash Basin', 'Contemporary', 'Bathroom', 'Finishes', IMG.bathroom, 1.2, ['Contemporary', 'Zellige', 'Brass']),
  d('g16', 16, 'Pendant-Lit Dining Nook', 'Japandi', 'Dining Room', 'Lighting', IMG.lounge2, 1.45, ['Japandi', 'Rift Oak', 'Matte Black']),
  d('g17', 17, 'Forest Green Feature Wall', 'Classic', 'Living Room', 'Paint', IMG.living, 1.5, ['Classic', 'Forest Green', 'Brass']),
  d('g18', 18, 'Teak Deck Balcony', 'Biophilic', 'Balcony/Outdoor', 'Balcony', IMG.lounge, 1.25, ['Biophilic', 'Teak', 'Matte Black']),
  d('g19', 19, 'Fluted Headboard Wall', 'Japandi', 'Bedroom', 'Wall Detail', IMG.bedroomSoft, 1.4, ['Japandi', 'Fluted Panel', 'Linen']),
  d('g20', 20, 'Black Granite Galley', 'Contemporary', 'Kitchen', 'Kitchen', IMG.kitchen, 1.2, ['Contemporary', 'Black Granite', 'Matte Black']),
  d('g21', 21, 'Limewash Hallway Console', 'Warm Minimal', 'Living Room', 'Entry', IMG.livingWarm, 1.3, ['Warm Minimal', 'Limewash', 'Rift Oak']),
  d('g22', 22, 'Linen & Walnut Bedroom', 'Classic', 'Bedroom', 'Bedroom', IMG.bedroom, 1.35, ['Classic', 'Smoked Walnut', 'Linen']),
  d('g23', 23, 'Terracotta Dining Corner', 'Biophilic', 'Dining Room', 'Dining', IMG.kitchenDining, 1.15, ['Biophilic', 'Terracotta', 'Teak']),
  d('g24', 24, 'Warm Ivory Home Office', 'Warm Minimal', 'Office/Study', 'Work Nook', IMG.villa, 1.25, ['Warm Minimal', 'Warm Ivory', 'Rift Oak']),
];

export const spaceFilters = ['All', '1BHK', '2BHK', 'Studio'] as const;
export type SpaceFilter = (typeof spaceFilters)[number];

export interface Makeover {
  id: string;
  /** Property configuration this idea suits. */
  space: Exclude<SpaceFilter, 'All'>;
  /** What the idea optimises, e.g. "Storage". */
  focus: string;
  title: string;
  detail: string;
  image: string;
}

export const makeovers: Makeover[] = [
  { id: 'mk-wall-unit', space: '1BHK', focus: 'Storage', title: 'Multi-Wall Unit', detail: 'TV, shelving and a fold-out desk in one wall.', image: IMG.livingModern },
  { id: 'mk-hidden-kitchen', space: '2BHK', focus: 'Kitchen', title: 'Concealed Storage Kitchen', detail: 'Tall units and a pull-out pantry keep counters clear.', image: IMG.kitchenDining },
  { id: 'mk-pocket-bath', space: 'Studio', focus: 'Bathroom', title: 'Pocket Ensuite', detail: 'Wet and dry zones split with a glass partition.', image: IMG.bathroom },
  { id: 'mk-bed-storage', space: '1BHK', focus: 'Bedroom', title: 'Storage Bed Layout', detail: 'Hydraulic bed base and a slim wardrobe wall.', image: IMG.bedroomSoft },
  { id: 'mk-partition', space: 'Studio', focus: 'Partition', title: 'Fluted Room Divider', detail: 'Separates sleeping and living without losing light.', image: IMG.living },
  { id: 'mk-balcony', space: '2BHK', focus: 'Balcony', title: 'Balcony Work Nook', detail: 'Fold-down table and planters on a narrow balcony.', image: IMG.lounge },
  { id: 'mk-compact-dining', space: '2BHK', focus: 'Dining', title: 'Fold-Out Dining', detail: 'A wall-hinged table that seats four, then disappears.', image: IMG.lounge2 },
];

export interface Transformation {
  id: string;
  title: string;
  /** Room or property type. */
  place: string;
  detail: string;
  image: string;
}

/** Inspiration only: not tied to a delivered project, so no budgets, timelines or outcomes. */
export const transformations: Transformation[] = [
  { id: 'transform-warm-elegance', title: 'From Bare Shell to Warm Elegance', place: '3BHK apartment', detail: 'A full-home idea built on limewash, oak joinery and layered lighting.', image: IMG.livingWarm },
  { id: 'transform-compact-kitchen', title: 'A Compact Kitchen Reimagined', place: 'Modular kitchen', detail: 'L-shaped layout with tall storage and an integrated breakfast counter.', image: IMG.kitchen },
  { id: 'transform-balcony', title: 'Balcony to Green Retreat', place: 'Balcony', detail: 'Teak decking, planters and warm pendant light.', image: IMG.lounge },
];

export const GALLERY_PAGE_SIZE = 8;

/** Lookup for the shared detail screen. */
export interface DetailEntry {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  tags: string[];
}

export function findDetail(id: string): DetailEntry | undefined {
  if (id === story.id) return { id, title: story.title, subtitle: story.description, image: story.image, tags: story.tags };
  const t = transformations.find((x) => x.id === id);
  if (t) return { id, title: t.title, subtitle: t.detail, image: t.image, tags: [t.place, 'Design inspiration'] };
  const g = galleryItems.find((x) => x.id === id);
  if (g) return { id, title: g.title, subtitle: g.subtitle, image: g.image, tags: [g.room, ...g.tags] };
  const m = moodboards.find((x) => x.id === id);
  if (m) return { id, title: m.title, subtitle: `${m.blurb} ${m.materials}`, image: m.image, tags: [m.room, ...m.tags] };
  const k = makeovers.find((x) => x.id === id);
  if (k) return { id, title: k.title, subtitle: k.detail, image: k.image, tags: [k.space, k.focus] };
  return undefined;
}
