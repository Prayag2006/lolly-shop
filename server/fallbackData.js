export const initialBrands = [
  { name: 'Bazooka', color: '#00aeef', svgType: 'bazooka' },
  { name: 'Chupa Chups', color: '#e20613', svgType: 'chupachups' },
  { name: 'Hershey\'s', color: '#2a120e', svgType: 'hersheys' },
  { name: 'Reeses', color: '#f05a28', svgType: 'reeses' },
  { name: 'Walkers', color: '#ffffff', svgType: 'walkers' },
  { name: 'Warheads', color: '#4a2c81', svgType: 'warheads' }
];

export const defaultUsers = [
  { name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', password: 'password123', role: 'user' },
  { name: 'Matthew Taylor', email: 'matthew.t@hotmail.co.nz', password: 'password123', role: 'user' },
  { name: 'Chloe Smith', email: 'chloe.s@gmail.com', password: 'password123', role: 'user' },
  { name: 'Liam Wilson', email: 'liam.wilson@yahoo.com', password: 'password123', role: 'user' },
  { name: 'Store Administrator', email: 'admin@lollyshop.co.nz', password: 'admin123', role: 'admin' },
  { name: 'John Doe', email: 'john@gmail.com', password: 'user123', role: 'user' }
];

export const initialProducts = [
  {
    id: "p-glo-hearts",
    name: 'GLO HEARTS (MAYCEYS)',
    category: 'Hard Lollies',
    mainCategory: 'NZ Lollies',
    price: 15.99,
    rating: 5.0,
    reviewsCount: 48,
    description: "Mayceys Glo Hearts are iconic New Zealand hard candy hearts with a bright, sweet fruit flavor! Perfect for parties, weddings, Valentine's, and special occasions.",
    ingredients: 'Sugar, Glucose Syrup, Water, Food Acid (Citric Acid), Flavors, Colors (124).',
    nutrition: { calories: '145 kcal', sugar: '28g', fat: '0g', protein: '0g' },
    gradient: 'linear-gradient(135deg, #FF0055 0%, #FF66B2 100%)',
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=600',
    images: ['https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=600'],
    inStock: true,
    quantity: 100,
    isPopular: true,
    isNew: true,
    collections: ['Parties', 'Weddings', 'Valentine', 'Halloween', 'Christmas', 'Birthdays', 'Gifts', 'NZFavourites', 'KiwiFavourites', 'NZLollies', 'KiwiLollies', 'NZCandy', 'KiwiClassics', 'Mayceys', 'Sweet Lollies']
  },
  {
    id: "p-jersey-caramel",
    name: 'JERSEY CARAMEL',
    category: 'Hard Lollies',
    mainCategory: 'NZ Lollies',
    price: 13.99,
    rating: 4.9,
    reviewsCount: 36,
    description: 'Classic Jersey Caramel lollies featuring smooth, rich caramel layers with a soft fudge center. A timeless Kiwi candy classic loved by generations!',
    ingredients: 'Sugar, Glucose Syrup, Condensed Milk, Vegetable Oil, Wheat Flour, Caramel Flavor, Salt.',
    nutrition: { calories: '160 kcal', sugar: '24g', fat: '4.5g', protein: '1.2g' },
    gradient: 'linear-gradient(135deg, #D4A373 0%, #FAEDCD 100%)',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=600',
    images: ['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=600'],
    inStock: true,
    quantity: 100,
    isPopular: true,
    isNew: false,
    collections: ['Parties', 'Weddings', 'Halloween', 'Christmas', 'Birthdays', 'Gifts', 'Kids', 'NZ Favourites', 'Kiwi Favourites', 'Sweet Lollies']
  },
  {
    id: "p-fizzers",
    name: 'FIZZERS',
    category: 'Sour Lollies',
    mainCategory: 'NZ Lollies',
    price: 0.99,
    rating: 4.8,
    reviewsCount: 52,
    description: 'Tangy, mouth-watering sour fizzy candy rolls! Packed with fruity flavor and an electrifying fizz in every bite.',
    ingredients: 'Sugar, Acidity Regulators (Malic Acid, Tartaric Acid), Sodium Bicarbonate, Glucose Syrup, Flavors, Colors.',
    nutrition: { calories: '95 kcal', sugar: '21g', fat: '0g', protein: '0g' },
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    image: 'https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=600',
    images: ['https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=600'],
    inStock: true,
    quantity: 100,
    isPopular: true,
    isNew: false,
    collections: ['NZ Favourites', 'kiwis Favourites', 'Parties', 'Weddings', 'Halloween', 'Christmas', 'Birthdays', 'Gifts', 'Kids']
  }
];

export const defaultTestimonials = [
  {
    name: 'Phoebe S. (Auckland)',
    role: 'Sweet Enthusiast',
    avatar: 'P',
    quote: 'Best Lolly Shop has the most amazing selection! The quality is unmatched and courier delivery within Auckland was overnight. My kids absolutely love their favourites!',
    rating: 5
  },
  {
    name: 'Rawiri K. (Wellington)',
    role: 'Regular Customer',
    avatar: 'R',
    quote: 'I\'ve ordered from many candy stores, but none compare to Best Lolly Shop. Fresh, delicious sweets, and beautifully packaged. Perfect for gifting in NZ!',
    rating: 5
  },
  {
    name: 'Alisha P. (Christchurch)',
    role: 'Party Planner',
    avatar: 'A',
    quote: 'Their bulk lollies for parties are fantastic! Great variety, competitive NZD prices, and the customer service is exceptional. Highly recommended!',
    rating: 5
  },
  {
    name: 'Val M. (Dunedin)',
    role: 'Chocolate Lover',
    avatar: 'V',
    quote: 'The chocolates are divine! Premium quality at reasonable prices. Best Lolly Shop is now my go-to for all sweet cravings in NZ.',
    rating: 5
  }
];
