import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main_settings', unique: true },
  
  // Announcement Marquees
  marquees: {
    type: [{
      text: { type: String, default: '' },
      enabled: { type: Boolean, default: true },
      color: { type: String, default: '#ffffff' },
      bgColor: { type: String, default: '#e72c83' },
      icon: { type: String, default: '🍬' },
      speed: { type: Number, default: 40 },
      pauseOnHover: { type: Boolean, default: true },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' }
    }],
    default: [
      {
        text: "🍬 NZ'S FAVORITE CANDY STORE — FREE SHIPPING ON ORDERS OVER $50!",
        enabled: true,
        color: '#ffffff',
        bgColor: '#e72c83',
        icon: '🍬',
        speed: 40,
        pauseOnHover: true
      },
      {
        text: "🍭 GET 10% OFF YOUR FIRST ORDER WITH CODE: SWEET10",
        enabled: true,
        color: '#ffffff',
        bgColor: '#f472b6',
        icon: '🍭',
        speed: 35,
        pauseOnHover: true
      }
    ]
  },

  // Popup Promotions
  popupOffers: [{
    enabled: { type: Boolean, default: true },
    delay: { type: Number, default: 3000 },
    title: { type: String, default: "🎉 Special Sweet Deal!" },
    description: { type: String, default: "Get 15% off on all sour gummies this weekend. Use code at checkout!" },
    code: { type: String, default: "SOUR15" },
    discountPercent: { type: Number, default: 15 },
    buttonText: { type: String, default: "Shop Sours" },
    buttonLink: { type: String, default: "/shop?category=Sour%20Lollies" },
    image: { type: String, default: "" },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    targetPages: { type: [String], default: ['/'] },
    frequencyDays: { type: Number, default: 1 }
  }],

  // Mega Navigation Menu
  megaMenu: {
    type: [{
      title: { type: String, required: true },
      items: { type: [String], default: [] }
    }],
    default: [
      {
        title: 'NZ Lollies',
        items: ['Soft Lollies', 'Hard Lollies', 'Sour Lollies', 'Sweet Lollies', 'Sugar Coated', 'Mayceys', 'Finni', 'Pascals', 'Other', 'Sugar Free', 'Vegan', 'Jellybeans']
      },
      {
        title: 'Imported Lollies',
        items: ['Airheads', 'Cotton Candy', 'Theatre Boxes', 'Popping Candy', 'Novelty', 'Lollipops', 'Sugar Free', 'Vegan']
      },
      {
        title: 'Chocolates',
        items: ['Bars', 'Cadbury', 'Nestle', 'Whitakers', 'Imported Chocolates', 'Share bags', 'Sugar Free', 'Vegan']
      },
      {
        title: 'Drinks',
        items: ['Hydration', 'Cans', 'Bottles', 'Multi Pack', 'Sugar Free']
      },
      {
        title: 'Snacks',
        items: ['Chips', 'Tackies', 'Cheetos', 'Kool Aid']
      },
      {
        title: 'Bulk',
        items: ['Soft Lollies', 'Hard Lollies', 'Chocolates']
      },
      {
        title: 'TikTok Viral',
        items: ['Peel me lollies', 'Freeze Dried Candies']
      },
      {
        title: 'Pick by Colour',
        items: ['Red Colour', 'Blue Colour', 'Yellow Colour', 'Pink Colour', 'Black Colour']
      },
      {
        title: 'Confectionery',
        items: ['Toys', 'Toys with Lolly']
      },
      {
        title: 'Special / Clearance',
        items: ['Heading 1', 'Heading 2']
      }
    ]
  },

  // General Settings
  websiteName: { type: String, default: 'Best Lolly Shop' },
  websiteLogo: { type: String, default: '' },
  websiteFavicon: { type: String, default: '' },
  themeColors: {
    primary: { type: String, default: '#e72c83' },
    secondary: { type: String, default: '#f472b6' },
    background: { type: String, default: '#faf9fc' },
    text: { type: String, default: '#2d2645' }
  },
  fonts: { type: String, default: 'Outfit, sans-serif' },
  currency: { type: String, default: 'NZD' },
  timezone: { type: String, default: 'Pacific/Auckland' },
  googleAnalytics: { type: String, default: '' },
  facebookPixel: { type: String, default: '' },

  // Hero Section
  hero: {
    heading: { type: String, default: 'SWEETEN YOUR EVERYDAY LIFE!' },
    subheading: { type: String, default: 'PREMIUM NEW ZEALAND CONFECTIONS' },
    description: { type: String, default: "Indulge in our exquisite gourmet selection of hand-picked imported lollies, luxury chocolates, and sour straps. Freshly packed and delivered straight to your door across NZ." },
    buttonText: { type: String, default: 'Explore Sweet Shop' },
    buttonLink: { type: String, default: '/shop' },
    secondaryButtonText: { type: String, default: 'Best Sellers' },
    secondaryButtonLink: { type: String, default: '#favourites' },
    heroImage: { type: String, default: '/hero_candy_display.png' },
    backgroundImage: { type: String, default: '' },
    floatingIcons: { type: [String], default: ['🍬', '🍭', '🍫', '🍑', '🍒'] },
    badgeText: { type: String, default: 'New NZ Confections' }
  },

  // About Us Page
  aboutUs: {
    heading: { type: String, default: 'Our Sweet Journey' },
    subheading: { type: String, default: 'Crafting smiles and supplying the finest confections across New Zealand since 2018.' },
    description: { type: String, default: 'Lolly Shop began with a simple mission: to bring the joy of premium confections right to your doorstep. Over the years, we have sourced the finest candies from around the globe while supporting local Kiwi makers.' },
    story: { type: String, default: 'Our story started in Auckland with a tiny storefront and a big passion for quality confectionery. Today, we are proud to be New Zealand\'s leading online sweet delivery store, sending thousands of packages of happiness every month.' },
    mission: { type: String, default: 'To satisfy every sweet tooth with top-tier, fresh lollies, while delivering exceptional, reliable service.' },
    vision: { type: String, default: 'To become the premier confection hub in the Southern Hemisphere, known for unique imported varieties and premium local packaging.' },
    images: { type: [String], default: ['/about_showcase1.png'] },
    gallery: { type: [String], default: [] },
    buttonText: { type: String, default: 'Visit the Shop' },
    buttonLink: { type: String, default: '/shop' },
    seoTitle: { type: String, default: 'About Best Lolly Shop - Premium NZ Sweets' },
    seoDescription: { type: String, default: 'Read our story and mission. Learn how Best Lolly Shop became New Zealand\'s favorite online sweet candy store.' },
    metaKeywords: { type: String, default: 'about us, lolly shop, candy nz, kiwi sweets' },
    ogImage: { type: String, default: '' }
  },

  // Contact Us Page
  contactUs: {
    address: { type: String, default: '17 Braid Road, St Andrews, Hamilton 3200, New Zealand' },
    phone: { type: String, default: '021 123 4567' },
    email: { type: String, default: 'bestlollyshopnz@gmail.com' },
    businessHours: { type: String, default: 'Monday - Saturday: 9:00 AM - 6:00 PM' },
    googleMap: { type: String, default: 'https://maps.google.com/maps?q=17%20Braid%20Road,%20St%20Andrews,%20Hamilton%203200,%20New%20Zealand&t=&z=15&ie=UTF8&iwloc=&output=embed' },
    facebookLink: { type: String, default: 'https://facebook.com' },
    instagramLink: { type: String, default: 'https://instagram.com' },
    tiktokLink: { type: String, default: 'https://tiktok.com' },
    formEmailRecipient: { type: String, default: 'bestlollyshopnz@gmail.com' },
    formEnabled: { type: Boolean, default: true }
  },

  // Footer Settings
  footer: {
    description: { type: String, default: 'NZ\'s favorite online candy store. Hand-picked imported confections, luxury chocolates, and sour straps delivered directly to your doorstep.' },
    quickLinks: {
      type: [{
        label: { type: String },
        link: { type: String }
      }],
      default: [
        { label: 'Shop All', link: '/shop' },
        { label: 'About Us', link: '/about' },
        { label: 'Contact Us', link: '/contact' }
      ]
    },
    policies: {
      type: [{
        label: { type: String },
        link: { type: String }
      }],
      default: [
        { label: 'Privacy Policy', link: '/privacy-policy' },
        { label: 'Terms of Service', link: '/terms-of-service' }
      ]
    },
    copyright: { type: String, default: '© 2026 Best Lolly Shop. All rights reserved.' }
  },

  // Header Settings
  header: {
    sticky: { type: Boolean, default: true },
    showSearch: { type: Boolean, default: true },
    logoText: { type: String, default: 'Best Lolly Shop' }
  },

  // Dynamic Page SEO Overrides
  seoOverrides: {
    type: Map,
    of: {
      title: { type: String },
      description: { type: String },
      keywords: { type: String },
      ogImage: { type: String }
    },
    default: {}
  }
}, { timestamps: true });

settingsSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
settingsSchema.set('toJSON', { virtuals: true });
settingsSchema.set('toObject', { virtuals: true });

export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
