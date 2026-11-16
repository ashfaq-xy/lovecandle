// EDIT: your business details (all placeholders until you fill them)
export const site = {
  whatsapp: "918826069662", // country code + number, no + or spaces
  email: "jakharisha766@gmail.com",
  instagram: "https://instagram.com/lovecandle.in",
  announcements: ["Discover the art of fragrance", "Thoughtful gifting, beautifully scented"],
};
export const wa = (t: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t)}`;
