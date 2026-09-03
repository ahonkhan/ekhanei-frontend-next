export interface LocationItem {
  id: string;
  title: string;
  address: string;
  type: 'home' | 'office' | 'other';
  isSelected?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  bg: string;
  iconBg: string;
  itemCount: string;
  badge: string;
  slug?: string;
  title?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  oldPrice: number;
  unit: string;
  image: string;
  rating: number;
  reviewsCount: number;
  storeName: string;
  discountBadge?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  isBestSeller?: boolean;
  flashStock?: number;
}

export interface StoreCategoryTab {
  id: string;
  name: string;
  count?: number;
}

export interface StoreReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  likesCount?: number;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  distance: string;
  offer: string;
  coverImage: string;
  logoImage: string;
  isPopular?: boolean;
  isNew?: boolean;
  tags?: string[];
  bio?: string;
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: string;
  joinedDate?: string;
  totalOrders?: string;
  followersCount?: string;
  verified?: boolean;
  minOrder?: number;
  deliveryFee?: number;
  storeCategories?: StoreCategoryTab[];
  gallery?: string[];
  reviews?: StoreReview[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface SpecialOffer {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface SubCategory {
  id: string;
  name: string;
  image?: string;
  slug?: string;
}

export interface CategoryDetailMeta {
  id?: string;
  title: string;
  heroSlides: string[];
  subCategories: SubCategory[];
  specialOffers: SpecialOffer[];
  brands: Brand[];
}

export interface CartItem extends Product {
  quantity: number;
}
