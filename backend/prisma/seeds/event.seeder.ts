import { PrismaClient } from '../../generated/prisma/client';
import { Seeder } from './seeder.abstract';

type City = {
  name: string;
  country: string;
  lat: number;
  lng: number;
  venues: string[];
};

type EventFormat = {
  name: string;
  startHour: [number, number];
  // Single-day events: duration in hours
  duration?: [number, number];
  // Multi-day events: number of days, ending in the evening of the last day
  days?: [number, number];
  capacity: [number, number];
};

const CITIES: City[] = [
  {
    name: 'Kyiv',
    country: 'Ukraine',
    lat: 50.4501,
    lng: 30.5234,
    venues: [
      'UNIT.City, Dorohozhytska St 3',
      'Creative State Arsenal, Lavrska St 10',
      'Mystetskyi Arsenal, Lavrska St 10-12',
      'Kooperativ, Kyrylivska St 41',
      'Parkovy Exhibition Center, Parkova Rd 16A',
      'Hub 4.0, Kyrylivska St 69',
    ],
  },
  {
    name: 'Lviv',
    country: 'Ukraine',
    lat: 49.8397,
    lng: 24.0297,
    venues: [
      'Lviv IT Park, Naukova St 7',
      'Lem Station, Lemkivska St 15',
      'Fabryka Povitria, Ivana Franka St 61',
      'Lviv Palace of Arts, Kopernyka St 17',
      'Coworking Vezha, Rynok Sq 1',
    ],
  },
  {
    name: 'Odesa',
    country: 'Ukraine',
    lat: 46.4825,
    lng: 30.7233,
    venues: [
      'Impact Hub Odesa, Bunina St 24',
      'Odesa Film Studio, Frantsuzkyi Blvd 33',
      'Terminal 42, Mytna Sq 1',
      'Green Theatre, Shevchenko Park',
    ],
  },
  {
    name: 'Kharkiv',
    country: 'Ukraine',
    lat: 49.9935,
    lng: 36.2304,
    venues: [
      'Fabrika.space, Blahovishchenska St 1',
      'Ekonomik Hub, Sumska St 12',
      'Kharkiv IT Cluster Hall, Nauky Ave 14',
    ],
  },
  {
    name: 'Dnipro',
    country: 'Ukraine',
    lat: 48.4647,
    lng: 35.0462,
    venues: [
      'Menorah Center, Sholom-Aleikhema St 4/26',
      'Dnipro Innovation Hub, Yavornytskoho Ave 22',
    ],
  },
  {
    name: 'Ivano-Frankivsk',
    country: 'Ukraine',
    lat: 48.9226,
    lng: 24.7111,
    venues: ['Promprylad.Renovation, Sakharova St 23', 'Urban Space 100'],
  },
  {
    name: 'Warsaw',
    country: 'Poland',
    lat: 52.2297,
    lng: 21.0122,
    venues: [
      'Palace of Culture and Science, Plac Defilad 1',
      'Google for Startups Campus, Plac Konesera 10',
      'EXPO XXI, Prądzyńskiego 12/14',
      'Fabryka Norblina, Żelazna 51/53',
    ],
  },
  {
    name: 'Krakow',
    country: 'Poland',
    lat: 50.0647,
    lng: 19.945,
    venues: [
      'ICE Kraków Congress Centre, Marii Konopnickiej 17',
      'Hevre, Beera Meiselsa 18',
      'Tauron Arena, Lema 7',
    ],
  },
  {
    name: 'Berlin',
    country: 'Germany',
    lat: 52.52,
    lng: 13.405,
    venues: [
      'Factory Berlin, Rheinsberger Str. 76/77',
      'Station Berlin, Luckenwalder Str. 4-6',
      'Kulturbrauerei, Schönhauser Allee 36',
      'betahaus, Rudi-Dutschke-Str. 23',
    ],
  },
  {
    name: 'Munich',
    country: 'Germany',
    lat: 48.1351,
    lng: 11.582,
    venues: [
      'Werk1, Atelierstraße 29',
      'Messe München, Am Messesee 2',
      'Literaturhaus, Salvatorplatz 1',
    ],
  },
  {
    name: 'Prague',
    country: 'Czechia',
    lat: 50.0755,
    lng: 14.4378,
    venues: [
      'Forum Karlín, Pernerova 51',
      'Impact Hub Praha, Drtinova 10',
      'DOX Centre, Poupětova 1',
    ],
  },
  {
    name: 'Vienna',
    country: 'Austria',
    lat: 48.2082,
    lng: 16.3738,
    venues: [
      'Austria Center Vienna, Bruno-Kreisky-Platz 1',
      'WeXelerate, Praterstraße 1',
      'MuseumsQuartier, Museumsplatz 1',
    ],
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    lat: 52.3676,
    lng: 4.9041,
    venues: [
      'RAI Amsterdam, Europaplein 24',
      'Pakhuis de Zwijger, Piet Heinkade 179',
      'A Lab, Overhoeksplein 2',
    ],
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    lat: 38.7223,
    lng: -9.1393,
    venues: [
      'Altice Arena, Rossio dos Olivais',
      'LX Factory, Rua Rodrigues de Faria 103',
      'Hub Criativo do Beato, Rua da Manutenção 71',
    ],
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    lat: 41.3874,
    lng: 2.1686,
    venues: [
      'Fira Gran Via, Av. Joan Carles I 64',
      'Pier01 Barcelona Tech City, Plaça de Pau Vila 1',
      'CCCB, Montalegre 5',
    ],
  },
  {
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    venues: [
      'ExCeL London, Royal Victoria Dock',
      'Here East, Queen Elizabeth Olympic Park',
      'The Barbican Centre, Silk St',
      'Second Home Spitalfields, 68 Hanbury St',
    ],
  },
  {
    name: 'Tallinn',
    country: 'Estonia',
    lat: 59.437,
    lng: 24.7536,
    venues: [
      'Telliskivi Creative City, Telliskivi 60a',
      'Kultuurikatel, Põhja pst 27a',
    ],
  },
  {
    name: 'Vilnius',
    country: 'Lithuania',
    lat: 54.6872,
    lng: 25.2797,
    venues: ['Vilnius Tech Park, Sapiegos g. 8', 'LITEXPO, Laisvės pr. 5'],
  },
];

const FORMATS: EventFormat[] = [
  {
    name: 'Meetup',
    startHour: [18, 19],
    duration: [2, 3],
    capacity: [30, 120],
  },
  {
    name: 'Workshop',
    startHour: [10, 14],
    duration: [3, 6],
    capacity: [15, 40],
  },
  {
    name: 'Masterclass',
    startHour: [11, 17],
    duration: [2, 4],
    capacity: [20, 60],
  },
  {
    name: 'Conference',
    startHour: [9, 10],
    days: [1, 3],
    capacity: [300, 2000],
  },
  { name: 'Summit', startHour: [9, 10], days: [1, 2], capacity: [200, 1500] },
  { name: 'Hackathon', startHour: [10, 12], days: [2, 3], capacity: [60, 300] },
  {
    name: 'Bootcamp',
    startHour: [9, 10],
    duration: [6, 8],
    capacity: [20, 50],
  },
  {
    name: 'Panel Discussion',
    startHour: [17, 19],
    duration: [1, 2],
    capacity: [50, 200],
  },
  {
    name: 'Networking Night',
    startHour: [18, 20],
    duration: [3, 4],
    capacity: [40, 150],
  },
  {
    name: 'Festival',
    startHour: [11, 12],
    days: [1, 3],
    capacity: [500, 5000],
  },
];

// Topics per category name; "default" is used for categories not listed
const TOPICS: Record<string, string[]> = {
  Technology: [
    'React & Next.js',
    'Node.js',
    'Rust',
    'Go',
    'Kubernetes',
    'DevOps',
    'Cybersecurity',
    'LLM Engineering',
    'Machine Learning',
    'Data Engineering',
    'Mobile Development',
    'Cloud Architecture',
    'QA Automation',
    'Open Source',
    'GameDev',
  ],
  Design: [
    'Product Design',
    'UX Research',
    'Design Systems',
    'Motion Design',
    'Typography',
    '3D & Blender',
    'Figma',
    'Accessibility',
    'Brand Identity',
    'Illustration',
  ],
  Business: [
    'Startup Fundraising',
    'Product Management',
    'Growth Marketing',
    'SaaS Sales',
    'E-commerce',
    'FinTech',
    'Leadership',
    'Remote Teams',
    'Women in Business',
    'Venture Capital',
  ],
  Health: [
    'Mental Health',
    'Yoga',
    'Running',
    'Nutrition',
    'Mindfulness',
    'Sleep Science',
    'Healthy Workplace',
    'HealthTech',
    'Recovery & Rehabilitation',
  ],
  default: ['Community', 'Culture', 'Education', 'Volunteering', 'Science'],
};

const TITLE_PATTERNS = [
  '{city} {topic} {format}',
  '{topic} {format} {city} {year}',
  '{topic} {format}',
  '{topic} Days {city}',
  '{format}: {topic} in Practice',
  '{topic} {format} #{n}',
  'Intro to {topic}',
  '{topic} Night',
  'Advanced {topic} {format}',
  '{topic} for Beginners',
];

const INTROS = [
  'Join us for a {formatLower} dedicated to {topic}.',
  'The {city} {topic} community gets together again.',
  'A hands-on {formatLower} for anyone curious about {topic}.',
  'We are bringing together practitioners working with {topic} every day.',
  'After a sold-out previous edition, the {formatLower} returns to {city}.',
  'Spend a day with people who build, research and teach {topic}.',
];

const MIDDLES = [
  'Expect talks from local and international speakers, live demos and an open Q&A.',
  'The program includes short talks, practical exercises and time for your own questions.',
  'Bring your laptop: most of the session is hands-on.',
  'We will discuss real case studies, common mistakes and what actually works in production.',
  'Speakers include engineers, founders and researchers from leading companies in the region.',
  'There will be a lightning-talk slot, so feel free to share your own experience.',
  'Each track ends with a panel where you can challenge the speakers.',
];

const OUTROS = [
  'Coffee and snacks are included.',
  'Networking and pizza after the main part.',
  'The talks are in English; slides will be shared after the event.',
  'Seats are limited to {capacity} participants, so register early.',
  'Free entry, registration required.',
  'Recordings will be available to all registered participants.',
  'Afterparty at a nearby bar for those who want to keep talking.',
];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}

export class EventSeeder extends Seeder {
  async shouldRun(prisma: PrismaClient): Promise<boolean> {
    const count = await prisma.event.count();
    return count === 0;
  }

  async seed(prisma: PrismaClient): Promise<void> {
    const users = await prisma.user.findMany({ take: 10 });
    const categories = await prisma.category.findMany();

    if (users.length === 0) return;

    const eventsData = Array.from({ length: 120 }).map(() => {
      const category = categories.length > 0 ? pick(categories) : undefined;
      const topic = pick(TOPICS[category?.name ?? 'default'] ?? TOPICS.default);
      const format = pick(FORMATS);
      const city = pick(CITIES);
      const venue = pick(city.venues);
      const capacity = randomInt(...format.capacity);

      // Events from 60 days ago up to 240 days ahead, starting on the hour or half hour
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + randomInt(-60, 240));
      startDate.setHours(randomInt(...format.startHour), pick([0, 30]), 0, 0);

      const endDate = new Date(startDate);
      if (format.days) {
        endDate.setDate(endDate.getDate() + randomInt(...format.days) - 1);
        endDate.setHours(randomInt(18, 21), 0, 0, 0);
      } else {
        endDate.setHours(
          endDate.getHours() + randomInt(...(format.duration ?? [2, 3])),
        );
      }

      const values = {
        city: city.name,
        topic,
        format: format.name,
        formatLower: format.name.toLowerCase(),
        year: String(startDate.getFullYear()),
        n: String(randomInt(2, 15)),
        capacity: String(capacity),
      };

      const title = fill(pick(TITLE_PATTERNS), values);
      const description = [pick(INTROS), pick(MIDDLES), pick(OUTROS)]
        .map((sentence) => fill(sentence, values))
        .join(' ');

      return {
        title,
        description,
        location: `${venue}, ${city.name}, ${city.country}`,
        // Spread events around the city center (about ±3 km)
        latitude: +(city.lat + (Math.random() - 0.5) * 0.06).toFixed(6),
        longitude: +(city.lng + (Math.random() - 0.5) * 0.08).toFixed(6),
        startDate,
        endDate,
        createdById: pick(users).id,
        categoryId: category?.id,
      };
    });

    await prisma.event.createMany({
      data: eventsData,
    });
  }
}
