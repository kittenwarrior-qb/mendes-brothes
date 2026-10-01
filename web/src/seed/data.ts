/**
 * Demo content for Mendez Brothes General Construction.
 * Company facts come from the client's banner; anything not confirmed by the
 * client is marked [DEMO] in the admin so it is easy to find and replace.
 */

export const company = {
  companyName: 'Mendez Brothes General Construction',
  shortName: 'Mendez Brothes',
  tagline: 'Site work & construction in Sussex County, DE',
  description: 'Land clearing, site work and exterior construction in Sussex County, Delaware.',
  phone: '+1 302-563-8888',
  email: 'office@example.com', // [DEMO] replace with the real address
  address: { street: '21063 Camp Arrowhead Rd', city: 'Lewes', state: 'DE', zip: '19958' },
  hours: 'Monday to Saturday, 7:00 am to 6:00 pm',
  serviceAreaText: 'Sussex County and nearby Kent County, Delaware',
}

export const services = [
  {
    title: 'Forestry Mulching',
    icon: 'mulch',
    image: 'p1',
    d: 'Brush and small trees ground in place. No burning, no hauling.',
  },
  {
    title: 'Land Clearing - Landscaping',
    icon: 'clear',
    image: 'c8',
    d: 'Stumps, roots and debris removed; beds and lawns set up.',
  },
  {
    title: 'Grading',
    icon: 'grade',
    image: 'c7',
    d: 'Rough and finish grading with proper slope and drainage.',
  },
  {
    title: 'Demolition',
    icon: 'demo',
    image: 'c6',
    d: 'Houses, sheds, slabs and outbuildings taken down and hauled.',
  },
  {
    title: 'Excavation',
    icon: 'excav',
    image: 'dig',
    d: 'Foundations, basements, pools, trenches and ponds.',
  },
  {
    title: 'Driveways / Parking Areas',
    icon: 'drive',
    image: 'c5',
    d: 'Stone, millings and base prep for asphalt or concrete.',
  },
  {
    title: 'Building Pads',
    icon: 'pad',
    image: 'p2',
    d: 'Compacted pads for homes, garages, barns and pole buildings.',
  },
  {
    title: 'Clean Ups',
    icon: 'clean',
    image: 'c8',
    d: 'Storm debris, overgrown lots and construction waste cleared.',
  },
  {
    title: 'Pavers',
    icon: 'pavers',
    image: 'p3',
    d: 'Patios, walkways and driveways on a properly built base.',
  },
  {
    title: 'Siding - Roofing',
    icon: 'roof',
    image: 'roof',
    d: 'Replacement and repair to close out the exterior.',
  },
] as const

export const towns = [
  'Lewes',
  'Rehoboth Beach',
  'Milton',
  'Georgetown',
  'Millsboro',
  'Milford',
  'Harbeson',
  'Dewey Beach',
  'Ocean View',
  'Selbyville',
  'Ellendale',
  'Seaford',
]

export const equipment = [
  {
    name: 'Excavators',
    category: 'excavator',
    icon: 'fleetExcavator',
    spec: 'Mini to mid-size, 3–25 ton class',
    d: 'Foundations, trenching, ponds, stump removal and demolition.',
  },
  {
    name: 'Forestry mulchers',
    category: 'mulcher',
    icon: 'fleetMulcher',
    spec: 'Track-mounted drum heads',
    d: 'Grinds brush and small trees in place, leaving mulch that holds the soil.',
  },
  {
    name: 'Track & skid steer loaders',
    category: 'loader',
    icon: 'fleetSkid',
    spec: 'Bucket, grapple, forks, auger',
    d: 'Moving material, finish grading, backfill and tight-access work.',
  },
  {
    name: 'Dozers',
    category: 'dozer',
    icon: 'fleetDozer',
    spec: 'GPS grade control',
    d: 'Rough grading, spreading fill, building pads and access roads.',
  },
  {
    name: 'Wheel loaders',
    category: 'wheel-loader',
    icon: 'fleetWheelLoader',
    spec: 'Stone, mulch, bulk material',
    d: 'Loading trucks, stockpiling and spreading stone for driveways and lots.',
  },
  {
    name: 'Dump trucks & trailers',
    category: 'truck',
    icon: 'fleetDumpTruck',
    spec: 'Haul-off and delivery',
    d: 'Debris removal, fill dirt, stone, and moving machines between sites.',
  },
] as const

type SeedProject = {
  title: string
  town: string
  acres: number
  year: number
  month: number
  img: string
  services: string[]
  duration: string
  scope: string
  equipment: string[]
  extra?: string[]
  type?: 'residential' | 'commercial' | 'municipal' | 'agricultural'
  featured?: boolean
  gallery?: string[]
}

export const projects: SeedProject[] = [
  {
    title: 'Wooded homesite clearing',
    town: 'Lewes',
    acres: 3.2,
    year: 2025,
    month: 9,
    img: 'p1',
    services: ['Forestry Mulching', 'Land Clearing - Landscaping'],
    duration: '6 days',
    scope:
      'Mulched dense understory and small pines across the building envelope, pulled stumps under the house footprint, and left a mulch layer on the rest of the lot to hold soil.',
    equipment: ['Forestry mulchers', 'Track & skid steer loaders', 'Excavators'],
    featured: true,
    gallery: ['p1', 'c4', 'c8'],
  },
  {
    title: 'Custom home building pad',
    town: 'Milton',
    acres: 0.8,
    year: 2025,
    month: 8,
    img: 'p2',
    services: ['Building Pads', 'Excavation', 'Grading'],
    duration: '4 days',
    scope:
      "Stripped topsoil, placed and compacted structural fill in lifts, and finished the pad to the builder's elevation with GPS control.",
    equipment: ['Excavators', 'Dozers', 'Dump trucks & trailers'],
    featured: true,
    gallery: ['p2', 'dig', 'c7'],
  },
  {
    title: 'Coastal home driveway & paver walk',
    town: 'Rehoboth Beach',
    acres: 0.4,
    year: 2025,
    month: 6,
    img: 'p3',
    services: ['Driveways / Parking Areas', 'Pavers', 'Land Clearing - Landscaping'],
    duration: '8 days',
    scope:
      'Rebuilt the driveway base, installed a paver walkway to the entry, and regraded the front lawn to drain away from the house.',
    equipment: ['Track & skid steer loaders'],
    extra: ['Laser level', 'Plate compactor'],
    featured: true,
  },
  {
    title: 'Farm field edge mulching',
    town: 'Georgetown',
    acres: 8.5,
    year: 2024,
    month: 11,
    img: 'c4',
    services: ['Forestry Mulching'],
    duration: '9 days',
    scope:
      'Reclaimed overgrown field edges and a fence line, mulching brush and trees back to open ground.',
    equipment: ['Forestry mulchers'],
    type: 'agricultural',
  },
  {
    title: 'Warehouse stone parking area',
    town: 'Millsboro',
    acres: 1.6,
    year: 2024,
    month: 10,
    img: 'c5',
    services: ['Driveways / Parking Areas', 'Grading'],
    duration: '7 days',
    scope:
      'Graded for drainage, laid geotextile fabric and installed a compacted stone lot for trucks and staff parking.',
    equipment: ['Dozers', 'Wheel loaders', 'Dump trucks & trailers'],
    type: 'commercial',
  },
  {
    title: 'Beach cottage demolition',
    town: 'Dewey Beach',
    acres: 0.3,
    year: 2024,
    month: 4,
    img: 'c6',
    services: ['Demolition', 'Clean Ups'],
    duration: '3 days',
    scope:
      'Took down a single-story cottage and slab, separated materials for recycling, and left a clean graded lot for the new build.',
    equipment: ['Excavators', 'Dump trucks & trailers'],
  },
  {
    title: 'Subdivision lot grading',
    town: 'Milford',
    acres: 5.4,
    year: 2024,
    month: 7,
    img: 'c7',
    services: ['Grading', 'Excavation'],
    duration: '3 weeks',
    scope:
      "Rough and finish grading across six lots, including swales and a small retention area per the engineer's plan.",
    equipment: ['Dozers', 'Excavators'],
    extra: ['GPS machine control'],
    type: 'commercial',
  },
  {
    title: 'Storm debris clean up',
    town: 'Ocean View',
    acres: 2.1,
    year: 2025,
    month: 2,
    img: 'c8',
    services: ['Clean Ups', 'Land Clearing - Landscaping'],
    duration: '5 days',
    scope:
      'Removed downed trees and storm debris, ground stumps, and restored lawn areas with topsoil and seed.',
    equipment: ['Track & skid steer loaders', 'Dump trucks & trailers'],
    extra: ['Grapple'],
  },
  {
    title: 'In-ground pool excavation',
    town: 'Lewes',
    acres: 0.2,
    year: 2025,
    month: 5,
    img: 'c9',
    services: ['Excavation'],
    duration: '2 days',
    scope:
      "Dug the pool shell to the installer's layout, hauled off spoils, and backfilled around the finished walls.",
    equipment: ['Excavators', 'Dump trucks & trailers'],
  },
  {
    title: 'Roof & siding replacement',
    town: 'Selbyville',
    acres: 0.1,
    year: 2024,
    month: 9,
    img: 'roof',
    services: ['Siding - Roofing'],
    duration: '6 days',
    scope: 'Tore off and replaced the shingle roof, and installed new siding, trim and gutters.',
    equipment: [],
    extra: ['Roofing crew', 'Dump trailer'],
  },
  {
    title: 'Church parking lot expansion',
    town: 'Harbeson',
    acres: 2.7,
    year: 2023,
    month: 10,
    img: 'c11',
    services: ['Driveways / Parking Areas', 'Grading'],
    duration: '2 weeks',
    scope:
      'Cleared and graded new parking, built stone base for paving, and tied drainage into the existing lot.',
    equipment: ['Dozers', 'Excavators', 'Wheel loaders'],
    type: 'commercial',
  },
  {
    title: 'Barn pad & gravel access road',
    town: 'Ellendale',
    acres: 1.2,
    year: 2023,
    month: 6,
    img: 'c12',
    services: ['Building Pads', 'Driveways / Parking Areas'],
    duration: '5 days',
    scope:
      'Built a compacted pad for a pole barn and a 600-foot stone access road from the county road.',
    equipment: ['Dozers', 'Track & skid steer loaders', 'Dump trucks & trailers'],
    type: 'agricultural',
  },
]

export const checks = [
  'Miss Utility called before any digging',
  'Silt fence and erosion control where the site needs it',
  'Machines inspected and serviced on a set schedule',
  'Compaction checked before pads and driveways are finished',
  'Debris hauled to licensed disposal and recycling sites',
  'Final walkthrough with the owner before we leave',
]

export const faqs = [
  {
    q: 'Do you give free estimates?',
    a: 'Yes. We visit the property, check access, soil and drainage, and send a written estimate broken down by task.',
  },
  {
    q: 'What areas do you serve?',
    a: 'All of Sussex County and nearby parts of Kent County, Delaware. Not sure you are in range? Call and ask.',
  },
  {
    q: 'How soon can you start?',
    a: 'Most site visits happen within a few days. Start dates depend on the season and the size of the job — we give you a schedule with the estimate.',
  },
  {
    q: 'Do you haul away debris?',
    a: 'Yes. Debris goes to licensed disposal and recycling sites. With forestry mulching, most material stays on site as mulch.',
  },
  {
    q: 'Do you handle permits and utility marking?',
    a: 'We call Miss Utility before every dig and can help you understand what permits your project needs.',
  },
  {
    q: 'Can you work with my builder?',
    a: 'Yes. Many of our pads, driveways and grading jobs are done for custom builders, on their schedule and to their elevations.',
  },
]

export const testimonials = [
  {
    author: 'Karen M. [DEMO]',
    location: 'Lewes, DE',
    rating: 5,
    quote:
      'They cleared our wooded lot in under a week and left it cleaner than we expected. Clear price, no surprises.',
  },
  {
    author: 'Dave R. [DEMO]',
    location: 'Milton, DE',
    rating: 5,
    quote:
      'Our building pad was ready the day the builder needed it. Straight answers the whole way through.',
  },
  {
    author: 'Coastal Custom Homes [DEMO]',
    location: 'Rehoboth Beach, DE',
    rating: 5,
    quote:
      'We use Mendez Brothes for pads and driveways on most of our builds. Reliable crew and good equipment.',
  },
]
