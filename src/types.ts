export type ConditionGrade =
  | "Brand New"
  | "Open Box"
  | "Like New"
  | "Refurbished"
  | "Good / Pre-Owned";

export type CategoryKey =
  | "all"
  | "keyboards"
  | "mice"
  | "monitors"
  | "storage"
  | "audio"
  | "streaming"
  | "cables"
  | "cooling";

export interface CategoryInfo {
  id: CategoryKey;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
  featuredTags: string[];
}

export interface Seller {
  id: string;
  name: string;
  handle: string;
  verified: boolean;
  avatar: string;
  rating: number;
  salesCount: number;
  location: string;
  responseTime: string;
  memberSince: string;
  badge?: "Top Rated Tech Seller" | "Foster Verified Pro" | "Enthusiast Builder" | "Community Trader";
}

export interface InspectionReport {
  functionalTest: boolean;
  cosmeticScore: string; // e.g. "9.8/10 Flawless"
  batteryHealth?: string;
  originalPackaging: boolean;
  accessoriesIncluded: string[];
  testedBy: string;
  inspectionDate: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: CategoryKey;
  categoryName: string;
  subcategory: string;
  condition: ConditionGrade;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  seller: Seller;
  acceptsOffers: boolean;
  minOfferPrice?: number;
  freeShipping: boolean;
  fastDelivery: boolean;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  dealEndsAt?: string;
  tags: string[];
  inspectionReport?: InspectionReport;
  createdAt: string;
  isUserListing?: boolean;
  sku?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderTimelineStep {
  step: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  promoCodeApplied?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: "Credit Card" | "Apple Pay / Google Pay" | "Crypto (USDC)" | "Foster Escrow Pay";
  status: "Order Placed" | "Quality Inspection" | "Dispatched" | "In Transit" | "Out for Delivery" | "Delivered";
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: string;
  timeline: OrderTimelineStep[];
}

export interface Offer {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productCondition: ConditionGrade;
  askingPrice: number;
  offerAmount: number;
  buyerName: string;
  buyerEmail?: string;
  buyerMessage?: string;
  status: "Pending" | "Accepted" | "Countered" | "Declined";
  counterAmount?: number;
  sellerNote?: string;
  createdAt: string;
  isFromUser: boolean; // true if current user made offer to another seller, false if received for user's listing
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  verified: boolean;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpfulCount: number;
  setupNote?: string;
}

export interface QuestionAnswer {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  date: string;
  answer?: string;
  answeredBy?: string;
  answerDate?: string;
}

export interface FilterState {
  category: CategoryKey;
  conditions: ConditionGrade[];
  brands: string[];
  priceRange: [number, number];
  minRating: number;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating" | "newest" | "discount";
  searchQuery: string;
  freeShippingOnly: boolean;
  acceptsOffersOnly: boolean;
  inStockOnly: boolean;
  verifiedSellersOnly: boolean;
}

export interface SetupProfile {
  computerType: "Desktop PC" | "MacBook / Mac" | "Gaming Laptop" | "Dual Rig / Workstation";
  operatingSystem: "Windows 11" | "macOS Sequoia" | "Linux (Ubuntu/Arch)" | "Multi-OS";
  primaryUse: "Competitive Gaming" | "Software Engineering" | "Video & 3D Creator" | "Ergonomic Home Office" | "Audio Production";
  availablePorts: string[];
  budgetTier: "Budget Essential ($50-$200)" | "Pro Enthusiast ($200-$600)" | "No Compromise Endgame ($600+)";
}
