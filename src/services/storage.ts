import { Product, CartItem, Order, Offer, SetupProfile, Review, QuestionAnswer } from "../types";
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_QUESTIONS } from "../data/mockProducts";

const STORAGE_KEYS = {
  USER_PRODUCTS: "foster_user_products_v1",
  CART: "foster_cart_v1",
  WISHLIST: "foster_wishlist_v1",
  ORDERS: "foster_orders_v1",
  OFFERS: "foster_offers_v1",
  SETUP_PROFILE: "foster_setup_profile_v1",
  USER_PROFILE: "foster_user_profile_v1",
  REVIEWS: "foster_reviews_v1",
  QUESTIONS: "foster_questions_v1",
  COMPARE: "foster_compare_v1",
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  location: string;
  balance: number;
  totalSales: number;
  rating: number;
  isSeller: boolean;
  memberSince: string;
}

const DEFAULT_USER_PROFILE: UserProfile = {
  id: "current-user-01",
  name: "Alex Foster",
  email: "alex.tech@fosteratech.io",
  handle: "@alex_rigs",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  location: "San Francisco, CA",
  balance: 420.50,
  totalSales: 8,
  rating: 4.95,
  isSeller: true,
  memberSince: "May 2024"
};

export function getProducts(): Product[] {
  try {
    const userProductsJson = localStorage.getItem(STORAGE_KEYS.USER_PRODUCTS);
    const userProducts: Product[] = userProductsJson ? JSON.parse(userProductsJson) : [];
    return [...userProducts, ...INITIAL_PRODUCTS];
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    const userProducts = products.filter((p) => p.isUserListing);
    localStorage.setItem(STORAGE_KEYS.USER_PRODUCTS, JSON.stringify(userProducts));
  } catch (err) {
    console.error("Failed to save products", err);
  }
}

export function saveUserProduct(newProduct: Product): void {
  try {
    const userProductsJson = localStorage.getItem(STORAGE_KEYS.USER_PRODUCTS);
    const userProducts: Product[] = userProductsJson ? JSON.parse(userProductsJson) : [];
    userProducts.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.USER_PRODUCTS, JSON.stringify(userProducts));
  } catch (err) {
    console.error("Failed to save product", err);
  }
}

export function deleteUserProduct(productId: string): void {
  try {
    const userProductsJson = localStorage.getItem(STORAGE_KEYS.USER_PRODUCTS);
    if (!userProductsJson) return;
    const userProducts: Product[] = JSON.parse(userProductsJson);
    const filtered = userProducts.filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.USER_PRODUCTS, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete user product", err);
  }
}

export function getCart(): CartItem[] {
  try {
    const cartJson = localStorage.getItem(STORAGE_KEYS.CART);
    return cartJson ? JSON.parse(cartJson) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (err) {
    console.error("Failed to save cart", err);
  }
}

export function getWishlist(): string[] {
  try {
    const wishlistJson = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return wishlistJson ? JSON.parse(wishlistJson) : ["prod-kb-01", "prod-mon-02"];
  } catch {
    return ["prod-kb-01"];
  }
}

export function saveWishlist(wishlist: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  } catch (err) {
    console.error("Failed to save wishlist", err);
  }
}

export function getOrders(): Order[] {
  try {
    const ordersJson = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (ordersJson) return JSON.parse(ordersJson);

    // Initial sample completed order
    const sampleOrder: Order = {
      id: "FAT-98241",
      items: [
        {
          product: INITIAL_PRODUCTS[0],
          quantity: 1,
          addedAt: "2026-08-18"
        }
      ],
      subtotal: 189,
      discount: 18.9,
      shippingFee: 0,
      tax: 15.30,
      totalAmount: 185.40,
      promoCodeApplied: "FOSTER10",
      shippingAddress: {
        fullName: "Alex Foster",
        email: "alex.tech@fosteratech.io",
        phone: "+1 (555) 234-5678",
        address: "742 Evergreen Tech Way, Suite 400",
        city: "San Francisco",
        state: "CA",
        postalCode: "94107",
        country: "United States"
      },
      paymentMethod: "Foster Escrow Pay",
      status: "In Transit",
      carrier: "Foster Express Air (Track: #FAT-US-89104)",
      trackingNumber: "FAT-US-8910429",
      estimatedDelivery: "Tomorrow by 2:00 PM",
      createdAt: "2026-08-20T14:30:00Z",
      timeline: [
        { step: "Order Placed & Escrow Funded", timestamp: "Aug 20, 2:30 PM", completed: true, description: "Payment securely held in Foster Escrow vault" },
        { step: "Hardware Verification & Inspection", timestamp: "Aug 20, 5:15 PM", completed: true, description: "QA testing passed: magnetic actuation & PCB tested" },
        { step: "Packaged & Handed to Courier", timestamp: "Aug 21, 9:00 AM", completed: true, description: "Sealed with tamper-evident Foster security tape" },
        { step: "In Transit - Sort Facility", timestamp: "Aug 21, 8:40 PM", completed: true, current: true, description: "Departed San Jose Distribution Hub" },
        { step: "Out for Delivery", timestamp: "Estimated Aug 23, 9:00 AM", completed: false, description: "Local driver assigned" },
        { step: "Delivered & Buyer Confirmation", timestamp: "Estimated Aug 23, 2:00 PM", completed: false, description: "30-day return protection begins upon unboxing" }
      ]
    };

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([sampleOrder]));
    return [sampleOrder];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error("Failed to save orders", err);
  }
}

export function getOffers(): Offer[] {
  try {
    const offersJson = localStorage.getItem(STORAGE_KEYS.OFFERS);
    if (offersJson) return JSON.parse(offersJson);

    // Initial sample received offer
    const sampleOffers: Offer[] = [
      {
        id: "off-01",
        productId: "prod-mouse-01",
        productTitle: "ViperX Carbon 8K Magnesium Wireless Gaming Mouse",
        productImage: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80",
        productCondition: "Like New",
        askingPrice: 135,
        offerAmount: 125,
        buyerName: "CyberGamer_99",
        buyerMessage: "Can pay right now via Escrow if you can ship today!",
        status: "Pending",
        createdAt: "2026-08-21T18:30:00Z",
        isFromUser: false
      }
    ];

    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(sampleOffers));
    return sampleOffers;
  } catch {
    return [];
  }
}

export function saveOffers(offers: Offer[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  } catch (err) {
    console.error("Failed to save offers", err);
  }
}

export function getUserProfile(): UserProfile {
  try {
    const profileJson = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profileJson ? JSON.parse(profileJson) : DEFAULT_USER_PROFILE;
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save user profile", err);
  }
}

export function getReviews(): Review[] {
  try {
    const reviewsJson = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return reviewsJson ? JSON.parse(reviewsJson) : INITIAL_REVIEWS;
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveReview(review: Review): void {
  try {
    const current = getReviews();
    current.unshift(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to save review", err);
  }
}

export function getQuestions(): QuestionAnswer[] {
  try {
    const qJson = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return qJson ? JSON.parse(qJson) : INITIAL_QUESTIONS;
  } catch {
    return INITIAL_QUESTIONS;
  }
}

export function saveQuestion(question: QuestionAnswer): void {
  try {
    const current = getQuestions();
    current.unshift(question);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to save question", err);
  }
}

export function getCompareList(): string[] {
  try {
    const compJson = localStorage.getItem(STORAGE_KEYS.COMPARE);
    return compJson ? JSON.parse(compJson) : [];
  } catch {
    return [];
  }
}

export function saveCompareList(list: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save compare list", err);
  }
}
