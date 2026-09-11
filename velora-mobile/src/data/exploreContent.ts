import ImgModernWarmHome from '../../assets/images/ab679.png'
import ImgContemporaryLiving from '../../assets/images/90052.png'
import ImgMinimalistKitchen from '../../assets/images/94bfe.png'
import ImgSanctuaryBath from '../../assets/images/f1c0e.png'
import ImgWarmBedroom from '../../assets/images/89a8f.png'
import ImgTravertineDetails from '../../assets/images/5aa20.png'
import ImgCompleteInterior from '../../assets/images/45a7e.png'
import ImgFullHomeChoice from '../../assets/images/74adb.png'

import ImgCoffeeStyling from '../../assets/images/049f7.png'
import ImgGlassWallLiving from '../../assets/images/0a1c1.png'
import ImgMarbleIslandKitchen from '../../assets/images/32e2d.png'
import ImgGalleryWallArt from '../../assets/images/3484d.png'
import ImgTaupeKitchen from '../../assets/images/38d55.png'
import ImgSeaViewLiving from '../../assets/images/419c8.png'
import ImgLivingCorner from '../../assets/images/4bcb1.png'
import ImgFireplaceLiving from '../../assets/images/53158.png'
import ImgMinimalGreyLiving from '../../assets/images/58921.png'
import ImgPendantCluster from '../../assets/images/63616.png'
import ImgTravertineVanity from '../../assets/images/8ac9e.png'
import ImgIndustrialLoft from '../../assets/images/8c2d6.png'
import ImgGardenDoorsLiving from '../../assets/images/91553.png'
import ImgOakPanelLiving from '../../assets/images/95cf7.png'
import ImgKitchenVignette from '../../assets/images/97758.png'
import ImgOakJoinery from '../../assets/images/af52d.png'
import ImgCofferedCeiling from '../../assets/images/b9930.png'
import ImgSpaBathtub from '../../assets/images/c6b41.png'
import ImgArchDining from '../../assets/images/c9d47.png'
import ImgTwoToneKitchen from '../../assets/images/d61b0.png'

// Category images aren't seeded yet (backend field is admin-set via Cloudinary,
// still null for every category) - these keep each card visually distinct until
// then. cat.imageUrl always wins once an admin sets a real one.
export const CATEGORY_FALLBACK_IMAGES: Record<string, number> = {
  'Living Room': ImgContemporaryLiving,
  'Bedroom': ImgWarmBedroom,
  'Kitchen': ImgMinimalistKitchen,
  'Bathroom': ImgSanctuaryBath,
  'Dining Room': ImgCompleteInterior,
  'Office/Study': ImgFullHomeChoice,
  'Balcony/Outdoor': ImgTravertineDetails,
}

// Shared visual building blocks used across every Explore-adjacent screen.
export type VisualCard = {
  id: string
  title: string
  caption: string
  image: number
}

export type MaterialSwatch = {
  id: string
  label: string
  note: string
  image?: number
  color?: string
  styleLink?: string
}

export type PopularProject = {
  id: string
  title: string
  category: string
  categoryTag: string
  styleTag: string
  description: string
  longDescription: string
  highlights: VisualCard[]
  propertyType: string
  scope: string
  designDirection: string
  rooms: VisualCard[]
  materials: MaterialSwatch[]
  image: number
}

// Curated showcase data - backend BookingResponse/PortfolioItem don't carry
// this kind of editorial copy, so these stay local (same precedent as
// SERVICE_CATALOG in ServiceDetailScreen.tsx).
export const POPULAR_PROJECTS: PopularProject[] = [
  {
    id: 'p1',
    title: 'Modern Minimalist Home',
    category: 'Full Home Project',
    categoryTag: 'Full Home Project',
    styleTag: 'Modern',
    description: 'Clean lines and warm neutrals carried through every room.',
    longDescription: 'This full-home transformation leans into quiet luxury - warm neutral palettes, natural materials, and uncluttered layouts that let each room breathe. Every space, from the entryway to the primary suite, was planned around consistent lighting temperature and a single unifying material story, so the home reads as one composed whole rather than a set of separately-decorated rooms.',
    propertyType: 'Independent Villa',
    scope: 'Full Home',
    designDirection: 'Warm Minimalism',
    highlights: [
      { id: 'p1h1', title: 'One Material Story', caption: 'Oak, plaster, and travertine repeat in every room so the home reads as one composed whole.', image: ImgGardenDoorsLiving },
      { id: 'p1h2', title: 'Consistent Lighting Temperature', caption: 'Every fixture in the house was specified to the same warm color temperature, end to end.', image: ImgPendantCluster },
      { id: 'p1h3', title: 'Uncluttered Flow', caption: 'Storage-first layouts keep every surface clear for daily life, not just for photos.', image: ImgMinimalGreyLiving },
    ],
    rooms: [
      { id: 'p1r1', title: 'Living Room', caption: 'Floor-to-ceiling glazing and a walnut coffee table anchor the main living space.', image: ImgGlassWallLiving },
      { id: 'p1r2', title: 'Kitchen', caption: 'Taupe flat-front cabinetry and open shelving keep the cook space calm.', image: ImgTaupeKitchen },
      { id: 'p1r3', title: 'Bathroom', caption: 'A travertine vessel sink turns a daily routine into a small ritual.', image: ImgTravertineVanity },
    ],
    materials: [
      { id: 'p1m1', label: 'Warm White Plaster', note: 'A soft lime-wash finish that keeps walls textured, not flat.', color: '#EDE6D6' },
      { id: 'p1m2', label: 'Natural Oak', note: 'Flat-front joinery in a single timber tone, used floor to ceiling.', image: ImgOakJoinery },
      { id: 'p1m3', label: 'Honed Travertine', note: 'Warm, pitted stone kept to the one surface that needed to feel special.', image: ImgTravertineDetails },
    ],
    image: ImgModernWarmHome,
  },
  {
    id: 'p2',
    title: 'Warm Contemporary Villa',
    category: 'Living Room',
    categoryTag: 'Living Room',
    styleTag: 'Contemporary',
    description: 'Textured walls and soft, layered lighting for evenings in.',
    longDescription: 'A living room built for slow evenings - lime-washed textured walls, low-slung seating, and three layers of lighting (ambient, task, and accent) that can be dialed from bright and social to dim and intimate. Warm wood tones and woven textiles keep the contemporary shell from feeling cold.',
    propertyType: 'Independent Villa',
    scope: 'Living Room',
    designDirection: 'Warm Contemporary',
    highlights: [
      { id: 'p2h1', title: 'Lime-Washed Feature Wall', caption: 'A textured plaster finish that catches light differently through the day.', image: ImgFireplaceLiving },
      { id: 'p2h2', title: 'Three Lighting Layers', caption: 'Ambient, task, and accent sources on separate circuits, dialed independently.', image: ImgCofferedCeiling },
      { id: 'p2h3', title: 'Warm Wood + Woven Textiles', caption: 'Timber tones and natural weaves keep the contemporary shell from feeling cold.', image: ImgGardenDoorsLiving },
    ],
    rooms: [
      { id: 'p2r1', title: 'Seating Zone', caption: 'Low-slung cream seating faces the view, not the television.', image: ImgSeaViewLiving },
      { id: 'p2r2', title: 'Fireplace Corner', caption: 'A travertine-clad fireplace anchors the room’s quieter end.', image: ImgFireplaceLiving },
      { id: 'p2r3', title: 'Media Wall', caption: 'Oak paneling and exposed beams frame the television without it dominating the room.', image: ImgOakPanelLiving },
    ],
    materials: [
      { id: 'p2m1', label: 'Lime-Washed Plaster', note: 'Hand-applied texture that reads differently in morning and evening light.', color: '#DCCFB4' },
      { id: 'p2m2', label: 'Woven Bouclé', note: 'Textured upholstery that softens every hard surface around it.', color: '#EFE9DE' },
      { id: 'p2m3', label: 'Warm Teak', note: 'A single timber tone carried across furniture and joinery.', image: ImgOakJoinery },
    ],
    image: ImgContemporaryLiving,
  },
  {
    id: 'p3',
    title: 'Urban Apartment Refresh',
    category: 'Kitchen',
    categoryTag: 'Kitchen',
    styleTag: 'Minimal',
    description: 'A compact, modular kitchen designed around smart storage.',
    longDescription: 'Built for a compact urban footprint, this modular kitchen prioritizes storage density without feeling cramped - pull-out pantry units, a slim breakfast counter, and handle-less cabinetry that keeps sightlines clean in a small space.',
    propertyType: '2BHK Apartment',
    scope: 'Kitchen',
    designDirection: 'Compact Minimal',
    highlights: [
      { id: 'p3h1', title: 'Slim Breakfast Counter', caption: 'A narrow bar counter seats two without eating into the walking path.', image: ImgTaupeKitchen },
      { id: 'p3h2', title: 'Handle-less, Flat-Front Cabinetry', caption: 'Push-to-open fronts keep sightlines clean in a small footprint.', image: ImgOakJoinery },
      { id: 'p3h3', title: 'Focused Task Lighting', caption: 'Under-cabinet fixtures light the counter, not the whole room.', image: ImgPendantCluster },
    ],
    rooms: [
      { id: 'p3r1', title: 'Island & Seating', caption: 'A marble-topped island with brass pendants doubles as the breakfast bar.', image: ImgMarbleIslandKitchen },
      { id: 'p3r2', title: 'Storage Wall', caption: 'Two-tone cabinetry runs floor to ceiling, hiding a full pantry behind flat fronts.', image: ImgTwoToneKitchen },
      { id: 'p3r3', title: 'Counter Detail', caption: 'A travertine counter and ribbed tile backsplash give the workspace texture.', image: ImgKitchenVignette },
    ],
    materials: [
      { id: 'p3m1', label: 'Matte Taupe Laminate', note: 'A durable, fingerprint-resistant finish for daily cooking.', color: '#B9AC9A' },
      { id: 'p3m2', label: 'White Stone Counter', note: 'A light, easy-to-clean worktop that keeps the small room feeling open.', color: '#E9E6DE' },
      { id: 'p3m3', label: 'Brass Hardware', note: 'Warm metal accents against the otherwise neutral palette.', color: '#B08D57' },
    ],
    image: ImgMinimalistKitchen,
  },
  {
    id: 'p4',
    title: 'Sanctuary Retreat',
    category: 'Bathroom',
    categoryTag: 'Bathroom',
    styleTag: 'Minimal',
    description: 'Spa-inspired finishes for a calmer daily routine.',
    longDescription: 'A bathroom reimagined as a daily ritual space - large-format stone-look tile, a freestanding tub, and warm-dimmable lighting borrowed from spa design. Ventilation and water-proofing were upgraded first, so the calm finish sits on a genuinely durable base.',
    propertyType: '3BHK Apartment',
    scope: 'Bathroom',
    designDirection: 'Spa Minimal',
    highlights: [
      { id: 'p4h1', title: 'Considered Finishing Touches', caption: 'Every detail, down to the frame on the wall, was chosen deliberately.', image: ImgGalleryWallArt },
      { id: 'p4h2', title: 'Warm Wood Vanity Detailing', caption: 'Timber joinery softens what could otherwise feel like a cold, all-stone room.', image: ImgOakJoinery },
      { id: 'p4h3', title: 'Brass Fixture Detailing', caption: 'Warm brass fittings against pale stone keep the room from feeling clinical.', image: ImgKitchenVignette },
    ],
    rooms: [
      { id: 'p4r1', title: 'Vanity Wall', caption: 'A round travertine vessel sink sits on a light wood shelf, faucet in brushed steel.', image: ImgTravertineVanity },
      { id: 'p4r2', title: 'Soaking Tub', caption: 'A freestanding tub on herringbone wood flooring, framed by a garden-view window.', image: ImgSpaBathtub },
      { id: 'p4r3', title: 'Stone Detailing', caption: 'Travertine’s natural pitting brings texture without adding visual noise.', image: ImgTravertineDetails },
    ],
    materials: [
      { id: 'p4m1', label: 'Large-Format Stone Tile', note: 'Fewer grout lines read as calmer, even in a small room.', color: '#DAD3C6' },
      { id: 'p4m2', label: 'Brushed Brass', note: 'Warm-toned fittings borrowed from spa design.', color: '#B08D57' },
      { id: 'p4m3', label: 'Warm-Dimmable Lighting', note: 'A single dimmable circuit takes the room from bright to candlelit.', color: '#F2E4C4' },
    ],
    image: ImgSanctuaryBath,
  },
  {
    id: 'p5',
    title: 'Quiet Luxury Bedroom',
    category: 'Bedroom',
    categoryTag: 'Bedroom',
    styleTag: 'Contemporary',
    description: 'Tactile fabrics and a restrained, restful palette.',
    longDescription: 'A restrained palette of stone, sand, and charcoal lets texture do the talking - bouclé, linen, and brushed metal hardware throughout. Blackout drapery and a dedicated reading nook were the two client priorities that shaped the whole layout.',
    propertyType: '4BHK Apartment',
    scope: 'Bedroom',
    designDirection: 'Quiet Luxury',
    highlights: [
      { id: 'p5h1', title: 'Restrained Palette', caption: 'Stone, sand, and charcoal repeat across every textile in the room.', image: ImgMinimalGreyLiving },
      { id: 'p5h2', title: 'Bouclé & Linen Textures', caption: 'Tactile fabrics do the decorating so the walls could stay quiet.', image: ImgLivingCorner },
      { id: 'p5h3', title: 'Brushed Metal Hardware', caption: 'Matte, warm-toned fittings throughout - nothing polished enough to glare.', image: ImgTravertineDetails },
    ],
    rooms: [
      { id: 'p5r1', title: 'Wardrobe Wall', caption: 'Built-in joinery in a single warm timber tone keeps the room feeling uncluttered.', image: ImgOakJoinery },
      { id: 'p5r2', title: 'Reading Nook', caption: 'One considered art piece anchors the corner built for the client’s reading habit.', image: ImgGalleryWallArt },
      { id: 'p5r3', title: 'Bedside Lighting', caption: 'Warm, dimmable fixtures replace a single harsh overhead bulb.', image: ImgPendantCluster },
    ],
    materials: [
      { id: 'p5m1', label: 'Stone', note: 'The palette’s neutral base, used on the largest surfaces.', color: '#C9C2B6' },
      { id: 'p5m2', label: 'Sand', note: 'A warmer neutral layered in through textiles.', color: '#D8CBB0' },
      { id: 'p5m3', label: 'Charcoal', note: 'The one dark note, kept to small, considered accents.', color: '#3E3B38' },
    ],
    image: ImgWarmBedroom,
  },
]

export type InspirationItem = {
  id: string
  title: string
  image: number
  tall: boolean
  styleTag: string
  tags: string[]
  editorial: string
  theLook: VisualCard[]
  whereToUse: string[]
  pairWith: MaterialSwatch[]
  relatedProjectIds: string[]
}

export const INSPIRATION_GRID: InspirationItem[] = [
  {
    id: 'i1',
    title: 'Travertine Details',
    image: ImgTravertineDetails,
    tall: true,
    styleTag: 'Contemporary',
    tags: ['Natural Stone', 'Texture', 'Neutral Palette'],
    editorial: 'Travertine has become the material of the decade for good reason - its soft pitting and warm undertone bring texture to a room without adding visual noise. Used here on a feature wall and countertop, it pairs naturally with brushed brass and untreated oak.',
    theLook: [
      { id: 'i1l1', title: 'Vessel Sink Detail', caption: 'A hand-carved travertine basin, left honed rather than polished for a softer look.', image: ImgTravertineVanity },
      { id: 'i1l2', title: 'Countertop & Backsplash', caption: 'The same stone runs from counter to backsplash so the seam disappears.', image: ImgKitchenVignette },
      { id: 'i1l3', title: 'Travertine-Clad Fireplace', caption: 'A full-height fireplace surround turns one wall into the room’s focal point.', image: ImgFireplaceLiving },
    ],
    whereToUse: [
      'Bathroom vanities and shower surrounds',
      'Kitchen backsplashes and waterfall islands',
      'Fireplace cladding and feature walls',
    ],
    pairWith: [
      { id: 'i1p1', label: 'Brushed Brass', note: 'Warm metal that doesn’t compete with the stone’s own warmth.', color: '#B08D57' },
      { id: 'i1p2', label: 'Untreated Oak', note: 'A raw timber finish that ages alongside the stone.', image: ImgOakJoinery },
      { id: 'i1p3', label: 'Warm White Plaster', note: 'A quiet backdrop that lets the travertine stay the focal point.', color: '#EDE6D6' },
    ],
    relatedProjectIds: ['p1', 'p4'],
  },
  {
    id: 'i2',
    title: 'Complete Interior',
    image: ImgCompleteInterior,
    tall: false,
    styleTag: 'Modern',
    tags: ['Full Home', 'Cohesive Palette'],
    editorial: 'The strongest full-home interiors share one thing: restraint. A single wood tone, a single metal finish, and no more than three wall colors carried through every room create a sense of intention that piecemeal decorating can never quite match.',
    theLook: [
      { id: 'i2l1', title: 'One Wood Tone, Everywhere', caption: 'The same oak shows up in flooring, joinery, and furniture alike.', image: ImgGardenDoorsLiving },
      { id: 'i2l2', title: 'Oak Paneling Carried Through', caption: 'Wall paneling continues from the living room into adjoining spaces.', image: ImgOakPanelLiving },
      { id: 'i2l3', title: 'Cabinetry as a Connective Thread', caption: 'Kitchen cabinetry echoes the joinery used everywhere else in the home.', image: ImgTwoToneKitchen },
    ],
    whereToUse: [
      'Open-plan living and dining zones',
      'Kitchen cabinetry carried into adjacent joinery',
      'Hallways and connecting spaces',
    ],
    pairWith: [
      { id: 'i2p1', label: 'Single Wood Tone', note: 'Pick one timber and resist introducing a second.', image: ImgOakJoinery },
      { id: 'i2p2', label: 'Matte Black Hardware', note: 'One metal finish, repeated in every room, does more than it looks like it should.', color: '#2B2B2B' },
      { id: 'i2p3', label: 'Warm Neutral Paint', note: 'A single wall color family, varied only in intensity room to room.', color: '#EFE7D8' },
    ],
    relatedProjectIds: ['p1', 'p3'],
  },
  {
    id: 'i3',
    title: 'Full Home Living',
    image: ImgFullHomeChoice,
    tall: false,
    styleTag: 'Traditional',
    tags: ['Layout Planning', 'Family Living'],
    editorial: 'Open-plan living works best when zones are still legible - a change in flooring, a lowered ceiling, or a well-placed console can separate "living" from "dining" without a single wall going up.',
    theLook: [
      { id: 'i3l1', title: 'Zoned Open-Plan', caption: 'A mezzanine and a change in ceiling height separate living from library without a wall.', image: ImgIndustrialLoft },
      { id: 'i3l2', title: 'Defined Dining Zone', caption: 'An arch opening frames the dining table as its own room within the room.', image: ImgArchDining },
      { id: 'i3l3', title: 'Living Zone', caption: 'Garden-facing glazing anchors the living end of the open plan.', image: ImgGardenDoorsLiving },
    ],
    whereToUse: [
      'Open-plan apartments needing zoning without walls',
      'Family homes balancing shared and private space',
      'Transitional hallways between living and dining',
    ],
    pairWith: [
      { id: 'i3p1', label: 'Warm Oak Flooring', note: 'A single floor material that still reads as one continuous zone.', image: ImgOakJoinery },
      { id: 'i3p2', label: 'Sculptural Pendant', note: 'A statement fixture that marks a zone from across the room.', image: ImgPendantCluster },
      { id: 'i3p3', label: 'Neutral Console', note: 'A freestanding piece, not a wall, doing the job of separating two zones.', color: '#D9D2C4' },
    ],
    relatedProjectIds: ['p2'],
  },
  {
    id: 'i4',
    title: 'Contemporary Living',
    image: ImgModernWarmHome,
    tall: true,
    styleTag: 'Contemporary',
    tags: ['Lighting', 'Textiles'],
    editorial: 'Layered lighting is the single highest-impact upgrade for a contemporary living room - ambient, task, and accent sources on separate circuits let one room serve completely different moods across a single day.',
    theLook: [
      { id: 'i4l1', title: 'Cove-Lit Ceiling', caption: 'A geometric coffered ceiling hides LED cove lighting for a soft ambient wash.', image: ImgCofferedCeiling },
      { id: 'i4l2', title: 'Layered Task Lighting', caption: 'A cluster of pendants gives one corner its own focused light source.', image: ImgPendantCluster },
      { id: 'i4l3', title: 'Ambient Fireplace Glow', caption: 'A stone-clad fireplace doubles as a light source once evening comes in.', image: ImgFireplaceLiving },
    ],
    whereToUse: [
      'Living rooms with flexible day-to-night use',
      'Media walls and TV lounges',
      'Reading corners needing focused light',
    ],
    pairWith: [
      { id: 'i4p1', label: 'Warm-Dim LED', note: 'Fixtures that shift warmer as they dim, instead of just getting dimmer.', color: '#F2E4C4' },
      { id: 'i4p2', label: 'Brushed Brass Fixture', note: 'A warm metal finish that looks intentional under warm light.', color: '#B08D57' },
      { id: 'i4p3', label: 'Textured Bouclé', note: 'Fabric that catches layered light instead of flattening it.', color: '#EFE9DE' },
    ],
    relatedProjectIds: ['p2', 'p5'],
  },
]

export type CategoryContent = {
  styles: string[]
  tagline: string
  popularLooks: VisualCard[]
  roomShots: VisualCard[]
  designIdeas: VisualCard[]
  relatedSpaces: string[]
}

// Curated add-on per category name, following the SERVICE_CATALOG precedent
// in ServiceDetailScreen.tsx - the backend CategoryResponse has no styles field.
export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  'Living Room': {
    styles: ['Modern', 'Contemporary', 'Minimal', 'Traditional'],
    tagline: 'Where the household actually lives - built for both quiet evenings and Sunday crowds.',
    popularLooks: [
      { id: 'lrl1', title: 'Glass-Wall Contemporary', caption: 'Floor-to-ceiling glazing that turns the garden into a fifth wall.', image: ImgGlassWallLiving },
      { id: 'lrl2', title: 'Oak-Paneled Warmth', caption: 'Wood paneling and beams that soften an otherwise open-plan room.', image: ImgOakPanelLiving },
      { id: 'lrl3', title: 'Industrial Loft', caption: 'Exposed concrete and steel-framed windows, softened with textiles.', image: ImgIndustrialLoft },
    ],
    roomShots: [
      { id: 'lrr1', title: 'Terrace-Facing Seating', caption: 'Low seating angled toward the view, not the television.', image: ImgSeaViewLiving },
      { id: 'lrr2', title: 'Fireplace Corner', caption: 'A stone-clad fireplace anchors the room’s quieter end.', image: ImgFireplaceLiving },
      { id: 'lrr3', title: 'Pared-Back Living', caption: 'A low-profile sofa and a single sculptural object, nothing else competing for attention.', image: ImgMinimalGreyLiving },
      { id: 'lrr4', title: 'Styled Corner', caption: 'A side table, a lamp, and one framed piece - proof a corner doesn’t need more.', image: ImgLivingCorner },
    ],
    designIdeas: [
      { id: 'lri1', title: 'Cove-Lit Ceilings', caption: 'A coffered ceiling with hidden LED cove lighting adds depth without adding furniture.', image: ImgCofferedCeiling },
      { id: 'lri2', title: 'Sculptural Pendants', caption: 'A cluster of pendant lights doing the work three lamps used to do.', image: ImgPendantCluster },
      { id: 'lri3', title: 'One Considered Art Piece', caption: 'A single large canvas, well-placed, outperforms a wall of small frames.', image: ImgGalleryWallArt },
    ],
    relatedSpaces: ['Dining Room', 'Bedroom'],
  },
  'Bedroom': {
    styles: ['Contemporary', 'Minimal', 'Modern'],
    tagline: 'A room with exactly one job - rest. Everything in it should earn its place.',
    popularLooks: [
      { id: 'bdl1', title: 'Quiet Gallery Wall', caption: 'One framed piece instead of a cluster - calmer to wake up to.', image: ImgGalleryWallArt },
      { id: 'bdl2', title: 'Built-In Wardrobes', caption: 'Floor-to-ceiling joinery in a single timber tone keeps the room feeling uncluttered.', image: ImgOakJoinery },
      { id: 'bdl3', title: 'Stone Bedside Accents', caption: 'A travertine detail brings texture without needing more furniture.', image: ImgTravertineDetails },
    ],
    roomShots: [
      { id: 'bdr1', title: 'Bedside Lighting', caption: 'Warm, dimmable fixtures replace a single harsh overhead bulb.', image: ImgPendantCluster },
      { id: 'bdr2', title: 'Nightstand Styling', caption: 'A tray, a candle, one object with texture - the same styling logic as any other surface.', image: ImgCoffeeStyling },
      { id: 'bdr3', title: 'Reading Corner', caption: 'A single comfortable chair, positioned for the one hour a day it actually gets used.', image: ImgMinimalGreyLiving },
    ],
    designIdeas: [
      { id: 'bdi1', title: 'Layered Textiles', caption: 'Bouclé, linen, and a heavier throw give one bed three different textures to touch.', image: ImgLivingCorner },
      { id: 'bdi2', title: 'Sheer Curtains & Soft Light', caption: 'A sheer layer behind blackout drapery keeps mornings from feeling like a cave.', image: ImgSeaViewLiving },
      { id: 'bdi3', title: 'A Single Statement Artwork', caption: 'One large piece above the headboard does more than a gallery wall would.', image: ImgGlassWallLiving },
    ],
    relatedSpaces: ['Bathroom', 'Living Room'],
  },
  'Kitchen': {
    styles: ['Minimal', 'Modern', 'Contemporary'],
    tagline: 'The room that gets used every single day - worth over-planning the storage.',
    popularLooks: [
      { id: 'ktl1', title: 'Marble Island + Brass', caption: 'A marble-topped island and brass pendants turn the workhorse of the house into its centerpiece.', image: ImgMarbleIslandKitchen },
      { id: 'ktl2', title: 'Two-Tone Cabinetry', caption: 'Dark lowers and warm timber uppers break up a wall of cabinets.', image: ImgTwoToneKitchen },
      { id: 'ktl3', title: 'Taupe & Open Shelving', caption: 'Flat-front cabinetry below, open shelving above - storage without visual weight.', image: ImgTaupeKitchen },
    ],
    roomShots: [
      { id: 'ktr1', title: 'Counter Vignette', caption: 'A travertine counter and ribbed tile backsplash, styled with one ceramic piece.', image: ImgKitchenVignette },
      { id: 'ktr2', title: 'Cabinetry Detail', caption: 'Fluted paneling and a floating shelf break up a run of flat-front doors.', image: ImgOakJoinery },
      { id: 'ktr3', title: 'Pendant Lighting', caption: 'A cluster of fixtures over the island, sized to the counter below it.', image: ImgPendantCluster },
    ],
    designIdeas: [
      { id: 'kti1', title: 'Stone Backsplash Ideas', caption: 'Running the counter material up the wall removes a seam and a grout line.', image: ImgTravertineDetails },
      { id: 'kti2', title: 'Kitchen-to-Dining Flow', caption: 'An open sightline from stovetop to table so cooking stays part of the gathering.', image: ImgArchDining },
      { id: 'kti3', title: 'Open Shelving Styling', caption: 'A handful of considered objects, not a full set of dishware, on display.', image: ImgGalleryWallArt },
    ],
    relatedSpaces: ['Dining Room', 'Living Room'],
  },
  'Bathroom': {
    styles: ['Minimal', 'Contemporary'],
    tagline: 'Small footprint, outsized impact - the room where finishes matter most per square foot.',
    popularLooks: [
      { id: 'btl1', title: 'Travertine Vessel Sink', caption: 'A hand-carved basin on a floating wood shelf, left honed rather than polished.', image: ImgTravertineVanity },
      { id: 'btl2', title: 'Freestanding Soaking Tub', caption: 'A freestanding tub on herringbone wood flooring, framed by a garden-view window.', image: ImgSpaBathtub },
      { id: 'btl3', title: 'Stone Detailing', caption: 'Travertine’s natural pitting brings texture without adding visual noise.', image: ImgTravertineDetails },
    ],
    roomShots: [
      { id: 'btr1', title: 'Vanity Cabinetry', caption: 'Warm timber joinery softens what could otherwise feel like an all-stone room.', image: ImgOakJoinery },
      { id: 'btr2', title: 'Considered Wall Art', caption: 'Even a bathroom earns one deliberate piece, not a bare wall.', image: ImgGalleryWallArt },
    ],
    designIdeas: [
      { id: 'bti1', title: 'Soft, Layered Textiles', caption: 'Towels and a bath mat in the same tone as the tile, not fighting it.', image: ImgLivingCorner },
      { id: 'bti2', title: 'Natural Light, Maximized', caption: 'A frosted or high window that lets light in without sacrificing privacy.', image: ImgSeaViewLiving },
      { id: 'bti3', title: 'Indoor Greenery', caption: 'One plant that tolerates humidity does more for the room than another shelf.', image: ImgGlassWallLiving },
    ],
    relatedSpaces: ['Bedroom'],
  },
  'Dining Room': {
    styles: ['Traditional', 'Contemporary', 'Modern'],
    tagline: 'The most-photographed room in the house on the nights that matter.',
    popularLooks: [
      { id: 'dnl1', title: 'Arch-Framed Dining', caption: 'A plaster arch opening frames the table as its own room within the room.', image: ImgArchDining },
      { id: 'dnl2', title: 'Warm Oak Backdrop', caption: 'Paneling and beams give a plain dining wall some texture to sit against.', image: ImgOakPanelLiving },
      { id: 'dnl3', title: 'Statement Ceiling Above the Table', caption: 'A coffered ceiling detail draws the eye up before the food even arrives.', image: ImgCofferedCeiling },
    ],
    roomShots: [
      { id: 'dnr1', title: 'Kitchen-Adjacent Island', caption: 'An island within sight of the table keeps cooking part of the conversation.', image: ImgMarbleIslandKitchen },
      { id: 'dnr2', title: 'Open to the Kitchen', caption: 'Cabinetry that continues the dining room’s material story into the kitchen.', image: ImgTwoToneKitchen },
    ],
    designIdeas: [
      { id: 'dni1', title: 'Linear Pendant Over the Table', caption: 'A single fixture, sized to the table’s length rather than the room’s.', image: ImgPendantCluster },
      { id: 'dni2', title: 'Gallery Wall Behind the Sideboard', caption: 'A cluster of frames above the sideboard fills the wall guests actually face.', image: ImgGalleryWallArt },
      { id: 'dni3', title: 'Stone-Topped Sideboard', caption: 'A stone slab surface that can take hot dishes straight off the table.', image: ImgTravertineDetails },
    ],
    relatedSpaces: ['Living Room', 'Kitchen'],
  },
  'Office/Study': {
    styles: ['Minimal', 'Modern'],
    tagline: 'Built for full attention - the one room in the house designed around a single chair.',
    popularLooks: [
      { id: 'ofl1', title: 'Loft Library Wall', caption: 'A mezzanine-level library turns shelving into the room’s main feature.', image: ImgIndustrialLoft },
      { id: 'ofl2', title: 'Built-In Shelving', caption: 'Floor-to-ceiling joinery in a single timber tone, sized to actual books.', image: ImgOakJoinery },
      { id: 'ofl3', title: 'Framed Focus Wall', caption: 'One considered piece behind the desk, not a wall of distractions.', image: ImgGalleryWallArt },
    ],
    roomShots: [
      { id: 'ofr1', title: 'Reading Chair', caption: 'A single comfortable seat, positioned away from the desk for a change of task.', image: ImgMinimalGreyLiving },
      { id: 'ofr2', title: 'Desk Nook', caption: 'A considered corner - one lamp, one chair, nothing competing for focus.', image: ImgLivingCorner },
    ],
    designIdeas: [
      { id: 'ofi1', title: 'Task Lighting', caption: 'A fixture aimed at the desk surface, independent of the room’s ambient light.', image: ImgPendantCluster },
      { id: 'ofi2', title: 'Stone Desk Accent', caption: 'A stone tray or base object brings texture to an otherwise all-timber desk.', image: ImgTravertineDetails },
      { id: 'ofi3', title: 'Considered Desk Styling', caption: 'A tray, a candle, one plant - the same restraint as any other surface in the house.', image: ImgCoffeeStyling },
    ],
    relatedSpaces: ['Living Room'],
  },
  'Balcony/Outdoor': {
    styles: ['Contemporary', 'Minimal'],
    tagline: 'The extra room most homes forget they have - worth treating like one.',
    popularLooks: [
      { id: 'bol1', title: 'Indoor-Outdoor Flow', caption: 'Floor-to-ceiling doors that fold the living room straight into the terrace.', image: ImgGardenDoorsLiving },
      { id: 'bol2', title: 'Terrace Views', caption: 'Seating angled toward the view first, the room second.', image: ImgSeaViewLiving },
      { id: 'bol3', title: 'Garden-Facing Glass', caption: 'A full glass wall that makes the garden part of the room’s décor.', image: ImgGlassWallLiving },
    ],
    roomShots: [
      { id: 'bor1', title: 'Doors That Open the Room Up', caption: 'Black-framed sliding glass that disappears fully when opened.', image: ImgFireplaceLiving },
      { id: 'bor2', title: 'The Threshold Itself', caption: 'Matching flooring inside and out removes the visual line between the two.', image: ImgOakPanelLiving },
    ],
    designIdeas: [
      { id: 'boi1', title: 'Bringing the Outside In', caption: 'Structural materials like exposed concrete carry an outdoor feel indoors.', image: ImgIndustrialLoft },
      { id: 'boi2', title: 'Greenery & Natural Textures', caption: 'Dried botanicals and one statement plant do the styling a rug can’t.', image: ImgKitchenVignette },
      { id: 'boi3', title: 'Alfresco Styling Details', caption: 'A tray, a candle, one object with weight - even an outdoor surface deserves styling.', image: ImgCoffeeStyling },
    ],
    relatedSpaces: ['Living Room', 'Dining Room'],
  },
}

export const DEFAULT_CATEGORY_CONTENT: CategoryContent = {
  styles: ['Modern', 'Minimal', 'Contemporary', 'Traditional'],
  tagline: '',
  popularLooks: [],
  roomShots: [],
  designIdeas: [],
  relatedSpaces: [],
}

export type StyleInfo = {
  description: string
  definingTraits: string[]
  signatureElements: VisualCard[]
  palette: MaterialSwatch[]
  fitCheck: string[]
}

// Style as a first-class browse dimension, alongside space (CATEGORY_CONTENT) -
// same "curated add-on, no backend field" precedent as everything else in this file.
export const STYLE_CONTENT: Record<string, StyleInfo> = {
  Modern: {
    description: 'Clean lines, uncluttered surfaces, and a restrained material palette that lets the architecture do the talking.',
    definingTraits: [
      'Geometric lines over decorative detail',
      'A restrained, mostly-monochrome material palette',
      'Hidden or integrated hardware wherever possible',
      'Furniture chosen for form as much as comfort',
    ],
    signatureElements: [
      { id: 'moe1', title: 'Full-Height Glazing', caption: 'Glass walls that erase the line between structure and garden.', image: ImgGlassWallLiving },
      { id: 'moe2', title: 'Two-Tone Cabinetry', caption: 'A deliberate contrast between two flat, matte finishes.', image: ImgTwoToneKitchen },
      { id: 'moe3', title: 'Geometric Ceiling Coves', caption: 'A coffered ceiling that turns a flat plane into a feature.', image: ImgCofferedCeiling },
      { id: 'moe4', title: 'Exposed Structure', caption: 'Concrete and steel left visible instead of boxed in.', image: ImgIndustrialLoft },
    ],
    palette: [
      { id: 'mop1', label: 'Charcoal', note: 'The anchor tone for hardware and accents.', color: '#2B2B2B' },
      { id: 'mop2', label: 'Warm White', note: 'A softer alternative to stark, clinical white.', color: '#F2EFE7' },
      { id: 'mop3', label: 'Brushed Steel', note: 'A cool metal note against warmer surfaces.', color: '#9C9C9C' },
      { id: 'mop4', label: 'Walnut', note: 'The one warm timber tone allowed into an otherwise cool palette.', color: '#5B4636' },
    ],
    fitCheck: [
      'You’d rather have one great piece than five good ones',
      'Clutter genuinely stresses you out, not just in theory',
      'You like your materials to look like what they are - real stone, real wood, real metal',
    ],
  },
  Minimal: {
    description: 'Fewer, better things - pared-back palettes and hidden storage that keep every room calm.',
    definingTraits: [
      'Fewer objects, each one considered',
      'Hidden storage so surfaces stay clear',
      'A tight, mostly-neutral color range',
      'Light and texture do the decorating',
    ],
    signatureElements: [
      { id: 'mie1', title: 'Pared-Back Living', caption: 'A low-profile sofa and a single sculptural object, nothing else competing.', image: ImgMinimalGreyLiving },
      { id: 'mie2', title: 'Open Shelving, Not Cabinets', caption: 'What’s on display is curated, because there’s nowhere to hide the rest.', image: ImgTaupeKitchen },
      { id: 'mie3', title: 'One Material, Well Used', caption: 'A single stone carried from counter to wall so no seam interrupts it.', image: ImgTravertineVanity },
      { id: 'mie4', title: 'Negative Space as a Feature', caption: 'Empty wall left empty on purpose, not waiting for more art.', image: ImgLivingCorner },
    ],
    palette: [
      { id: 'mip1', label: 'Taupe', note: 'A warm neutral that reads as calm rather than cold.', color: '#B9AC9A' },
      { id: 'mip2', label: 'White Stone', note: 'Light enough to keep small rooms feeling open.', color: '#E9E6DE' },
      { id: 'mip3', label: 'Soft Grey', note: 'A quiet backdrop for the one or two objects allowed to stand out.', color: '#C7C3BC' },
      { id: 'mip4', label: 'Natural Oak', note: 'The palette’s single timber note.', color: '#C8A873' },
    ],
    fitCheck: [
      'You’d rather edit down than add more',
      'Hidden storage matters more to you than display shelving',
      'Calm matters more to you than "cozy" clutter',
    ],
  },
  Contemporary: {
    description: "What's current right now - a flexible mix of texture, warm neutrals, and layered lighting.",
    definingTraits: [
      'A mix of textures rather than one dominant material',
      'Warm neutrals instead of stark white or black',
      'Lighting treated as its own design layer',
      'Furniture with softer, rounder profiles',
    ],
    signatureElements: [
      { id: 'coe1', title: 'Travertine-Clad Fireplace', caption: 'A full-height stone surround that anchors the room’s quieter end.', image: ImgFireplaceLiving },
      { id: 'coe2', title: 'Sculptural Pendant Lighting', caption: 'A cluster of fixtures doing the work of a whole lamp collection.', image: ImgPendantCluster },
      { id: 'coe3', title: 'Indoor-Outdoor Glazing', caption: 'Glass doors that fold the living room into the garden.', image: ImgGardenDoorsLiving },
      { id: 'coe4', title: 'Oak Paneling & Beams', caption: 'Warm timber that keeps an open-plan room from feeling cavernous.', image: ImgOakPanelLiving },
    ],
    palette: [
      { id: 'cop1', label: 'Warm Sand', note: 'The palette’s dominant neutral.', color: '#D8CBB0' },
      { id: 'cop2', label: 'Bouclé Cream', note: 'Textured upholstery that softens every hard surface nearby.', color: '#EFE9DE' },
      { id: 'cop3', label: 'Brushed Brass', note: 'The warm metal finish repeated across fixtures.', color: '#B08D57' },
      { id: 'cop4', label: 'Soft Charcoal', note: 'A dark accent, used sparingly against the warm base.', color: '#4A4642' },
    ],
    fitCheck: [
      'You want "current" without chasing every trend',
      'You like a room to feel different at night than in daylight',
      'Texture matters to you as much as color',
    ],
  },
  Traditional: {
    description: 'Classic proportions, rich materials, and timeless detailing that ages well.',
    definingTraits: [
      'Classic proportion and symmetry over asymmetric drama',
      'Rich, saturated materials - wood, brass, stone',
      'Detailing that rewards a closer look - moldings, trims, joinery',
      'Furniture built to be handed down, not replaced',
    ],
    signatureElements: [
      { id: 'tre1', title: 'Arch-Framed Openings', caption: 'A plaster arch that turns a doorway into architecture.', image: ImgArchDining },
      { id: 'tre2', title: 'Detailed Millwork', caption: 'Fluted paneling and floating shelves that reward a closer look.', image: ImgOakJoinery },
      { id: 'tre3', title: 'Gallery-Style Framed Art', caption: 'Track-lit frames, hung the way a small gallery would hang them.', image: ImgGalleryWallArt },
      { id: 'tre4', title: 'Natural Stone Detailing', caption: 'Travertine’s texture standing in for the ornament a modern room skips.', image: ImgTravertineDetails },
    ],
    palette: [
      { id: 'trp1', label: 'Deep Walnut', note: 'A rich, dark timber for furniture meant to last generations.', color: '#4B3524' },
      { id: 'trp2', label: 'Aged Brass', note: 'A metal finish that’s meant to develop a patina, not stay shiny.', color: '#8C6A3F' },
      { id: 'trp3', label: 'Cream Plaster', note: 'A warm backdrop for darker, richer furniture.', color: '#EDE6D6' },
      { id: 'trp4', label: 'Forest Green', note: 'A deep accent color used on upholstery or trim.', color: '#3B4A3E' },
    ],
    fitCheck: [
      'You’re drawn to rooms that feel established, not trendy',
      'Symmetry and proportion matter to you, even subconsciously',
      'You want furniture that will still look right in fifteen years',
    ],
  },
  Eclectic: {
    description: 'Curated contrast - mixing eras, textures, and colors into one confident, personal look.',
    definingTraits: [
      'Deliberate contrast instead of one matched set',
      'Pieces collected over time, not bought as a set',
      'No fear of mixing eras - vintage next to new',
      'Color used with more confidence than most styles allow',
    ],
    signatureElements: [
      { id: 'ece1', title: 'Raw Structure, Soft Furniture', caption: 'Exposed concrete paired deliberately against plush upholstery.', image: ImgIndustrialLoft },
      { id: 'ece2', title: 'A Gallery Wall That Breaks the Grid', caption: 'Frames hung for personality, not symmetry.', image: ImgGalleryWallArt },
      { id: 'ece3', title: 'Layered, Personal Styling', caption: 'Books, a candle, and objects that mean something, stacked without a rulebook.', image: ImgCoffeeStyling },
      { id: 'ece4', title: 'Unexpected Ceiling Detail', caption: 'A geometric ceiling feature where a plain one was expected.', image: ImgCofferedCeiling },
    ],
    palette: [
      { id: 'ecp1', label: 'Terracotta', note: 'A warm, confident color most other styles avoid.', color: '#C1613F' },
      { id: 'ecp2', label: 'Deep Teal', note: 'A saturated accent that anchors a mixed-era room.', color: '#1F4D4D' },
      { id: 'ecp3', label: 'Brass', note: 'A warm metal that bridges vintage and new pieces.', color: '#B08D57' },
      { id: 'ecp4', label: 'Charcoal', note: 'A neutral dark enough to hold bolder colors together.', color: '#2B2B2B' },
    ],
    fitCheck: [
      'You’d rather a room be interesting than "safe"',
      'You keep things because you love them, not because they match',
      'You want guests to ask about at least one object in the room',
    ],
  },
}

export const ALL_STYLES = Object.keys(STYLE_CONTENT)

// Explore-home-only cards - each routes into an existing detail screen, so this
// stays local rather than becoming a sixth navigable route.
export type ExploreDetailCard = VisualCard & {
  linkScreen: string
  linkParam: Record<string, string>
}

export const EXPLORE_DESIGN_DETAILS: ExploreDetailCard[] = [
  {
    id: 'ed1',
    title: 'Lighting Ideas',
    caption: 'Three circuits, three moods - the single highest-impact upgrade in most rooms.',
    image: ImgPendantCluster,
    linkScreen: 'StyleDetail',
    linkParam: { name: 'Contemporary' },
  },
  {
    id: 'ed2',
    title: 'Coffered Ceilings',
    caption: 'A geometric ceiling turns a plain box of a room into the feature itself.',
    image: ImgCofferedCeiling,
    linkScreen: 'CategoryDetail',
    linkParam: { name: 'Living Room' },
  },
  {
    id: 'ed3',
    title: 'Millwork & Joinery',
    caption: 'Built-in cabinetry, done well, looks like it was never optional.',
    image: ImgOakJoinery,
    linkScreen: 'StyleDetail',
    linkParam: { name: 'Traditional' },
  },
  {
    id: 'ed4',
    title: 'Statement Art',
    caption: 'One large, well-placed piece does more than a wall of small frames.',
    image: ImgGalleryWallArt,
    linkScreen: 'StyleDetail',
    linkParam: { name: 'Eclectic' },
  },
]
