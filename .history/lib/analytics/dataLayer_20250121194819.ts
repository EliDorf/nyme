// Type definitions for data layer events
export type SignupMethod = 'google_auth' | 'email';
export type LoginMethod = 'google_auth' | 'email';
export type Plan = 'free' | 'pro';
type Currency = 'USD';
type Rating = 'thumbs_up' | 'thumbs_down';

interface DomainItem {
  domainName: string;
  price: number;
}

// User Onboarding & Authentication
export const trackSignupStart = (signupMethod: SignupMethod) => {
  window.dataLayer?.push({
    event: 'signup_start',
    signupMethod
  });
};

export const trackSignupComplete = (userId: string, planType: Plan, email?: string) => {
  window.dataLayer?.push({
    event: 'signup_complete',
    userId,
    planType,
    ...(email && { email })
  });
};

export const trackLogin = (userId: string, loginMethod: LoginMethod, email?: string) => {
  window.dataLayer?.push({
    event: 'login',
    userId,
    loginMethod,
    ...(email && { email })
  });
};

// Domain Search & Discovery
export const trackDomainSearchInitiated = (searchQuery: string, tldFilters: string[], email?: string) => {
  window.dataLayer?.push({
    event: 'domain_search_initiated',
    searchQuery,
    tldFilters,
    ...(email && { email })
  });
};

export const trackDomainSearchResultsLoaded = (
  searchQuery: string,
  totalResults: number,
  isDomainAvailable: boolean,
  suggestedDomains: string[],
  email?: string
) => {
  window.dataLayer?.push({
    event: 'domain_search_results_loaded',
    searchQuery,
    totalResults,
    isDomainAvailable,
    suggestedDomains,
    ...(email && { email })
  });
};

export const trackDomainSuggestionClicked = (clickedDomain: string, suggestionRank: number, email?: string) => {
  window.dataLayer?.push({
    event: 'domain_suggestion_clicked',
    clickedDomain,
    suggestionRank,
    ...(email && { email })
  });
};

// Favorites Management
export const trackDomainFavoriteAdded = (domainName: string, email?: string) => {
  window.dataLayer?.push({
    event: 'domain_favorite_added',
    domainName,
    ...(email && { email })
  });
};

export const trackDomainFavoriteRemoved = (domainName: string, email?: string) => {
  window.dataLayer?.push({
    event: 'domain_favorite_removed',
    domainName,
    ...(email && { email })
  });
};

// Cart & Checkout
export const trackAddToCart = (domainName: string, price: number, currency: Currency = 'USD', email?: string) => {
  window.dataLayer?.push({
    event: 'domain_add_to_cart',
    domainName,
    price,
    currency,
    ...(email && { email })
  });
};

export const trackRemoveFromCart = (domainName: string, price: number, currency: Currency = 'USD', email?: string) => {
  window.dataLayer?.push({
    event: 'remove_from_cart',
    domainName,
    price,
    currency,
    ...(email && { email })
  });
};

export const trackCheckoutStart = (cartItems: DomainItem[], totalValue: number, currency: Currency = 'USD', email?: string) => {
  window.dataLayer?.push({
    event: 'checkout_start',
    cartItems,
    totalValue,
    currency,
    ...(email && { email })
  });
};

export const trackPurchaseComplete = (
  transactionId: string,
  purchasedDomains: DomainItem[],
  totalValue: number,
  currency: Currency = 'USD',
  email?: string
) => {
  window.dataLayer?.push({
    event: 'purchase_complete',
    transactionId,
    purchasedDomains,
    totalValue,
    currency,
    ...(email && { email })
  });
};

// Subscription Events
export const trackSubscriptionUpgrade = (
  oldPlan: Plan,
  newPlan: Plan,
  price: number,
  currency: Currency = 'USD',
  email?: string
) => {
  window.dataLayer?.push({
    event: 'subscription_upgrade',
    oldPlan,
    newPlan,
    price,
    currency,
    ...(email && { email })
  });
};

export const trackSubscriptionRenewal = (
  plan: Plan,
  price: number,
  currency: Currency = 'USD',
  renewalDate: string
) => {
  window.dataLayer?.push({
    event: 'subscription_renewal',
    plan,
    price,
    currency,
    renewalDate
  });
};

// Error & AI Feedback
export const trackDomainSearchError = (errorCode: string, errorMessage: string, email?: string) => {
  window.dataLayer?.push({
    event: 'domain_search_error',
    errorCode,
    errorMessage,
    ...(email && { email })
  });
};

export const trackAiFeedback = (suggestion: string, rating: Rating, comment?: string) => {
  window.dataLayer?.push({
    event: 'ai_feedback',
    suggestion,
    rating,
    comment
  });
};

// Credit Usage
export const trackCreditUsed = (featureName: string, creditsUsed: number = 1) => {
  window.dataLayer?.push({
    event: 'credit_used',
    featureName,
    creditsUsed
  });
};

export const trackCreditsExhausted = (featureName: string, userId: string, email?: string) => {
  window.dataLayer?.push({
    event: 'credits_exhausted',
    featureName,
    userId,
    timestamp: new Date().toISOString(),
    ...(email && { email })
  });
};

// Page Navigation
export const trackPageView = (pagePath: string) => {
  window.dataLayer?.push({
    event: 'page_view',
    pagePath
  });
};

// Credit Purchase
export const trackCreditAddToCart = (plan: string, amount: number, credits: number) => {
  window.dataLayer?.push({
    event: 'credit_add_to_cart',
    plan,
    amount,
    credits
  });
};

// Engagement & Usage
export const trackTutorialViewed = (tutorialName: string, timeSpentSeconds: number) => {
  window.dataLayer?.push({
    event: 'tutorial_viewed',
    tutorialName,
    timeSpentSeconds
  });
};

export const trackFeatureUsed = (featureName: string, additionalData?: Record<string, any>) => {
  window.dataLayer?.push({
    event: 'feature_used',
    featureName,
    ...additionalData
  });
};

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = [];
}

// Type declaration for window object
declare global {
  interface Window {
    dataLayer: any[];
  }
}
