// EDIT: website copy that needs YOUR input. Nothing here is invented.
// While a list is empty, the related section either hides or shows a clearly marked placeholder.

// Set to false at launch to hide every dashed "placeholder" note on public pages.
export const showPlaceholders = true;

// Genuine customer words only. Leave empty until you have real ones; the section stays hidden.
// Example: { quote: "…", name: "Customer name", place: "City" }
export type Testimonial = { quote: string; name: string; place?: string };
export const testimonials: Testimonial[] = [];

// Your story, in your own words: one string per paragraph. Used on /our-story.
export const founderStory: string[] = [];
export const philosophy: string[] = [];

// Gifting occasions (each opens a prefilled WhatsApp enquiry).
export const occasions = [
  { name: "Birthday", line: "Make the day glow" },
  { name: "Anniversary", line: "Something romantic" },
  { name: "Wedding", line: "For the new home" },
  { name: "Housewarming", line: "A warm welcome" },
  { name: "Festive", line: "Light up the season" },
];

// General candle-care and safety guidance (standard practice, not product claims). Review before launch.
export const careTips = [
  "Let the first burn last long enough for the whole top layer of wax to melt. This helps the candle burn evenly.",
  "Trim the wick to about 5 mm (¼ inch) before each burn.",
  "Keep the candle on a heat-safe surface, away from draughts, curtains and children. Never leave a burning candle unattended.",
];
