export const FALLBACK_SETTINGS = {
  siteName: "ZedTunes",
  siteBio: "Download Latest Zambian Music, Albums, EP & Kalindula Classics.",
  logoBase64: "", // Will fallback to default layout styles or custom logo elements
  underConstruction: false,
};

export interface FallbackSong {
  id: string;
  title: string;
  artist: string;
  slug: string;
  views: string;
  category: string;
  imageBase64: string;
  description: string;
  archiveLink: string;
  createdAt: string;
  tracks?: Array<{ title: string; duration: string }>;
}

export interface FallbackArtist {
  id: string;
  name: string;
  bio: string;
  slug: string;
  imageBase64: string;
}

export const FALLBACK_ARTISTS: FallbackArtist[] = [];
export const REMOVED_FALLBACK_ARTISTS: FallbackArtist[] = [
  {
    id: "art-1",
    name: "Yo Maps",
    bio: "Elton Mulenga, professionally known as Yo Maps, is a multi-award winning Zambian singer, songwriter, and producer who rose to stardom with his 2018 hit single 'Finally'. He is widely regarded as one of Zambia's most prominent contemporary music pioneers.",
    slug: "yo-maps",
    imageBase64: "https://picsum.photos/seed/yomaps/400/400",
  },
  {
    id: "art-2",
    name: "Chef 187",
    bio: "Kondwani Kaira, better known by his stage name Chef 187, is an influential Zambian hip-hop artist, lyricist, and performer. Known for his rapid-fire delivery and highly relatable Bemba rhymes, he has consistently released chart-topping records across the nation.",
    slug: "chef-187",
    imageBase64: "https://picsum.photos/seed/chef187/400/400",
  },
  {
    id: "art-3",
    name: "Macky 2",
    bio: "Mark Kaira, professionally known as Macky 2, is a legendary Zambian hip-hop musician, producer, and actor. He is famous for establishing the 'Kopala Swag' movement and mentoring young talents in the Zambian music industry.",
    slug: "macky-2",
    imageBase64: "https://picsum.photos/seed/macky2/400/400",
  },
  {
    id: "art-4",
    name: "Slapdee",
    bio: "Mwila Musonda, known stage-wise as Slapdee, is an award-winning Zambian hip-hop and rap artist, and the founder of XYZ Entertainment. He is long celebrated as a defining force in the standardisation of Zambian hip-hop.",
    slug: "slapdee",
    imageBase64: "https://picsum.photos/seed/slapdee/400/400",
  },
  {
    id: "art-5",
    name: "Pompi",
    bio: "Chaka Nyanthando, known as Pompi, is a stellar Zambian singer, gospel minister, and songwriter. Blending traditional African rhythms with modern R&B, hip-hop, and soul elements, Pompi's music spreads message-filled, uplifting joy.",
    slug: "pompi",
    imageBase64: "https://picsum.photos/seed/pompi/400/400",
  },
  {
    id: "art-6",
    name: "Roberto",
    bio: "Roberto Banda is a celebrated Zambian Afro-pop artist, songwriter, and producer. His sensational international breakthrough single 'Amarulah' cemented his status across East and Southern Africa as a champion of smooth love tunes.",
    slug: "roberto",
    imageBase64: "https://picsum.photos/seed/roberto/400/400",
  },
];

export const FALLBACK_SONGS: FallbackSong[] = [];
export const REMOVED_FALLBACK_SONGS: FallbackSong[] = [
  {
    id: "song-1",
    title: "Someone",
    artist: "Yo Maps",
    slug: "someone",
    views: "24,500",
    category: "Zambian",
    imageBase64: "https://picsum.photos/seed/someone/500/500",
    description: "An emotional Afro-pop anthem where Yo Maps sings about finding that one true love who accepts you with all your history and dreams.",
    archiveLink: "https://archive.org/download/sample-mp3-file/sample-4s.mp3",
    createdAt: "2026-05-15T12:00:00.000Z",
  },
  {
    id: "song-2",
    title: "Husband Material",
    artist: "Chef 187",
    slug: "husband-material",
    views: "19,200",
    category: "Hip Hop",
    imageBase64: "https://picsum.photos/seed/husband/500/500",
    description: "Chef 187 delivers a clever, mid-tempo rap narrative about modern relationship standards, self-improvement, and social expectations, combined with beautiful harmonies.",
    archiveLink: "https://archive.org/download/sample-mp3-file/sample-4s.mp3",
    createdAt: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "song-3",
    title: "Aweah",
    artist: "Yo Maps",
    slug: "aweah",
    views: "32,800",
    category: "Zambian",
    imageBase64: "https://picsum.photos/seed/aweah/500/500",
    description: "The award-winning feel-good jam of the season, 'Aweah' expresses gratitude for life's blessings, and the danceable tune will have you moving in no time.",
    archiveLink: "https://archive.org/download/sample-mp3-file/sample-4s.mp3",
    createdAt: "2026-05-01T08:00:00.000Z",
  },
  {
    id: "song-4",
    title: "Silence",
    artist: "Pompi",
    slug: "silence",
    views: "11,400",
    category: "Gospel",
    imageBase64: "https://picsum.photos/seed/silence/500/500",
    description: "A deeply soulful message from Pompi urging listeners to find peace amidst the noise, trusting in a greater guidance and inner strength.",
    archiveLink: "https://archive.org/download/sample-mp3-file/sample-4s.mp3",
    createdAt: "2026-05-10T09:30:00.000Z",
  },
  {
    id: "song-5",
    title: "Amarulah",
    artist: "Roberto",
    slug: "amarulah",
    views: "45,000",
    category: "Afrobeat",
    imageBase64: "https://picsum.photos/seed/amarulah/500/500",
    description: "Roberto's hit single that captured hearts across entire Africa. This smooth Afrobeat tune features sweet lyrics praising a beloved partner, as sweetest as Amarulah.",
    archiveLink: "https://archive.org/download/sample-mp3-file/sample-4s.mp3",
    createdAt: "2026-04-20T14:20:00.000Z",
  },
  {
    id: "song-6",
    title: "Try Again Album",
    artist: "Yo Maps",
    slug: "try-again-album",
    views: "54,200",
    category: "Album",
    imageBase64: "https://picsum.photos/seed/tryagain/500/500",
    description: "Yo Maps' masterpiece studio album 'Try Again' which narrates resilience, passion, romance, and artistic evolution. Highly recommended listen.",
    archiveLink: "https://archive.org/download/sample-mp3-file/sample-4s.mp3",
    createdAt: "2026-04-01T15:00:00.000Z",
    tracks: [
      { title: "Intro (Dreams)", duration: "2:10" },
      { title: "Try Again ft. Abel Chungu", duration: "4:05" },
      { title: "Someone", duration: "3:45" },
      { title: "Aweah", duration: "3:30" },
      { title: "Fatima ft. Berita", duration: "4:12" },
      { title: "Luyando", duration: "3:58" }
    ]
  },
  {
    id: "song-7",
    title: "Tomboka",
    artist: "Slapdee",
    slug: "tomboka",
    views: "15,600",
    category: "Hip Hop",
    imageBase64: "https://picsum.photos/seed/tomboka/500/500",
    description: "Slapdee unleashes high-octane bars and an atmospheric beat on Tomboka, setting standard levels for quality street-rap in the modern era.",
    archiveLink: "https://archive.org/download/sample-mp3-file/sample-4s.mp3",
    createdAt: "2026-05-18T11:00:00.000Z",
  },
  {
    id: "song-8",
    title: "Alabalansa",
    artist: "Macky 2",
    slug: "alabalansa",
    views: "22,100",
    category: "Kalindula",
    imageBase64: "https://picsum.photos/seed/alabalansa/500/500",
    description: "Blending contemporary urban flows with classical Kalindula live instrumentations, Macky 2 sings about finding stability in times of chaos.",
    archiveLink: "https://archive.org/download/sample-mp3-file/sample-4s.mp3",
    createdAt: "2026-05-22T08:15:00.000Z",
  }
];
