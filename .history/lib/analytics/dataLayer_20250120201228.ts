// Type definitions for data layer events
type SignupMethod = 'google_auth' | 'email';
type LoginMethod = 'google_auth' | 'email';
type Plan = 'free' | 'pro';
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

export const trackSignupComplete = (userId: string, planType: Plan) => {
  window.dataLayer?.push({
    event: 'signup_complete',
    userId,
    planType
  });
};

export const trackLogin = (userId: string, loginMethod: LoginMethod) => {
  window.dataLayer?.push({
    event: 'login',
    userId,
    loginMethod
  });
};

// Domain Search & Discovery
export const trackDomainSearchInitiated = (searchQuery: string, tldFilters: string[]) => {
  window.dataLayer?.push({
    event: 'domain_search_initiated',
    searchQuery,
    tldFilters
  });
};

export const trackDomainSearchResultsLoaded = (
  searchQuery: string,
  totalResults: number,
  isDomainAvailable: boolean,
  suggestedDomains: string[]
) => {
  window.dataLayer?.push({
    event: 'domain_search_results_loaded',
    searchQuery,
    totalResults,
    isDomainAvailable,
    suggestedDomains
  });
};

export const trackDomainSuggestionClicked = (clickedDomain: string, suggestionRank: number) => {
  window.dataLayer?.push({
    event: 'domain_suggestion_clicked',
    clickedDomain,
    suggestionRank
  });
};

// Favorites Management
export const trackDomainFavoriteAdded = (domainName: string) => {
  window.dataLayer?.push({
    event: 'domain_favorite_added',
    domainName
  });
};

export const trackDomainFavoriteRemoved = (domainName: string) => {
  window.dataLayer?.push({
    event: 'domain_favorite_removed',
    domainName
  });
};

// Cart & Checkout
export const trackAddToCart = (domainName: string, price: number, currency: Currency = 'USD') => {
  window.dataLayer?.push({
    event: 'add_to_cart',
    domainName,
    price,
    currency
  });
};

export const trackRemoveFromCart = (domainName: string, price: number, currency: Currency = 'USD') => {
  window.dataLayer?.push({
    event: 'remove_from_cart',
    domainName,
    price,
    currency
  });
};

export const trackCheckoutStart = (cartItems: DomainItem[], totalValue: number, currency: Currency = 'USD') => {
  window.dataLayer?.push({
    event: 'checkout_start',
    cartItems,
    totalValue,
    currency
  });
};

export const trackPurchaseComplete = (
  transactionId: string,
  purchasedDomains: DomainItem[],
  totalValue: number,
  currency: Currency = 'USD'
) => {
  window.dataLayer?.push({
    event: 'purchase_complete',
    transactionId,
    purchasedDomains,
    totalValue,
    currency
  });
};

// Subscription Events
export const trackSubscriptionUpgrade = (
  oldPlan: Plan,
  newPlan: Plan,
  price: number,
  currency: Currency = 'USD'
) => {
  window.dataLayer?.push({
    event: 'subscription_upgrade',
    oldPlan,
    newPlan,
    price,
    currency
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
export const trackDomainSearchError = (errorCode: string, errorMessage: string) => {
  window.dataLayer?.push({
    event: 'domain_search_error',
    errorCode,
    errorMessage
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
