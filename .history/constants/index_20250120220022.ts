export const navLinks = [
    {
      label: "Home",
      route: "/",
      icon: "/assets/icons/home.svg",
    },
    {
      label: "Domain Finder",
      route: "/names",
      icon: "/assets/icons/search.svg",
    },
    {
      label: "Profile",
      route: "/profile",
      icon: "/assets/icons/profile.svg",
    },
    {
      label: "Buy Credits",
      route: "/credits",
      icon: "/assets/icons/coins.svg",
    },
  ];
  
  export const plans = [
    {
      _id: 1,
      name: "Starter Package",
      icon: "/assets/icons/free-plan.svg",
      price: 0.99,
      credits: 50,
      stripePriceID: "price_1PhNFvFJUXTjfaQFrkc4Rs4M",
      inclusions: [
        {
          label: "50 Credits one-time purchase",
          isIncluded: true,
        },
        {
          label: "20 Free Credits upon sign up",
          isIncluded: true,
        },
        {
          label: "Basic Customer Support",
          isIncluded: false,
        },
        {
          label: "Measly Updates",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 2,
      name: "Pro Package",
      icon: "/assets/icons/free-plan.svg",
      price: 1.99,
      credits: 100,
      stripePriceID: "price_1PhNHkFJUXTjfaQFH2c4Rs4M",
      inclusions: [
        {
          label: "100 Credits a month",
          isIncluded: true,
        },
        {
          label: "Full Access to Services",
          isIncluded: true,
        },
        {
          label: "Priority Customer Support",
          isIncluded: true,
        },
        {
          label: "Priority Updates",
          isIncluded: false,
        },
      ],
    },
    {
      _id: 3,
      name: "Premium Package",
      icon: "/assets/icons/free-plan.svg",
      price: 14.99,
      credits: 2500,
      stripePriceID: "price_1PhNJ6FJUXTjfaQF65eA0A8a",
      inclusions: [
        {
          label: "2500 Credits a month",
          isIncluded: true,
        },
        {
          label: "Full Access to Services",
          isIncluded: true,
        },
        {
          label: "Priority Customer Support",
          isIncluded: true,
        },
        {
          label: "Priority Updates",
          isIncluded: true,
        },
      ],
    },
  ];
  
export const searchDefaults = {
  industry: "",
  description: "",
  tone: "",
  nameLength: "any",
};

export const searchOptions = {
  nameLength: [
    { value: "any", label: "Any Length" },
    { value: "short", label: "Short (3-6 chars)" },
    { value: "medium", label: "Medium (7-10 chars)" },
    { value: "long", label: "Long (11+ chars)" },
  ],
  tone: [
    { value: "professional", label: "Professional" },
    { value: "creative", label: "Creative" },
    { value: "fun", label: "Fun" },
    { value: "technical", label: "Technical" },
    { value: "modern", label: "Modern" },
  ],
};
  
  export const creditFee = -1;
