# Nyme API Documentation

## Overview

Nyme is a Next.js application that provides AI-powered domain name generation and domain availability checking services. The platform uses modern technologies including Clerk for authentication, Stripe for payments, MongoDB for data storage, and Groq/LLaMA for AI-powered name generation.

## Table of Contents

1. [API Endpoints](#api-endpoints)
2. [Database Models](#database-models)
3. [Server Actions](#server-actions)
4. [React Components](#react-components)
5. [Utility Functions](#utility-functions)
6. [Type Definitions](#type-definitions)
7. [Authentication & Middleware](#authentication--middleware)
8. [Analytics & Tracking](#analytics--tracking)
9. [Configuration](#configuration)

---

## API Endpoints

### 1. Name Generation API

**Endpoint:** `POST /api/generate`

**Description:** Generates AI-powered name suggestions using Groq/LLaMA model

**Request Body:**
```typescript
{
  input: string;        // Base word/concept for generation
  mode?: 'short' | 'synonym'; // Generation mode (default: 'short')
}
```

**Response:**
```typescript
{
  suggestions: string[]; // Array of generated name suggestions
}
```

**Example Usage:**
```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    input: 'apple',
    mode: 'short' 
  })
});
const data = await response.json();
// Returns: { suggestions: ["Appy", "Apples", "Appen", "Plen", "Pren"] }
```

**Features:**
- Two generation modes: `short` (creates short variations) and `synonym` (creates semantic alternatives)
- Automatically saves suggestions to database
- Requires authentication via Clerk
- Tracks usage for analytics

---

### 2. Domain Availability API

**Endpoint:** `GET /api/domains`

**Description:** Checks domain availability using RapidAPI's Domainr service

**Query Parameters:**
- `name` (required): Domain name to check

**Response:**
```typescript
{
  status: [
    {
      domain: string;
      status: string;
      zone: string;
      summary: string;
    }
  ]
}
```

**Example Usage:**
```javascript
const response = await fetch('/api/domains?name=example.com');
const data = await response.json();
```

---

### 3. Save Domain Searches API

**Endpoint:** `POST /api/save-domains`

**Description:** Saves domain search results to database

**Request Body:**
```typescript
{
  domains: Array<{
    domain: string;
    status: {
      status: string;
      zone: string;
      summary: string;
    };
  }>;
  userId: string;
  input: string;
}
```

**Response:**
```typescript
{
  message: string;
  id: string; // MongoDB ObjectId of saved search
}
```

---

### 4. Webhook Endpoints

#### Clerk Authentication Webhook
**Endpoint:** `POST /api/webhooks/clerk`

**Description:** Handles user lifecycle events from Clerk

**Supported Events:**
- `user.created`: Creates new user in database
- `user.updated`: Updates user information
- `user.deleted`: Removes user from database

#### Stripe Payment Webhook
**Endpoint:** `POST /api/webhooks/stripe`

**Description:** Handles payment events from Stripe (file exists but not detailed in provided code)

---

## Database Models

### User Model
```typescript
interface User {
  _id: ObjectId;
  clerkId: string;        // Clerk user ID
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  photo: string;
  planId: number;         // Default: 1
  creditBalance: number;  // Default: 20
}
```

### Domain Search Model
```typescript
interface DomainSearch {
  _id: ObjectId;
  userId: string;
  input: string;
  domains: Array<{
    name: string;
    status: string;
    zone: string;
    summary: string;
  }>;
  createdAt: Date;
}
```

### Name Suggestion Model
```typescript
interface NameSuggestion {
  _id: ObjectId;
  userId: string;
  input: string;
  suggestions: string[];
  mode: 'short' | 'synonym';
  createdAt: Date;
}
```

### Transaction Model
```typescript
interface Transaction {
  _id: ObjectId;
  createdAt: Date;
  stripeId: string;
  amount: number;
  plan?: string;
  credits?: number;
  buyer: ObjectId;        // Reference to User
  subscriptionId?: string;
  isSubscription: boolean;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
}
```

---

## Server Actions

### User Actions (`lib/actions/user.action.ts`)

#### `createUser(user: CreateUserParams)`
Creates a new user in the database.

**Parameters:**
```typescript
interface CreateUserParams {
  clerkId: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
}
```

**Returns:** `Promise<User>`

#### `getUserById(userId: string)`
Retrieves user by Clerk ID.

**Parameters:**
- `userId`: Clerk user ID

**Returns:** `Promise<User>`

#### `updateUser(clerkId: string, user: UpdateUserParams)`
Updates user information.

**Parameters:**
```typescript
interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  username?: string;
  photo?: string;
}
```

**Returns:** `Promise<User>`

#### `updateCredits(userId: string, creditFee: number)`
Updates user's credit balance.

**Parameters:**
- `userId`: MongoDB ObjectId as string
- `creditFee`: Number of credits to add/subtract

**Returns:** `Promise<User>`

#### `getAvailableDomainsForUser(userId: string)`
Retrieves available domains from user's search history.

**Returns:** `Promise<Domain[]>`

### Transaction Actions (`lib/actions/transaction.action.ts`)

#### `checkoutCredits(transaction: CheckoutTransactionParams)`
Initiates Stripe checkout for credit purchase.

**Parameters:**
```typescript
interface CheckoutTransactionParams {
  plan: string;
  credits: number;
  amount: number;
  buyerId: string;
}
```

**Returns:** Redirects to Stripe checkout

#### `createTransaction(transaction: CreateTransactionParams)`
Creates transaction record after successful payment.

**Parameters:**
```typescript
interface CreateTransactionParams {
  stripeId: string;
  amount: number;
  credits: number;
  plan: string;
  buyerId: string;
  createdAt: Date;
}
```

**Returns:** `Promise<Transaction>`

---

## React Components

### Core Components

#### `DomainFinder` Component
**File:** `components/domain-finder.tsx`

**Description:** Main domain search and name generation interface

**Features:**
- AI-powered name suggestions
- Domain availability checking
- Responsive design with mobile support
- Dark/light mode toggle
- Tab-based results display (Available/Unavailable)
- Grid/List view toggle

**Props:** None (self-contained component)

**Usage:**
```tsx
import DomainFinder from '@/components/domain-finder';

export default function SearchPage() {
  return <DomainFinder />;
}
```

#### `UseSuggestion` Hook
**File:** `components/component/UseSuggestion.tsx`

**Description:** Custom hook for managing name suggestions

**Returns:**
```typescript
{
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  handleSubmit: (input: string, mode?: SuggestionMode) => Promise<void>;
  mode: SuggestionMode;
  setMode: (mode: SuggestionMode) => void;
}
```

**Usage:**
```tsx
import { useSuggestions } from '@/components/component/UseSuggestion';

function MyComponent() {
  const { suggestions, isLoading, handleSubmit } = useSuggestions();
  
  return (
    <div>
      <button onClick={() => handleSubmit('apple', 'short')}>
        Generate Names
      </button>
      {suggestions.map(name => <div key={name}>{name}</div>)}
    </div>
  );
}
```

### UI Components (`components/ui/`)

All UI components are built with Radix UI and styled with Tailwind CSS.

#### `Button` Component
**File:** `components/ui/button.tsx`

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

**Usage:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="outline" size="sm">
  Click me
</Button>
```

#### Other UI Components
- `Card` - Card container with header, content, and footer
- `Input` - Form input field
- `Badge` - Status/label badges
- `Tabs` - Tabbed interface
- `Sheet` - Sliding panel/drawer
- `DropdownMenu` - Dropdown menu component
- `Tooltip` - Hover tooltips
- `Progress` - Progress bar
- `Skeleton` - Loading placeholders
- `Switch` - Toggle switch
- `ScrollArea` - Scrollable content area

---

## Utility Functions

### Core Utilities (`lib/utils.ts`)

#### `cn(...inputs: ClassValue[])`
Combines Tailwind CSS classes using `clsx` and `tailwind-merge`.

**Usage:**
```typescript
import { cn } from '@/lib/utils';

const className = cn('px-4 py-2', 'bg-blue-500', {
  'text-white': isActive,
  'text-gray-600': !isActive
});
```

#### `handleError(error: unknown)`
Standardized error handling and logging.

**Usage:**
```typescript
try {
  // risky operation
} catch (error) {
  handleError(error);
}
```

#### `debounce(func: Function, delay: number)`
Debounces function calls.

**Usage:**
```typescript
const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);
```

#### `download(url: string, filename: string)`
Downloads files from URL.

**Usage:**
```typescript
download('https://example.com/file.pdf', 'document');
```

#### URL Query Utilities
- `formUrlQuery()` - Add parameters to URL
- `removeKeysFromQuery()` - Remove parameters from URL

---

## Type Definitions

### Main Types (`types/index.d.ts`)

#### User Types
```typescript
declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};
```

#### Transaction Types
```typescript
declare type CheckoutTransactionParams = {
  plan: string;
  credits: number;
  amount: number;
  buyerId: string;
};

declare type CreateTransactionParams = {
  stripeId: string;
  amount: number;
  credits: number;
  plan: string;
  buyerId: string;
  createdAt: Date;
};
```

#### URL Query Types
```typescript
declare type FormUrlQueryParams = {
  searchParams: string;
  key: string;
  value: string | number | null;
};
```

---

## Authentication & Middleware

### Middleware (`middleware.ts`)

**Description:** Protects routes using Clerk authentication

**Public Routes:**
- `/sign-in`
- `/sign-up`  
- `/api/webhooks/*`

**Protected Routes:** All other routes require authentication

**Configuration:**
```typescript
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

## Analytics & Tracking

### Analytics Functions (`lib/analytics/dataLayer.ts`)

#### User Events
```typescript
trackSignupStart(signupMethod: SignupMethod)
trackSignupComplete(userId: string, planType: Plan, email?: string)
trackLogin(userId: string, loginMethod: LoginMethod, email?: string)
```

#### Domain Search Events
```typescript
trackDomainSearchInitiated(searchQuery: string, tldFilters: string[], email?: string)
trackDomainSearchResultsLoaded(searchQuery: string, totalResults: number, isDomainAvailable: boolean, suggestedDomains: string[], email?: string)
trackDomainSuggestionClicked(clickedDomain: string, suggestionRank: number, email?: string)
```

#### Purchase Events
```typescript
trackAddToCart(domainName: string, price: number, currency?: Currency, email?: string)
trackPurchaseComplete(transactionId: string, purchasedDomains: DomainItem[], totalValue: number, currency?: Currency, email?: string)
```

#### Credit Events
```typescript
trackCreditUsed(featureName: string, creditsUsed: number = 1)
trackCreditsExhausted(featureName: string, userId: string, email?: string)
```

#### AI Feedback
```typescript
trackAiFeedback(suggestion: string, rating: 'thumbs_up' | 'thumbs_down', comment?: string)
```

---

## Configuration

### Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=mongodb://...
MONGODB_URL=mongodb://...

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
WEBHOOK_SECRET=whsec_...

# AI Generation
GROQ_API_KEY=gsk_...

# Domain API
RAPIDAPI_KEY=...

# Payments
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Analytics
NEXT_PUBLIC_CLARITY_PROJECT_ID=...
```

### Pricing Plans (`constants/index.ts`)

```typescript
export const plans = [
  {
    _id: 1,
    name: "Starter Package",
    price: 0.99,
    credits: 50,
    stripePriceID: "price_1PhNFvFJUXTjfaQFrkc4Rs4M",
  },
  {
    _id: 2,
    name: "Pro Package", 
    price: 1.99,
    credits: 100,
    stripePriceID: "price_1PhNHkFJUXTjfaQFH2c4Rs4M",
  },
  {
    _id: 3,
    name: "Premium Package",
    price: 14.99,
    credits: 2500,
    stripePriceID: "price_1PhNJ6FJUXTjfaQF65eA0A8a",
  },
];
```

### Credit System

- New users receive 20 free credits
- Each name generation costs 1 credit (`creditFee = -1`)
- Domain searches are tracked but don't consume credits
- Credits can be purchased via Stripe integration

---

## Error Handling

### Common Error Patterns

1. **API Errors:** All API endpoints return structured error responses
2. **Database Errors:** Handled via `handleError()` utility
3. **Authentication Errors:** Managed by Clerk middleware
4. **Payment Errors:** Handled by Stripe webhooks

### Error Response Format

```typescript
{
  error: string;        // Error message
  details?: string;     // Additional error details
}
```

---

## Development Guidelines

### Adding New API Endpoints

1. Create route handler in `app/api/[endpoint]/route.ts`
2. Add authentication checks if needed
3. Implement error handling with `handleError()`
4. Add analytics tracking
5. Update this documentation

### Adding New Components

1. Create component in appropriate directory
2. Follow existing naming conventions
3. Use TypeScript interfaces
4. Include proper error boundaries
5. Add analytics tracking for user interactions

### Database Operations

1. Always use `connectToDatabase()` before operations
2. Handle connection errors appropriately
3. Use transactions for multi-step operations
4. Implement proper indexing for performance

---

## Support & Contributing

For questions or contributions, please refer to the project's GitHub repository or contact the development team.

---

*Last updated: [Current Date]*
*Version: 1.0.0*