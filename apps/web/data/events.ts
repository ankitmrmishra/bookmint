export type EventCategory = "Comedy" | "Movies" | "Concert" | "Theatre" | "Sports"

export type Event = {
  id: string
  title: string
  category: EventCategory
  date: string
  time: string
  venue: string
  city: string
  price: number
  rating: number // 0-5
  image: string
  description: string
  tags: string[]
  initialLikes?: number
  initialComments?: Array<{ author: string; text: string }>
}

export const events: Event[] = [
  {
    id: "c1",
    title: "Late Night Laughter with Ava Quinn",
    category: "Comedy",
    date: "2025-11-02",
    time: "20:00",
    venue: "The Black Box",
    city: "New York",
    price: 39,
    rating: 4.7,
    image: "/premium-comedy-stage.jpg",
    description:
      "Ava Quinn brings an hour of razor-sharp wit and stories you cannot hear anywhere else. An intimate evening of premium stand-up.",
    tags: ["standup", "late-night", "intimate"],
    initialLikes: 132,
    initialComments: [
      { author: "Jordan", text: "Ava’s timing is unreal. Laughed all night." },
      { author: "Sam", text: "Small room, big laughs. Worth it." },
    ],
  },
  {
    id: "m1",
    title: "Midnight Noir: Director’s Cut",
    category: "Movies",
    date: "2025-10-30",
    time: "23:30",
    venue: "Velvet Cinema",
    city: "Los Angeles",
    price: 22,
    rating: 4.5,
    image: "/noir-cinema-premium.jpg",
    description: "Exclusive screening of a restored noir classic with a post-show talk from the restoration team.",
    tags: ["noir", "classic", "screening"],
    initialLikes: 89,
    initialComments: [{ author: "Priya", text: "Pristine restoration. Stunning shadows." }],
  },
  {
    id: "cn1",
    title: "Monochrome Sessions: Live in Concert",
    category: "Concert",
    date: "2025-12-05",
    time: "19:30",
    venue: "Hall Eleven",
    city: "Chicago",
    price: 79,
    rating: 4.9,
    image: "/concert-premium-stage-lights.jpg",
    description: "An immersive, stripped-back sonic journey. Minimal visuals, maximal sound. Seats are limited.",
    tags: ["live", "intimate", "sessions"],
    initialLikes: 245,
    initialComments: [{ author: "Lee", text: "Pure sound. Goosebumps." }],
  },
  {
    id: "t1",
    title: "Curtain Call: A Minimalist Play",
    category: "Theatre",
    date: "2025-11-12",
    time: "18:30",
    venue: "Stage 4",
    city: "London",
    price: 55,
    rating: 4.3,
    image: "/minimalist-theatre-stage.jpg",
    description: "A modern play told in stark black and white. A meditation on choice and consequence.",
    tags: ["drama", "minimal", "modern"],
    initialLikes: 61,
    initialComments: [{ author: "Marta", text: "Haunting and beautifully sparse." }],
  },
  {
    id: "s1",
    title: "Night Match: Finals Under Lights",
    category: "Sports",
    date: "2025-10-28",
    time: "21:00",
    venue: "Arena North",
    city: "Berlin",
    price: 120,
    rating: 4.6,
    image: "/premium-night-stadium.jpg",
    description: "Elite teams clash under floodlights. Black-and-white kit special—limited edition.",
    tags: ["finals", "night", "elite"],
    initialLikes: 173,
    initialComments: [{ author: "Omar", text: "Electric atmosphere. Instant classic." }],
  },
]

export function getEventById(id: string) {
  return events.find((e) => e.id === id)
}
