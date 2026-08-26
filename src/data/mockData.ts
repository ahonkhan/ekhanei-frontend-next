import { Category, Product, Store, CategoryDetailMeta, LocationItem } from '@/types';

// ============================================================================
// 1. SAVED LOCATIONS
// ============================================================================
export const LOCATIONS: LocationItem[] = [
  {
    id: "loc1",
    title: "ভেন্ডাবাড়ী",
    address: "F6W3+38 ভেন্ডাবাড়ী, Bangladesh",
    type: "home",
    isSelected: true
  },
  {
    id: "loc2",
    title: "Office",
    address: "Level 4, IT Park Tower, Park Road, Rangpur",
    type: "office",
    isSelected: false
  },
  {
    id: "loc3",
    title: "Parents' House",
    address: "College Para, Station Road, Rangpur",
    type: "other",
    isSelected: false
  },
  {
    id: "loc4",
    title: "Dhaka Central",
    address: "Block B, Bashundhara R/A, Dhaka",
    type: "other",
    isSelected: false
  }
];

// ============================================================================
// 2. SERVICE CATEGORIES (9 SERVICES)
// ============================================================================
export const CATEGORIES: Category[] = [
  {
    id: "fresh-fish",
    name: "Fresh Fish",
    icon: "Fish",
    image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=400&q=80",
    bg: "bg-cyan-50 text-cyan-700 border-cyan-100",
    iconBg: "bg-cyan-100/90 text-cyan-700",
    itemCount: "Daily Catch",
    badge: "River Fresh"
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80",
    bg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    iconBg: "bg-indigo-100/90 text-indigo-700",
    itemCount: "Trendy Wear",
    badge: "New Styles"
  },
  {
    id: "gadget-electronics",
    name: "Gadget & Electronics",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    bg: "bg-blue-50 text-blue-700 border-blue-100",
    iconBg: "bg-blue-100/90 text-blue-700",
    itemCount: "Mobiles & Tech",
    badge: "Top Deals"
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: "Pill",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconBg: "bg-emerald-100/90 text-emerald-700",
    itemCount: "Instant Delivery",
    badge: "24/7 Meds"
  },
  {
    id: "grocery",
    name: "Grocery & Essentials",
    icon: "ShoppingCart",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    bg: "bg-teal-50 text-teal-700 border-teal-100",
    iconBg: "bg-teal-100/90 text-teal-700",
    itemCount: "Staples & Needs",
    badge: "Best Price"
  },
  {
    id: "cake-bakery",
    name: "Cake & Bakery",
    icon: "Cake",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    bg: "bg-amber-50 text-amber-700 border-amber-100",
    iconBg: "bg-amber-100/90 text-amber-700",
    itemCount: "Fresh Baked",
    badge: "Delights"
  },
  {
    id: "food",
    name: "Restaurant & Food",
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
    bg: "bg-rose-50 text-rose-700 border-rose-100",
    iconBg: "bg-rose-100/90 text-rose-700",
    itemCount: "Hot & Fresh",
    badge: "20 min"
  },
  {
    id: "gas-cylinder",
    name: "Gas Cylinder",
    icon: "Flame",
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80",
    bg: "bg-orange-50 text-orange-700 border-orange-100",
    iconBg: "bg-orange-100/90 text-orange-700",
    itemCount: "12kg / 35kg",
    badge: "Express Refill"
  },
  {
    id: "ready-to-cook",
    name: "Ready To Cook",
    icon: "ChefHat",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    bg: "bg-lime-50 text-lime-700 border-lime-100",
    iconBg: "bg-lime-100/90 text-lime-700",
    itemCount: "Marinated & Cut",
    badge: "Quick Cook"
  }
];

// ============================================================================
// 3. HOME HERO BANNER SLIDES
// ============================================================================
export const HERO_SLIDES = [
  {
    id: "slide-1",
    title: "Fresh Padma Hilsha & Catch of the Day",
    subtitle: "Directly sourced from river Padma to Rangpur Sadar doorstep in 20 mins",
    ctaText: "Shop Fresh Catch",
    badge: "⚡ 20 MIN EXPRESS",
    gradient: "from-cyan-900/90 via-slate-900/80 to-slate-950/90",
    accentColor: "text-cyan-400",
    image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "slide-2",
    title: "Trendy Fashion & Festive Apparel Collection",
    subtitle: "Get up to 60% OFF on top designer brands with instant doorstep try-on",
    ctaText: "Explore Collection",
    badge: "🔥 TRENDING NOW",
    gradient: "from-purple-900/90 via-slate-900/80 to-slate-950/90",
    accentColor: "text-pink-400",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "slide-3",
    title: "Daily Grocery & Supermarket Essentials",
    subtitle: "Farm fresh organic vegetables, rice, lentils & daily needs at best prices",
    ctaText: "Order Grocery",
    badge: "🎁 BEST PRICE GUARANTEE",
    gradient: "from-emerald-900/90 via-slate-900/80 to-slate-950/90",
    accentColor: "text-emerald-400",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
  }
];

// ============================================================================
// 4. SERVICE-WISE CATEGORY DETAILS METADATA (JSON FOR ALL 9 SERVICES)
// ============================================================================
export const CATEGORY_DETAILS_DATA: Record<string, CategoryDetailMeta> = {
  "fresh-fish": {
    title: "Fresh Fish & Seafood",
    heroSlides: [
      "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব মাছ", image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=300&q=80" },
      { id: "river-fish", name: "নদীর তাজা মাছ", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=300&q=80" },
      { id: "prawn", name: "খাঁটি গলদা ও বাগদা", image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=300&q=80" },
      { id: "sea-fish", name: "সামুদ্রিক মাছ", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80" },
      { id: "dry-fish", name: "শুঁটকি মাছ", image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=300&q=80" }
    ],
    specialOffers: [
      {
        id: "fish-off-1",
        title: "তাজা মাছের অফার",
        subtitle: "প্রতি কেজিতে ৫০ টাকা ছাড়",
        image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "fish-off-2",
        title: "সুন্দরবনের খাঁটি চিংড়ি",
        subtitle: "এক্সপোর্ট কোয়ালিটি সাইজ",
        image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "b1", name: "Padma Fisheries", logo: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=200&q=80" },
      { id: "b2", name: "Meghna Fresh", logo: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=200&q=80" },
      { id: "b3", name: "Sundarbans Gold", logo: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=200&q=80" },
      { id: "b4", name: "Sea Catch Express", logo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "fashion": {
    title: "Fashion & Apparel",
    heroSlides: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব কালেকশন", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&q=80" },
      { id: "beauty", name: "Beauty Items", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80" },
      { id: "charm", name: "Endless Charm", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=300&q=80" },
      { id: "royalty", name: "Little Royalty", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80" },
      { id: "style", name: "Style Perfect", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80" },
      { id: "time", name: "Classic Time", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80" }
    ],
    specialOffers: [
      {
        id: "fash-off-1",
        title: "আজকের ফ্যাশন অফার",
        subtitle: "সর্বোচ্চ ৬০% পর্যন্ত ছাড়",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "fash-off-2",
        title: "প্রিমিয়াম লেদার কালেকশন",
        subtitle: "বাই ১ গেট ১ ফ্রি ডিল",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "fb1", name: "Brand 1", logo: "https://d62ipmwrm4ymk.cloudfront.net/brand/12b2b955-a7ac-49e3-97a0-93718b799301.png" },
      { id: "fb2", name: "Brand 2", logo: "https://d62ipmwrm4ymk.cloudfront.net/brand/24d74c81-ca61-4d91-b2fe-418f13f0b122.jpg" },
      { id: "fb3", name: "Brand 3", logo: "https://d62ipmwrm4ymk.cloudfront.net/top_brand/3e2e80e3-f836-4ee2-92e9-f48921808ebb.png" },
      { id: "fb4", name: "Brand 4", logo: "https://d62ipmwrm4ymk.cloudfront.net/top_brand/b3c73ece-00a9-41cc-a960-ce8685490ee9.jpg" }
    ]
  },
  "gadget-electronics": {
    title: "Gadgets & Electronics",
    heroSlides: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব গ্যাজেট" },
      { id: "audio", name: "Headphones & Audio" },
      { id: "smartwatches", name: "Smartwatches" },
      { id: "chargers", name: "Power & Cables" }
    ],
    specialOffers: [
      {
        id: "gad-off-1",
        title: "ওয়্যারলেস হেডফোন স্পেশাল",
        subtitle: "৳৫০০ টাকা ইন্সট্যান্ট ফ্ল্যাট ডিসকাউন্ট",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "gad-off-2",
        title: "স্মার্টওয়াচ ধামাকা সেল",
        subtitle: "অরিজিনাল ওয়ারেন্টিসহ ২৫% ছাড়",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "gb1", name: "Samsung", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80" },
      { id: "gb2", name: "Xiaomi", logo: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80" },
      { id: "gb3", name: "Realme", logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80" },
      { id: "gb4", name: "Anker Gadgets", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "pharmacy": {
    title: "Pharmacy & Healthcare",
    heroSlides: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব ওষুধ" },
      { id: "otc", name: "OTC Medicines" },
      { id: "baby", name: "Baby & Care" },
      { id: "firstaid", name: "First Aid & Wellness" }
    ],
    specialOffers: [
      {
        id: "pharm-off-1",
        title: "জরুরি ওষুধ হোম ডেলিভারি",
        subtitle: "১০ থেকে ২০ মিনিটে হোম ডেলিভারি",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "pb1", name: "Square Pharma", logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80" },
      { id: "pb2", name: "Beximco Meds", logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=200&q=80" },
      { id: "pb3", name: "Incepta Health", logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "grocery": {
    title: "Grocery & Supermarket",
    heroSlides: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব মুদি পন্য" },
      { id: "rice", name: "চাল ও ডাল" },
      { id: "oil", name: "তেল ও মশলা" },
      { id: "snacks", name: "স্ন্যাকস ও বিস্কুট" }
    ],
    specialOffers: [
      {
        id: "groc-off-1",
        title: "আজকের বাজার সেরা মূল্যে",
        subtitle: "মিনিকেট চালে ১০০ টাকা ক্যাশব্যাক",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "grb1", name: "ACI Pure", logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80" },
      { id: "grb2", name: "Fresh Grocery", logo: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80" },
      { id: "grb3", name: "Rupchanda Oil", logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "cake-bakery": {
    title: "Cake & Bakery Delights",
    heroSlides: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব কেক ও বেকারি" },
      { id: "choc", name: "চকলেট কেক" },
      { id: "pastry", name: "পেস্ট্রি ও পাই" },
      { id: "bread", name: "তাজা ব্রেড" }
    ],
    specialOffers: [
      {
        id: "cake-off-1",
        title: "বার্থডে কেক বিশেষ ছাড়",
        subtitle: "আজকের যেকোনো অর্ডারে ১৫% ফ্রী ডিসকাউন্ট",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "cb1", name: "Tastebud Bakery", logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80" },
      { id: "cb2", name: "Cooper's Crafts", logo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "food": {
    title: "Restaurant & Delicious Food",
    heroSlides: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব খাবার" },
      { id: "biryani", name: "কাচ্চি ও বিরিয়ানি" },
      { id: "grill", name: "গ্রিল ও নান" },
      { id: "burger", name: "বার্গার ও ফাস্টফুড" }
    ],
    specialOffers: [
      {
        id: "food-off-1",
        title: "সুলতান'স দিন কাচ্চি স্পেশাল",
        subtitle: "প্রতি প্ল্যাটারে ফ্রি বোরহানি ও ফিন্নি",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "foodb1", name: "Sultan's Dine", logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80" },
      { id: "foodb2", name: "KFC Express", logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "gas-cylinder": {
    title: "LPG Gas Cylinder Delivery",
    heroSlides: [
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব গ্যাস সিলিন্ডার" },
      { id: "12kg", name: "১২ কেজি রিফিল" },
      { id: "35kg", name: "৩৫ কেজি কমার্শিয়াল" }
    ],
    specialOffers: [
      {
        id: "gas-off-1",
        title: "জরুরি গ্যাস সিলিন্ডার ডেলিভারি",
        subtitle: "২০ মিনিটের মধ্যে ফ্রি ইনস্টলেশন সার্ভিস",
        image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "gasb1", name: "Bashundhara LP Gas", logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80" },
      { id: "gasb2", name: "Omera LP Gas", logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80" },
      { id: "gasb3", name: "BM LP Gas", logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "ready-to-cook": {
    title: "Ready To Cook Prepped Food",
    heroSlides: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব রেডি টু কুক" },
      { id: "chicken", name: "ম্যারিনেটেড চিকেন" },
      { id: "veggies", name: "কাটা ধোয়া সবজি" },
      { id: "fishcut", name: "কাটা রেডি মাছ" }
    ],
    specialOffers: [
      {
        id: "rtc-off-1",
        title: "রেডি ম্যারিনেটেড চিকেন ফ্রাই",
        subtitle: "সরাসরি তেলে ভাজুন ৫ মিনিটে",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "rtcb1", name: "Kazi Farms Kitchen", logo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80" },
      { id: "rtcb2", name: "CP Five Star", logo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80" }
    ]
  }
};

// ============================================================================
// 5. STORES DATA (WITH VERIFIED SVG BADGES & CATEGORIES)
// ============================================================================
export const STORES: Store[] = [
  {
    id: "s1",
    name: "Sultan's Dine & Grill",
    category: "Restaurant & Food",
    rating: 4.9,
    reviewsCount: 1240,
    deliveryTime: "25–35 min",
    distance: "1.2 km",
    offer: "20% OFF",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    tags: ["Kacchi", "Traditional", "Biryani"]
  },
  {
    id: "s2",
    name: "Padma Fisheries & Seafood",
    category: "Fresh Fish",
    rating: 4.9,
    reviewsCount: 940,
    deliveryTime: "15–25 min",
    distance: "0.8 km",
    offer: "Fresh River Catch",
    coverImage: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    tags: ["Hilsha", "Prawns", "Rui", "Katla"]
  },
  {
    id: "s3",
    name: "Yellow Fashion Outlet",
    category: "Fashion",
    rating: 4.8,
    reviewsCount: 1560,
    deliveryTime: "20–30 min",
    distance: "1.5 km",
    offer: "Up to 50% OFF",
    coverImage: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    tags: ["Beauty", "Dresses", "Men", "Women"]
  },
  {
    id: "s4",
    name: "Lazz Pharma Express",
    category: "Pharmacy",
    rating: 5.0,
    reviewsCount: 3100,
    deliveryTime: "10–20 min",
    distance: "0.5 km",
    offer: "24/7 Open",
    coverImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    tags: ["Medicine", "Baby Care", "Wellness"]
  },
  {
    id: "s5",
    name: "Gadget World Rangpur",
    category: "Gadget & Electronics",
    rating: 4.8,
    reviewsCount: 880,
    deliveryTime: "20–30 min",
    distance: "1.1 km",
    offer: "Flat ৳500 Cashback",
    coverImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    tags: ["Headphones", "Smartwatch", "Gadgets"]
  },
  {
    id: "s6",
    name: "Bengal Super Mart",
    category: "Grocery & Essentials",
    rating: 4.7,
    reviewsCount: 2400,
    deliveryTime: "15–25 min",
    distance: "1.0 km",
    offer: "Free Delivery",
    coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    tags: ["Rice", "Oil", "Lentils", "Spices"]
  }
];

// ============================================================================
// 6. ALL PRODUCTS (CATEGORIZED PRODUCTS FOR ALL SERVICES)
// ============================================================================
export const PRODUCTS: Product[] = [
  // --------------------------------------------------------------------------
  // FRESH FISH
  // --------------------------------------------------------------------------
  {
    id: "fish-1",
    name: "Padma Hilsha Whole (1.2kg)",
    categoryId: "fresh-fish",
    categoryName: "Fresh Fish",
    price: 1850,
    oldPrice: 2100,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 320,
    storeName: "Padma Fisheries",
    discountBadge: "12% OFF",
    isPopular: true
  },
  {
    id: "fish-2",
    name: "Sundarbans Gold Jumbo Prawn",
    categoryId: "fresh-fish",
    categoryName: "Fresh Fish",
    price: 1450,
    oldPrice: 1650,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviewsCount: 210,
    storeName: "Meghna Fisheries",
    discountBadge: "৳200 OFF",
    isPopular: true
  },
  {
    id: "fish-3",
    name: "Fresh River Rui Fish (2kg size)",
    categoryId: "fresh-fish",
    categoryName: "Fresh Fish",
    price: 480,
    oldPrice: 550,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviewsCount: 180,
    storeName: "Padma Fisheries",
    discountBadge: "Fresh Cut"
  },
  {
    id: "fish-4",
    name: "Live Telapia Catch",
    categoryId: "fresh-fish",
    categoryName: "Fresh Fish",
    price: 260,
    oldPrice: 300,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    reviewsCount: 140,
    storeName: "Bay of Bengal Sea-Food"
  },

  // --------------------------------------------------------------------------
  // FASHION (Pink Gradient Cards Format: Shop Under, Price, Title)
  // --------------------------------------------------------------------------
  {
    id: "fash-1",
    name: "Beauty Items Glow Collection",
    categoryId: "fashion",
    categoryName: "Fashion",
    price: 999,
    oldPrice: 1499,
    unit: "set",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 410,
    storeName: "Yellow Fashion",
    discountBadge: "Shop Under ৳999",
    isPopular: true
  },
  {
    id: "fash-2",
    name: "Endless Charm Black Dress",
    categoryId: "fashion",
    categoryName: "Fashion",
    price: 2500,
    oldPrice: 3200,
    unit: "pcs",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviewsCount: 290,
    storeName: "Aarong Outlet",
    discountBadge: "Shop Under ৳2500",
    isPopular: true
  },
  {
    id: "fash-3",
    name: "Little Royalty Festive Frock",
    categoryId: "fashion",
    categoryName: "Fashion",
    price: 1999,
    oldPrice: 2499,
    unit: "pcs",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 180,
    storeName: "Sailor Kids",
    discountBadge: "Shop Under ৳1999"
  },
  {
    id: "fash-4",
    name: "Style Perfect Casual Shirt",
    categoryId: "fashion",
    categoryName: "Fashion",
    price: 1499,
    oldPrice: 1899,
    unit: "pcs",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviewsCount: 220,
    storeName: "Yellow Men"
  },
  {
    id: "fash-5",
    name: "Classic Time Leather Watch",
    categoryId: "fashion",
    categoryName: "Fashion",
    price: 950,
    oldPrice: 1350,
    unit: "pcs",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviewsCount: 510,
    storeName: "Apex Accessories"
  },
  {
    id: "fash-6",
    name: "Extra Sparkle Gold Ring",
    categoryId: "fashion",
    categoryName: "Fashion",
    price: 2000,
    oldPrice: 2800,
    unit: "pcs",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 150,
    storeName: "Aarong Jewelry"
  },

  // --------------------------------------------------------------------------
  // GADGET & ELECTRONICS
  // --------------------------------------------------------------------------
  {
    id: "gad-1",
    name: "Wireless ANC Bluetooth Headphones",
    categoryId: "gadget-electronics",
    categoryName: "Gadget & Electronics",
    price: 2450,
    oldPrice: 3200,
    unit: "pcs",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviewsCount: 520,
    storeName: "Gadget World",
    discountBadge: "৳750 OFF",
    isPopular: true
  },
  {
    id: "gad-2",
    name: "Smart Watch Series 8 Fitness Tracker",
    categoryId: "gadget-electronics",
    categoryName: "Gadget & Electronics",
    price: 3200,
    oldPrice: 4200,
    unit: "pcs",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 680,
    storeName: "Xiaomi Express",
    discountBadge: "Top Selling",
    isPopular: true
  },
  {
    id: "gad-3",
    name: "20000mAh Fast Charging Power Bank",
    categoryId: "gadget-electronics",
    categoryName: "Gadget & Electronics",
    price: 1650,
    oldPrice: 1990,
    unit: "pcs",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviewsCount: 310,
    storeName: "Anker Gadgets"
  },

  // --------------------------------------------------------------------------
  // PHARMACY
  // --------------------------------------------------------------------------
  {
    id: "pharm-1",
    name: "Napa Extra 500mg (100 Tabs Box)",
    categoryId: "pharmacy",
    categoryName: "Pharmacy",
    price: 250,
    oldPrice: 280,
    unit: "box",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    rating: 5.0,
    reviewsCount: 1400,
    storeName: "Lazz Pharma Express",
    discountBadge: "Instant 24/7",
    isPopular: true
  },
  {
    id: "pharm-2",
    name: "First Aid Safety & Bandage Kit",
    categoryId: "pharmacy",
    categoryName: "Pharmacy",
    price: 450,
    oldPrice: 550,
    unit: "kit",
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 380,
    storeName: "Lazz Pharma Express"
  },

  // --------------------------------------------------------------------------
  // GROCERY & ESSENTIALS
  // --------------------------------------------------------------------------
  {
    id: "groc-1",
    name: "Miniket Premium Rice (5kg Bag)",
    categoryId: "grocery",
    categoryName: "Grocery & Essentials",
    price: 410,
    oldPrice: 450,
    unit: "bag",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviewsCount: 890,
    storeName: "Bengal Super Mart",
    isPopular: true
  },
  {
    id: "groc-2",
    name: "Pure Soyabean Cooking Oil (5L)",
    categoryId: "grocery",
    categoryName: "Grocery & Essentials",
    price: 840,
    oldPrice: 910,
    unit: "can",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 1120,
    storeName: "Bengal Super Mart",
    isPopular: true
  },

  // --------------------------------------------------------------------------
  // CAKE & BAKERY
  // --------------------------------------------------------------------------
  {
    id: "cake-1",
    name: "Rich Chocolate Fudge Birthday Cake (1kg)",
    categoryId: "cake-bakery",
    categoryName: "Cake & Bakery",
    price: 1250,
    oldPrice: 1450,
    unit: "pcs",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 650,
    storeName: "Tastebud Bakery",
    isPopular: true
  },
  {
    id: "cake-2",
    name: "Fresh Butter Croissant & Pastry Set",
    categoryId: "cake-bakery",
    categoryName: "Cake & Bakery",
    price: 320,
    oldPrice: 380,
    unit: "box",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviewsCount: 290,
    storeName: "Cooper's Crafts"
  },

  // --------------------------------------------------------------------------
  // RESTAURANT & FOOD
  // --------------------------------------------------------------------------
  {
    id: "food-1",
    name: "Sultan's Kacchi Biryani Full Platter",
    categoryId: "food",
    categoryName: "Restaurant & Food",
    price: 380,
    oldPrice: 420,
    unit: "platter",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 2100,
    storeName: "Sultan's Dine & Grill",
    discountBadge: "Hot & Fresh",
    isPopular: true
  },
  {
    id: "food-2",
    name: "Smokey BBQ Chicken Burger Combo",
    categoryId: "food",
    categoryName: "Restaurant & Food",
    price: 290,
    oldPrice: 350,
    unit: "combo",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviewsCount: 940,
    storeName: "KFC Express",
    isPopular: true
  },

  // --------------------------------------------------------------------------
  // GAS CYLINDER
  // --------------------------------------------------------------------------
  {
    id: "gas-1",
    name: "Bashundhara LPG 12kg Refill Cylinder",
    categoryId: "gas-cylinder",
    categoryName: "Gas Cylinder",
    price: 1450,
    oldPrice: 1550,
    unit: "cylinder",
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80",
    rating: 5.0,
    reviewsCount: 1800,
    storeName: "Bashundhara Gas Depot",
    discountBadge: "Free Install",
    isPopular: true
  },

  // --------------------------------------------------------------------------
  // READY TO COOK
  // --------------------------------------------------------------------------
  {
    id: "rtc-1",
    name: "Spicy Marinated Crispy Chicken Cuts (1kg)",
    categoryId: "ready-to-cook",
    categoryName: "Ready To Cook",
    price: 490,
    oldPrice: 560,
    unit: "pack",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviewsCount: 410,
    storeName: "Kazi Farms Kitchen",
    discountBadge: "Ready 5-Min",
    isPopular: true
  }
];
