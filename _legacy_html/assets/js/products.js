/**
 * Mock Data Repository for Hyperlocal Marketplace
 * Products, Stores, Categories, Hero Slides, Reviews, and Locations
 */

const CATEGORIES = [
  {
    id: "fresh-fish",
    name: "Fresh Fish",
    icon: "fa-fish-fins",
    image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=400&q=80",
    bg: "bg-cyan-50 text-cyan-700 border-cyan-100",
    iconBg: "bg-cyan-100/90 text-cyan-700",
    itemCount: "Daily Catch",
    badge: "River Fresh"
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "fa-shirt",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80",
    bg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    iconBg: "bg-indigo-100/90 text-indigo-700",
    itemCount: "Trendy Wear",
    badge: "New Styles"
  },
  {
    id: "gadget-electronics",
    name: "Gadget & Electronics",
    icon: "fa-mobile-screen-button",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    bg: "bg-blue-50 text-blue-700 border-blue-100",
    iconBg: "bg-blue-100/90 text-blue-700",
    itemCount: "Mobiles & Tech",
    badge: "Top Deals"
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: "fa-capsules",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    iconBg: "bg-emerald-100/90 text-emerald-700",
    itemCount: "Instant Delivery",
    badge: "24/7 Meds"
  },
  {
    id: "grocery",
    name: "Grocery & Essentials",
    icon: "fa-cart-shopping",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    bg: "bg-teal-50 text-teal-700 border-teal-100",
    iconBg: "bg-teal-100/90 text-teal-700",
    itemCount: "Staples & Needs",
    badge: "Best Price"
  },
  {
    id: "cake-bakery",
    name: "Cake & Bakery",
    icon: "fa-cake-candles",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    bg: "bg-amber-50 text-amber-700 border-amber-100",
    iconBg: "bg-amber-100/90 text-amber-700",
    itemCount: "Fresh Baked",
    badge: "Delights"
  },
  {
    id: "food",
    name: "Restaurant & Food",
    icon: "fa-utensils",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
    bg: "bg-rose-50 text-rose-700 border-rose-100",
    iconBg: "bg-rose-100/90 text-rose-700",
    itemCount: "Hot & Fresh",
    badge: "20 min"
  },
  {
    id: "gas-cylinder",
    name: "Gas Cylinder",
    icon: "fa-fire-flame-curved",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
    bg: "bg-orange-50 text-orange-700 border-orange-100",
    iconBg: "bg-orange-100/90 text-orange-700",
    itemCount: "Express Refill",
    badge: "Safe Home"
  },
  {
    id: "ready-to-cook",
    name: "Ready-to-Cook",
    icon: "fa-bowl-rice",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80",
    bg: "bg-purple-50 text-purple-700 border-purple-100",
    iconBg: "bg-purple-100/90 text-purple-700",
    itemCount: "Instant Prep",
    badge: "Quick Meals"
  }
];

const QUICK_ACTIONS = [
  { id: "free-del", label: "Free Delivery", icon: "fa-truck-fast", badge: "Orders over ৳350", color: "from-emerald-500 to-teal-600" },
  { id: "flash", label: "Flash Deals", icon: "fa-bolt", badge: "Up to 50% OFF", color: "from-amber-500 to-orange-600" },
  { id: "nearby", label: "Nearby Stores", icon: "fa-store", badge: "Within 2 km", color: "from-blue-500 to-indigo-600" },
  { id: "top-rated", label: "Top Rated", icon: "fa-star", badge: "4.8★ Above", color: "from-purple-500 to-pink-600" },
  { id: "new-stores", label: "New Stores", icon: "fa-sparkles", badge: "Fresh on platform", color: "from-rose-500 to-red-600" }
];

const HERO_SLIDES = [
  {
    id: 1,
    badge: "🔥 Super Savings Weekend",
    title: "Fresh Organic Grocery & Meals Delivered to Your Door",
    subtitle: "Get up to 30% instant discount on your everyday staples & favorite restaurants near Rangpur Sadar.",
    ctaText: "Order Now",
    ctaLink: "#popular-items",
    bgGradient: "from-slate-900 via-emerald-950 to-slate-900",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    tag: "30% OFF"
  },
  {
    id: 2,
    badge: "⚡ 20-Minute Express Delivery",
    title: "Craving Authentic Biryani & Local Food Delights?",
    subtitle: "Hot, mouth-watering local specials from top-rated kitchens around you with guaranteed speed.",
    ctaText: "Explore Foods",
    ctaLink: "#popular-stores",
    bgGradient: "from-slate-900 via-amber-950 to-slate-900",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80",
    tag: "FREE DELIVERY"
  },
  {
    id: 3,
    badge: "💊 24/7 Essential Medicine & Baby Care",
    title: "Genuine Pharmacy & Healthcare Supplies at Home",
    subtitle: "Upload your prescription or choose everyday wellness products with trusted pharmacist check.",
    ctaText: "Order Medicine",
    ctaLink: "#popular-items",
    bgGradient: "from-slate-900 via-blue-950 to-slate-900",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80",
    tag: "100% GENUINE"
  }
];

const PRODUCTS = [
  {
    id: "p1",
    name: "Kacchi Biryani Special Box",
    category: "food",
    storeId: "s1",
    storeName: "Sultan's Dine & Grill",
    rating: 4.9,
    reviewsCount: 342,
    price: 340,
    oldPrice: 420,
    discount: "19% OFF",
    unit: "1 Plate + Borhani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    isFlashDeal: false,
    isRecommended: true,
    isBestSeller: true,
    badge: "Best Seller"
  },
  {
    id: "p2",
    name: "Fresh Padma Hilsha (Ilish) 1kg+",
    category: "fresh-fish",
    storeId: "s2",
    storeName: "Rangpur Agro Fresh",
    rating: 4.9,
    reviewsCount: 289,
    price: 1250,
    oldPrice: 1450,
    discount: "14% OFF",
    unit: "1 Whole Fish (~1.1kg)",
    image: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    isFlashDeal: true,
    flashStock: 45,
    isRecommended: true,
    isBestSeller: true,
    badge: "River Fresh"
  },
  {
    id: "p3",
    name: "Pure Mustard Oil (Radhuni)",
    category: "grocery",
    storeId: "s3",
    storeName: "Bengal Super Mart",
    rating: 4.7,
    reviewsCount: 210,
    price: 290,
    oldPrice: 320,
    discount: "9% OFF",
    unit: "1 Litre bottle",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    isFlashDeal: false,
    isRecommended: false,
    isBestSeller: true,
    badge: "Staple"
  },
  {
    id: "p4",
    name: "Rich Chocolate Fudge Birthday Cake",
    category: "cake-bakery",
    storeId: "s4",
    storeName: "The Artisan Bakery",
    rating: 4.9,
    reviewsCount: 195,
    price: 650,
    oldPrice: 780,
    discount: "17% OFF",
    unit: "1 lb Fresh Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    isFlashDeal: true,
    flashStock: 25,
    isRecommended: true,
    isBestSeller: true,
    badge: "Fresh Baked"
  },
  {
    id: "p5",
    name: "Paracetamol 500mg Extra",
    category: "pharmacy",
    storeId: "s5",
    storeName: "Lazz Pharma Express",
    rating: 5.0,
    reviewsCount: 412,
    price: 35,
    oldPrice: 40,
    discount: "12% OFF",
    unit: "1 Strip (10 tabs)",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    isFlashDeal: false,
    isRecommended: true,
    isBestSeller: true,
    badge: "OTC Med"
  },
  {
    id: "p6",
    name: "Bashundhara LPG Gas Cylinder Refill",
    category: "gas-cylinder",
    storeId: "s3",
    storeName: "Bengal Super Mart",
    rating: 4.9,
    reviewsCount: 510,
    price: 1420,
    oldPrice: 1550,
    discount: "8% OFF",
    unit: "12.5 kg Refill Cylinder",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    isFlashDeal: false,
    isRecommended: true,
    isBestSeller: true,
    badge: "Express Refill"
  },
  {
    id: "p7",
    name: "Marinated Spicy Chicken Fry Kit",
    category: "ready-to-cook",
    storeId: "s2",
    storeName: "Rangpur Agro Fresh",
    rating: 4.8,
    reviewsCount: 165,
    price: 380,
    oldPrice: 450,
    discount: "15% OFF",
    unit: "500g Prepped Pack",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    isFlashDeal: true,
    flashStock: 40,
    isRecommended: true,
    isBestSeller: false,
    badge: "Instant Cook"
  },
  {
    id: "p8",
    name: "TWS Wireless ANC Bluetooth Earbuds",
    category: "gadget-electronics",
    storeId: "s3",
    storeName: "Bengal Super Mart",
    rating: 4.8,
    reviewsCount: 310,
    price: 1290,
    oldPrice: 1850,
    discount: "30% OFF",
    unit: "1 Box + Type-C Cable",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    isFlashDeal: false,
    isRecommended: true,
    isBestSeller: true,
    badge: "Tech Gadget"
  },
  {
    id: "p9",
    name: "Men's Premium Cotton Casual Shirt",
    category: "fashion",
    storeId: "s3",
    storeName: "Bengal Super Mart",
    rating: 4.7,
    reviewsCount: 140,
    price: 890,
    oldPrice: 1200,
    discount: "25% OFF",
    unit: "Slim Fit (L Size)",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    isFlashDeal: false,
    isRecommended: true,
    isBestSeller: false,
    badge: "New Trend"
  }
];

const STORES = [
  {
    id: "s1",
    name: "Sultan's Dine & Grill",
    category: "Food",
    rating: 4.9,
    reviewsCount: "1.2k+",
    deliveryTime: "25–35 min",
    distance: "1.2 km",
    offer: "20% OFF",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    isNew: false,
    tags: ["Kacchi", "Traditional", "Biryani"]
  },
  {
    id: "s2",
    name: "Rangpur Agro Fresh",
    category: "Fresh & Grocery",
    rating: 4.8,
    reviewsCount: "850+",
    deliveryTime: "15–25 min",
    distance: "0.8 km",
    offer: "Free Delivery",
    coverImage: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    isNew: false,
    tags: ["Fruits", "Vegetables", "Organic"]
  },
  {
    id: "s3",
    name: "Bengal Super Mart",
    category: "Supermarket",
    rating: 4.7,
    reviewsCount: "2.4k+",
    deliveryTime: "20–30 min",
    distance: "1.5 km",
    offer: "৳50 Flat OFF",
    coverImage: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    isNew: false,
    tags: ["Grocery", "Household", "Personal Care"]
  },
  {
    id: "s4",
    name: "The Artisan Bakery & Cafe",
    category: "Bakery",
    rating: 4.9,
    reviewsCount: "420+",
    deliveryTime: "20–35 min",
    distance: "2.1 km",
    offer: "15% OFF",
    coverImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=150&q=80",
    isPopular: false,
    isNew: true,
    tags: ["Pastry", "Cakes", "Coffee"]
  },
  {
    id: "s5",
    name: "Lazz Pharma Express",
    category: "Pharmacy",
    rating: 5.0,
    reviewsCount: "3.1k+",
    deliveryTime: "10–20 min",
    distance: "0.5 km",
    offer: "24/7 Open",
    coverImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=150&q=80",
    isPopular: true,
    isNew: false,
    tags: ["Medicine", "Baby Care", "Wellness"]
  },
  {
    id: "s6",
    name: "Green Harvest Organic",
    category: "Fresh Produce",
    rating: 4.8,
    reviewsCount: "130+",
    deliveryTime: "25–40 min",
    distance: "2.8 km",
    offer: "Buy 1 Get 1",
    coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    logoImage: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=150&q=80",
    isPopular: false,
    isNew: true,
    tags: ["Organic", "Farm Direct", "Juices"]
  }
];

const REVIEWS = [
  {
    id: "r1",
    name: "Tanvir Rahman",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "Ordered Biryani & Grocery items together. Received everything hot and packed with supreme freshness in under 25 minutes! App experience is super slick.",
    date: "Yesterday",
    orderItem: "Kacchi Biryani & Mustard Oil",
    storeName: "Sultan's Dine"
  },
  {
    id: "r2",
    name: "Nusrat Jahan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "Super responsive location picker and live tracker. Lazz Pharma medicine was delivered within 15 minutes during late night. Life saver!",
    date: "2 days ago",
    orderItem: "Emergency Medicine",
    storeName: "Lazz Pharma Express"
  },
  {
    id: "r3",
    name: "Kazi Ashraful",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "The flash deal discount on Himsagar Mangoes was unbeatable. Really impressed with how smooth this mobile view behaves like a native Android app.",
    date: "3 days ago",
    orderItem: "Fresh Himsagar Mangoes 5kg",
    storeName: "Rangpur Agro Fresh"
  }
];

const LOCATIONS = [
  {
    id: "loc1",
    title: "Home",
    address: "House 42, Road 5, Rangpur Sadar, Rangpur",
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
    address: "Block B, Banani, Dhaka 1213",
    type: "other",
    isSelected: false
  }
];

const CATEGORY_DETAILS_DATA = {
  "fresh-fish": {
    title: "Fresh Fish & Seafood",
    heroSlides: [
      "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব মাছ" },
      { id: "river-fish", name: "নদীর তাজা মাছ" },
      { id: "prawn", name: "খাঁটি গলদা ও বাগদা" },
      { id: "sea-fish", name: "সামুদ্রিক মাছ" },
      { id: "dry-fish", name: "শুঁটকি মাছ" }
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
      { id: "all", name: "সব কালেকশন" },
      { id: "beauty", name: "Beauty Items" },
      { id: "charm", name: "Endless Charm" },
      { id: "royalty", name: "Little Royalty" },
      { id: "style", name: "Style Perfect" },
      { id: "time", name: "Classic Time" }
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
      { id: "fb1", name: "Aarong", logo: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80" },
      { id: "fb2", name: "Yellow", logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80" },
      { id: "fb3", name: "Sailor", logo: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=200&q=80" },
      { id: "fb4", name: "Apex", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "gadget-electronics": {
    title: "Gadgets & Electronics",
    heroSlides: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব গ্যাজেট" },
      { id: "audio", name: "Headphones" },
      { id: "smartwatches", name: "Smartwatches" },
      { id: "chargers", name: "Fast Chargers" }
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
        title: "স্মার্টওয়াচ ফেস্ট",
        subtitle: "অরিজিনাল ব্র্যান্ড ওয়ারেন্টিসহ",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "gb1", name: "Samsung", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80" },
      { id: "gb2", name: "Xiaomi", logo: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80" },
      { id: "gb3", name: "Anker", logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "grocery": {
    title: "Grocery & Essentials",
    heroSlides: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব গ্রোসারী" },
      { id: "rice", name: "চাল ও ডাল" },
      { id: "oil", name: "ভোজ্য তেল" },
      { id: "spices", name: "মরিচ ও মসলা" }
    ],
    specialOffers: [
      {
        id: "groc-off-1",
        title: "মাসিক ফ্যামিলি বাজার ডিল",
        subtitle: "কম্বো প্যাকে ১৫% ক্যাশব্যাক",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "groc-off-2",
        title: "অর্গানিক চাল ও খাঁটি তেল",
        subtitle: "সরাসরি ফার্ম থেকে ডেলিভারি",
        image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "grb1", name: "Pran", logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80" },
      { id: "grb2", name: "Teer", logo: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80" },
      { id: "grb3", name: "ACI Pure", logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "pharmacy": {
    title: "Pharmacy & Medicine",
    heroSlides: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব ওষুধ" },
      { id: "otc", name: "OTC Meds" },
      { id: "baby", name: "Baby Care" },
      { id: "wellness", name: "Healthcare" }
    ],
    specialOffers: [
      {
        id: "pharm-off-1",
        title: "জরুরি ওষুধ হোম ডেলিভারি",
        subtitle: "২৪/৭ মাত্র ১৫ মিনিটে ফ্রি ডেলিভারি",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "pb1", name: "Square", logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80" },
      { id: "pb2", name: "Beximco", logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "cake-bakery": {
    title: "Cake & Bakery",
    heroSlides: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব কেক" },
      { id: "birthday", name: "Birthday Cakes" },
      { id: "pastry", name: "Fresh Pastries" }
    ],
    specialOffers: [
      {
        id: "cake-off-1",
        title: "বার্থডে কেক বিশেষ ছাড়",
        subtitle: "কাস্টম ডিজাইনে ২০% অফার",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "cb1", name: "Tasty Treat", logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "food": {
    title: "Restaurant & Food",
    heroSlides: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব খাবার" },
      { id: "biryani", name: "কাচ্চি ও বিরিয়ানি" },
      { id: "fastfood", name: "বার্গার ও পিজা" }
    ],
    specialOffers: [
      {
        id: "food-off-1",
        title: "কাচ্চি ও মোঘলাই ফেস্ট",
        subtitle: "ফ্রি ড্রিংকসসহ কম্বো প্যাক",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "fdb1", name: "Sultan's Dine", logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "gas-cylinder": {
    title: "LPG Gas Cylinder",
    heroSlides: [
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব সিলিন্ডার" },
      { id: "lpg-12kg", name: "12kg LP Gas" }
    ],
    specialOffers: [
      {
        id: "gas-off-1",
        title: "জরুরি গ্যাস রিফিল এক্সপ্রেস",
        subtitle: "১৫ মিনিটে ডোরস্টেপ সেটআপ",
        image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "gb1", name: "Bashundhara LP", logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80" },
      { id: "gb2", name: "Omera LP Gas", logo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  "ready-to-cook": {
    title: "Ready To Cook",
    heroSlides: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
    ],
    subCategories: [
      { id: "all", name: "সব রেডি আইটেম" },
      { id: "cut-fish", name: "কাটা মাছ" },
      { id: "marinated", name: "মেরিনেটেড মিট" }
    ],
    specialOffers: [
      {
        id: "rtc-off-1",
        title: "তাজা রেডি টু কুক মিট ও ফিশ",
        subtitle: "কাটুন ও রান্না করুন সরাসরি",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
      }
    ],
    brands: [
      { id: "rtcb1", name: "Kazi Farms Kitchen", logo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80" }
    ]
  }
};
