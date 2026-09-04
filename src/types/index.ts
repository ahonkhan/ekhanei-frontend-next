export interface LocationItem {
  id: string;
  title: string;
  address: string;
  type: 'home' | 'office' | 'other';
  isSelected?: boolean;
  lat?: number;
  lng?: number;
  plusCode?: string;
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

export interface ProductVariation {
  id: string;
  name: string;
  type?: string;
  value?: string;
  price?: number;
  oldPrice?: number;
  stock?: number;
  image?: string;
  sku?: string;
}

export interface VariationAttribute {
  name: string;
  options: string[];
}

export interface ProductReview {
  id: string;
  name: string;
  size?: string;
  date: string;
  rating: number;
  comment: string;
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
  galleryImages?: string[];
  rating: number;
  reviewsCount: number;
  soldCount?: number;
  storeId?: string;
  storeName: string;
  store?: Store;
  discountBadge?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  isBestSeller?: boolean;
  flashStock?: number;
  stockQuantity?: number;
  shortDescription?: string;
  description?: string;
  returnPolicy?: string;
  exchangePolicy?: string;
  deliveryTime?: string;
  paymentMethod?: string;
  variations?: ProductVariation[];
  variationAttributes?: VariationAttribute[];
  reviews?: ProductReview[];
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
  url?: string;
}

export interface HeroBanner {
  id: string;
  title?: string;
  subtitle?: string;
  image: string;
  url?: string;
  link?: string;
  type?: string;
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
  promoAds?: SpecialOffer[];
  specialOffers: SpecialOffer[];
  brands: Brand[];
}

export interface CartItem extends Product {
  quantity: number;
}
