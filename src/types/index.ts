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
}

export interface CategoryDetailMeta {
  title: string;
  heroSlides: string[];
  subCategories: SubCategory[];
  specialOffers: SpecialOffer[];
  brands: Brand[];
}

export interface CartItem extends Product {
  quantity: number;
}
