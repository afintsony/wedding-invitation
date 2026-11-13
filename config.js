// ============================================================
//  Edit this file to change the date, venue and RSVP storage.
// ============================================================
window.WEDDING = {
  // Ceremony start / end. London in August is BST = UTC+01:00.
  startISO: "2025-08-15T16:30:00+01:00",
  endISO:   "2025-08-15T20:30:00+01:00",

  title: "Wedding of Elizabeth Stark & Christopher Jhonson",
  venueQuery: "Royal People Church, 958 Millanium Road, London, United Kingdom",

  shareText: "You are invited to the wedding of Elizabeth Stark & Christopher Jhonson.",
  whatsappText:
    "💍 You're invited!\nWedding of Elizabeth Stark & Christopher Jhonson\n📅 Friday, 15 August 2025 at 4:30 PM\n📍 Royal People Church, London",

  // Optional: store RSVPs in Supabase. Leave empty for demo mode
  // (replies are then saved only in the visitor's own browser).
  supabaseUrl: "",      // e.g. "https://xxxx.supabase.co"
  supabaseAnonKey: "",  // the public "anon" key
  supabaseTable: "rsvps",

  // Gallery photos (files in the images/ folder)
  gallery: [
    { src: "images/embrace.webp", alt: "Elizabeth and Christopher embracing" },
    { src: "images/lake.webp",    alt: "The couple on a lakeside dock" },
    { src: "images/bouquet.webp", alt: "The bride holding a bouquet of white flowers" },
    { src: "images/dress.webp",   alt: "The bride's gown flowing on the dock" },
    { src: "images/couple.webp",  alt: "Elizabeth and Christopher, full portrait" }
  ]
};
