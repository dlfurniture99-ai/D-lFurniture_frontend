export const siteConfig = {
  name: 'D&L Furnitech',
  description: 'Buy Premium Solid Wood Furniture Online in India - D&L Furnitech offers handcrafted wooden furniture, sofas, beds, dining tables, and more at affordable prices with free delivery.',
  keywords: [
    'wooden furniture online',
    'solid wood furniture',
    'furniture online India',
    'wooden sofa set',
    'wooden bed',
    'dining table online',
    'wooden wardrobe',
    'furniture store near me',
    'best furniture online',
    'customized furniture',
    'sheesham wood furniture',
    'teak wood furniture',
    'affordable furniture',
  ],
  siteUrl: 'https://dlfurnitures.com',
  socialMedia: {
    twitter: '@DLFurnitures',
    facebook: 'DLFurnitures',
    instagram: '@DLFurnitures',
  },
};

export const schemaMarkup = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'D&L Furnitech',
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/logo.jpg`,
    description: siteConfig.description,
    sameAs: [
      'https://www.facebook.com/DLFurnitures',
      'https://www.instagram.com/DLFurnitures',
      'https://www.twitter.com/DLFurnitures',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+91-XXXXXXXXXX',
      email: 'support@dlfurnitures.com',
    },
  },
  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'D&L Furnitech',
    image: `${siteConfig.siteUrl}/hero.png`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    telephone: '+91-XXXXXXXXXX',
    priceRange: '₹5000 - ₹500000',
    areaServed: 'IN',
    availableLanguage: 'en',
  },
};
