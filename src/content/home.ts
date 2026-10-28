/**
 * Editorial content for the Home screen.
 *
 * The Velora backend has no CMS / home-feed endpoint yet (portfolio browsing is
 * admin-only by design), so marketing copy lives here. Everything transactional -
 * categories, auth, bookings - comes from the real API.
 *
 * Images: each `image` is either a full URL or a Cloudinary public ID. Replace the
 * placeholder photo URLs with Cloudinary public IDs once the assets are uploaded;
 * `optimizedImage()` handles both.
 */
const photo = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const IMG = {
  living: photo('1618221195710-dd6b41faaea6'),
  livingWarm: photo('1600607687939-ce8a6c25118c'),
  livingModern: photo('1600585154340-be6161a56a0c'),
  villa: photo('1600210492486-724fe5c67fb0'),
  kitchen: photo('1556909114-f6e7ad7d3136'),
  kitchenDining: photo('1615529182904-14819c35db37'),
  bedroom: photo('1616594039964-ae9021a400a0'),
  bedroomSoft: photo('1505691938895-1758d7feb511'),
  bathroom: photo('1584622650111-993a426fbf0a'),
  lounge: photo('1493663284031-b7e3aefcae8e'),
  lounge2: photo('1484101403633-562f891dc89a'),
  shell: photo('1503387762-592deb58ef4e'),
} as const;

export const offer = {
  eyebrow: 'Only today • Limited slots',
  title: 'Free 3D Spatial Audit with Senior Architect',
  /** Seconds remaining on the countdown shown in the banner. */
  countdownSeconds: 3 * 3600 + 32 * 60 + 31,
};

export const heroSlides = [
  {
    id: 'spring',
    tag: 'Fast-track turnkey',
    eyebrow: 'Spring refresh edit',
    title: 'Your dream living space, crafted in 21 days.',
    image: IMG.living,
  },
  {
    id: 'kitchen',
    tag: 'Modular kitchens',
    eyebrow: 'Bestseller edit',
    title: 'Kitchens built around how you cook.',
    image: IMG.kitchen,
  },
  {
    id: 'bedroom',
    tag: 'Primary suites',
    eyebrow: 'Quiet luxury edit',
    title: 'Bedrooms that feel like a retreat.',
    image: IMG.bedroom,
  },
];

export const heroStats = { rating: '4.9', homesDelivered: 142 };

/** Fallback artwork for room categories that have no imageUrl in the database. */
export const roomFallbackImages: Record<string, string> = {
  'living room': IMG.living,
  bedroom: IMG.bedroom,
  kitchen: IMG.kitchen,
  bathroom: IMG.bathroom,
  'office/study': IMG.livingModern,
  'dining room': IMG.lounge2,
  'balcony/outdoor': IMG.lounge,
};
export const roomFallbackImage = IMG.livingWarm;

/** Optional marketing flourish per service category (keyed by lower-cased name). */
export const serviceFlair: Record<string, { subtitle: string; icon: string; badge?: string }> = {
  painting: { subtitle: 'Limewash & more', icon: 'edit-3' },
  plumbing: { subtitle: 'Fixtures & lines', icon: 'droplet' },
  electrical: { subtitle: 'Wiring & lighting', icon: 'zap' },
  carpentry: { subtitle: 'Joinery', icon: 'tool' },
  'false ceiling': { subtitle: 'Architectural', icon: 'layers' },
  'modular kitchen': { subtitle: 'Installation', icon: 'grid' },
};
export const defaultServiceIcon = 'tool';

export const beforeAfter = {
  eyebrow: 'Before • After spotlight',
  title: '3BHK Jubilee Hills Transformation',
  before: IMG.shell,
  after: IMG.villa,
  turnaround: '28 Days',
  budget: '₹18.4 Lakhs',
};

export const styleCards = [
  { id: 'japandi', title: 'Japandi Serenity', materials: 'Warm cedar · Limewash · Minimal', price: 'Est. ₹1,450 / sq.ft', badge: '98% Match', image: IMG.bedroom },
  { id: 'contemporary', title: 'Contemporary Luxe', materials: 'Italian Statuario · Brushed brass', price: 'Est. ₹2,100 / sq.ft', badge: 'Trending', image: IMG.lounge2 },
  { id: 'warm-minimal', title: 'Warm Minimalism', materials: 'Oak veneer · Fluted panels', price: 'Est. ₹1,750 / sq.ft', badge: 'New', image: IMG.livingWarm },
];

export const featuredGuide = {
  tag: 'Featured guide',
  title: 'Small Home, Big Ideas',
  body: 'Smart multi-functional joinery, hidden pantries & foldaway work nooks for urban living.',
  plans: 18,
  image: IMG.kitchenDining,
};

export const ideaCards = [
  { id: 'budget', icon: 'briefcase', tint: '#DCE9DA', title: 'Budget-Friendly Makeovers', body: 'High-impact aesthetic refreshes under ₹3.5 Lakhs.', count: 34 },
  { id: 'rental', icon: 'key', tint: '#CFEBDD', title: 'Rental-Friendly Upgrades', body: 'Zero-damage surface upgrades & modular movable joinery.', count: 22 },
  { id: 'luxury', icon: 'award', tint: '#FFD9CC', title: 'Luxury on a Budget', body: 'Layered ambient lighting, fluted trim & architectural paint.', count: 41 },
  { id: 'indian', icon: 'home', tint: '#DCE9DA', title: 'Modern Indian Homes', body: 'Thoughtful integration of pooja alcoves, vastu flows & balcony gardens.', count: 29 },
] as const;

export const featuredProjects = [
  { id: 'p1', tag: 'Living & Balcony', title: 'The Serene Japandi Flat', price: '₹14.2 L', where: 'Kokapet Penthouse • 3 BHK', days: 24, image: IMG.living },
  { id: 'p2', tag: 'Full Turnkey', title: 'Warm Minimalist Villa', price: '₹28.5 L', where: 'Jubilee Hills • 4 BHK', days: 35, image: IMG.livingWarm },
  { id: 'p3', tag: 'Terrace Lounge', title: 'Biophilic Balcony Haven', price: '₹4.8 L', where: 'Gachibowli High-rise • Terrace Lounge', days: 12, image: IMG.lounge },
];

export const howItWorks = [
  { n: 1, title: 'Discover', body: 'Explore curated room styles, materials, and real project estimates upfront.' },
  { n: 2, title: 'Choose', body: 'Select turnkey renovation packages or specialized individual services.' },
  { n: 3, title: 'Plan Your Space', body: 'Submit your floorplan and collaborate through protected milestone escrow.' },
];

export const warranty = {
  title: 'Velora 10-Year Warranty',
  body: 'Materials inspected & RBI-regulated escrow milestone protection',
};

export const cta = {
  eyebrow: 'Begin with confidence',
  title: 'Ready to Transform Your Home?',
  body: 'Start with a complimentary 3D spatial consultation and verified escrow protection.',
};
