export const NICHES = [
  { id: "scary_stories",      label: "Scary Stories",      icon: "👻", pexelsQuery: "dark forest horror night fog" },
  { id: "history",            label: "History",             icon: "🏛️", pexelsQuery: "ancient ruins historical monument" },
  { id: "historical_figures", label: "Historical Figures",  icon: "👑", pexelsQuery: "portrait vintage historical leader" },
  { id: "greek_mythology",    label: "Greek Mythology",     icon: "⚡", pexelsQuery: "ancient greece temple mythology" },
  { id: "finance",            label: "Finance & Money",     icon: "💰", pexelsQuery: "money wealth business success" },
  { id: "motivation",         label: "Motivation",          icon: "🔥", pexelsQuery: "motivation success achievement sport" },
  { id: "life_hacks",         label: "Life Hacks",          icon: "💡", pexelsQuery: "productivity lifestyle modern office" },
  { id: "true_crime",         label: "True Crime",          icon: "🔍", pexelsQuery: "crime mystery detective dark thriller" },
  { id: "science",            label: "Science Facts",       icon: "🔬", pexelsQuery: "science space universe technology" },
  { id: "custom",             label: "Custom",              icon: "✏️", pexelsQuery: "cinematic landscape nature" },
] as const;

export const ELEVENLABS_VOICES = [
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam",     gender: "Male",   description: "The well known voice of TikTok and Instagram" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh",     gender: "Male",   description: "The perfect storyteller, very realistic and natural" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella",    gender: "Female", description: "Soft and engaging, perfect for lifestyle content" },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel",   gender: "Female", description: "Calm and authoritative, great for educational content" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi",     gender: "Female", description: "Strong and confident for motivational content" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam",      gender: "Male",   description: "Energetic and dynamic, perfect for viral content" },
] as const;

export const ART_STYLES = [
  { id: "cinematic",    label: "Cinematic",    icon: "🎬", pexelsQuery: "cinematic landscape epic aerial drone" },
  { id: "dark_moody",   label: "Dark & Moody", icon: "🌑", pexelsQuery: "dark moody atmospheric fog night" },
  { id: "nature",       label: "Nature",       icon: "🌿", pexelsQuery: "nature forest waterfall mountains" },
  { id: "urban",        label: "Urban",        icon: "🏙️", pexelsQuery: "city urban street timelapse downtown" },
  { id: "abstract",     label: "Abstract",     icon: "🎨", pexelsQuery: "abstract art particles colorful motion" },
  { id: "vintage",      label: "Vintage",      icon: "📽️", pexelsQuery: "vintage retro old film historical" },
  { id: "space",        label: "Space",        icon: "🚀", pexelsQuery: "space galaxy stars universe cosmos" },
  { id: "ocean",        label: "Ocean",        icon: "🌊", pexelsQuery: "ocean waves underwater sea beach" },
] as const;

export const CAPTION_STYLES = [
  { id: "bold_stroke",    label: "Bold Stroke",    description: "Blanc · Contour noir épais" },
  { id: "red_highlight",  label: "Red Highlight",  description: "Rouge · Accrocheur" },
  { id: "sleek",          label: "Sleek",          description: "Blanc · Minimaliste" },
  { id: "majestic",       label: "Majestic",       description: "Or · Épique" },
  { id: "beast",          label: "Beast",          description: "Jaune · Style MrBeast" },
  { id: "elegant",        label: "Elegant",        description: "Blanc · Italique fin" },
  { id: "pixel",          label: "Pixel",          description: "Vert · Style gaming" },
  { id: "clarity",        label: "Clarity",        description: "Blanc · Ombre douce" },
] as const;

export const DURATIONS = [30, 45, 60, 90, 120] as const;

export const CREDIT_PACKS = [
  { id: "starter",   credits: 10,  price: 9,  priceId: process.env.STRIPE_PRICE_STARTER  ?? "" },
  { id: "pro",       credits: 50,  price: 29, priceId: process.env.STRIPE_PRICE_PRO      ?? "" },
  { id: "unlimited", credits: 200, price: 79, priceId: process.env.STRIPE_PRICE_UNLIMITED ?? "" },
] as const;
