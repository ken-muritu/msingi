export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  discount?: number
  images: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  stockCount: number
  description: string
  features: string[]
  specifications: Record<string, string>
  warranty: string
  requiresInstallation?: boolean
  installationFee?: number
  seller: { id: string; name: string; badge: 'basic' | 'verified' | 'premium' | 'authorized'; rating: number; salesCount: number }
  tags: string[]
  bnplAvailable?: boolean
  monthlyInstallment?: number
  isFlashSale?: boolean
  isFeatured?: boolean
  isTrending?: boolean
  deliveryDays: string
}

export interface Review {
  id: string
  productId: string
  author: string
  location: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
  helpful: number
}

const IMAGES = {
  s24: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
  iphone: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80',
  macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
  tv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80',
  fridge: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80',
  washer: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  speaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
}

const SAMSUNG_SELLER = { id: 'sel-1', name: 'Samsung Kenya', badge: 'authorized' as const, rating: 4.9, salesCount: 12400 }
const APPLE_SELLER   = { id: 'sel-2', name: 'Apple Reseller KE', badge: 'premium' as const, rating: 4.8, salesCount: 8200 }
const LG_SELLER      = { id: 'sel-3', name: 'LG Electronics KE', badge: 'authorized' as const, rating: 4.7, salesCount: 6100 }
const TECH_SELLER    = { id: 'sel-4', name: 'TechHub Nairobi', badge: 'verified' as const, rating: 4.5, salesCount: 3400 }

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    brand: 'Samsung', category: 'smartphones',
    price: 179999, originalPrice: 199999, discount: 10,
    images: [IMAGES.s24, IMAGES.iphone, IMAGES.s24],
    rating: 4.8, reviewCount: 342, inStock: true, stockCount: 15,
    description: 'The ultimate Galaxy experience with built-in S Pen, 200MP camera, and titanium frame.',
    features: ['200MP Quad Camera', 'Built-in S Pen', 'Titanium Frame', '5000mAh Battery', '45W Fast Charging', 'AI Photo Editing'],
    specifications: { 'Display': '6.8" Dynamic AMOLED 2X', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12GB', 'Storage': '512GB', 'Battery': '5000mAh', 'OS': 'Android 14' },
    warranty: '1 Year Samsung Kenya Warranty', requiresInstallation: false,
    seller: SAMSUNG_SELLER, tags: ['android', 'flagship', '5g', 's-pen'],
    bnplAvailable: true, monthlyInstallment: 15000, isFlashSale: true, isFeatured: true,
    deliveryDays: '1–2 business days',
  },
  {
    id: 'prod-2',
    name: 'iPhone 15 Pro Max 256GB Natural Titanium',
    brand: 'Apple', category: 'smartphones',
    price: 229999, originalPrice: 249999, discount: 8,
    images: [IMAGES.iphone, IMAGES.s24, IMAGES.tablet],
    rating: 4.9, reviewCount: 218, inStock: true, stockCount: 8,
    description: 'iPhone 15 Pro Max with titanium design, A17 Pro chip, and Action button.',
    features: ['A17 Pro Chip', 'Titanium Design', 'Action Button', '5x Optical Zoom', 'USB-C with USB 3', 'ProMotion 120Hz'],
    specifications: { 'Display': '6.7" Super Retina XDR', 'Chip': 'A17 Pro', 'Storage': '256GB', 'Camera': '48MP Main + 12MP Ultra + 12MP 5x Tele', 'Battery': 'Up to 29hrs video', 'OS': 'iOS 17' },
    warranty: '1 Year Apple International Warranty',
    seller: APPLE_SELLER, tags: ['ios', 'flagship', '5g', 'titanium'],
    bnplAvailable: true, monthlyInstallment: 19167, isFeatured: true, isTrending: true,
    deliveryDays: '1–2 business days',
  },
  {
    id: 'prod-3',
    name: 'MacBook Pro 14" M3 Pro 512GB',
    brand: 'Apple', category: 'laptops',
    price: 289999, originalPrice: 319999, discount: 9,
    images: [IMAGES.macbook, IMAGES.laptop, IMAGES.macbook],
    rating: 4.9, reviewCount: 156, inStock: true, stockCount: 5,
    description: 'MacBook Pro with M3 Pro chip — the most powerful laptop for professionals.',
    features: ['M3 Pro Chip', '18GB Unified Memory', 'Liquid Retina XDR Display', '18-hour Battery', 'MagSafe 3', 'ProRes Video'],
    specifications: { 'Chip': 'Apple M3 Pro', 'Memory': '18GB', 'Storage': '512GB SSD', 'Display': '14.2" Liquid Retina XDR', 'Battery': '70Wh', 'Ports': 'MagSafe 3, 3x Thunderbolt 4, HDMI, SD card' },
    warranty: '1 Year Apple International Warranty',
    seller: APPLE_SELLER, tags: ['apple', 'professional', 'macos', 'm3'],
    bnplAvailable: true, monthlyInstallment: 24167, isFeatured: true,
    deliveryDays: '2–3 business days',
  },
  {
    id: 'prod-4',
    name: 'LG OLED evo C3 65" 4K Smart TV',
    brand: 'LG', category: 'televisions',
    price: 219999, originalPrice: 259999, discount: 15,
    images: [IMAGES.tv, IMAGES.tv, IMAGES.tv],
    rating: 4.7, reviewCount: 98, inStock: true, stockCount: 3,
    description: 'LG OLED evo TV with perfect blacks, infinite contrast, and webOS 23.',
    features: ['OLED evo Panel', 'α9 Gen6 AI Processor 4K', 'Dolby Vision IQ', 'Dolby Atmos', 'Game Optimizer', 'webOS 23'],
    specifications: { 'Size': '65"', 'Resolution': '4K UHD (3840×2160)', 'Panel': 'OLED evo', 'HDR': 'Dolby Vision, HDR10, HLG', 'Sound': '60W 2.2ch', 'HDMI': '4x HDMI 2.1' },
    warranty: '2 Years LG Kenya Warranty + 5 Year Panel Warranty',
    requiresInstallation: true, installationFee: 3500,
    seller: LG_SELLER, tags: ['oled', '4k', 'smart', 'gaming'],
    bnplAvailable: true, monthlyInstallment: 18333, isTrending: true,
    deliveryDays: '3–5 business days',
  },
  {
    id: 'prod-5',
    name: 'Samsung 580L French Door Fridge',
    brand: 'Samsung', category: 'fridges',
    price: 129999, originalPrice: 149999, discount: 13,
    images: [IMAGES.fridge, IMAGES.fridge, IMAGES.fridge],
    rating: 4.6, reviewCount: 73, inStock: true, stockCount: 6,
    description: 'Samsung French Door refrigerator with Twin Cooling Plus and Metal Cooling.',
    features: ['Twin Cooling Plus', 'Metal Cooling', 'SpaceMax Technology', 'Digital Inverter', 'A++ Energy Rating', 'Auto Ice Maker'],
    specifications: { 'Capacity': '580L Total', 'Type': 'French Door', 'Energy': 'A++ Inverter', 'Cooling': 'Twin Cooling Plus', 'Finish': 'Stainless Steel', 'Noise': '40dB' },
    warranty: '5 Year Compressor Warranty + 2 Year Parts',
    requiresInstallation: true, installationFee: 0,
    seller: SAMSUNG_SELLER, tags: ['fridge', 'french-door', 'inverter', 'large'],
    bnplAvailable: true, monthlyInstallment: 10833, isFeatured: true,
    deliveryDays: '3–5 business days',
  },
  {
    id: 'prod-6',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony', category: 'audio',
    price: 45999, originalPrice: 54999, discount: 16,
    images: [IMAGES.headphones, IMAGES.speaker, IMAGES.headphones],
    rating: 4.8, reviewCount: 287, inStock: true, stockCount: 22,
    description: 'Industry-leading noise cancelling headphones with 30-hour battery.',
    features: ['Industry-best ANC', '30-hour Battery', 'Multipoint Connection', 'Speak-to-Chat', 'Hi-Res Audio', 'Foldable Design'],
    specifications: { 'Driver': '30mm', 'Frequency': '4Hz–40,000Hz', 'Battery': '30hrs (ANC on)', 'Charging': 'USB-C, 3hrs full', 'Codec': 'LDAC, AAC, SBC', 'Weight': '250g' },
    warranty: '1 Year Sony Kenya Warranty',
    seller: TECH_SELLER, tags: ['noise-cancelling', 'wireless', 'premium'],
    isFlashSale: true,
    deliveryDays: '1–2 business days',
  },
  {
    id: 'prod-7',
    name: 'Samsung Galaxy Watch 6 Classic 47mm',
    brand: 'Samsung', category: 'accessories',
    price: 58999, originalPrice: 68999, discount: 14,
    images: [IMAGES.watch, IMAGES.watch, IMAGES.watch],
    rating: 4.5, reviewCount: 112, inStock: true, stockCount: 18,
    description: 'Galaxy Watch 6 Classic with rotating bezel and advanced health tracking.',
    features: ['Rotating Bezel', 'Advanced Sleep Coaching', 'Body Composition', 'ECG + Blood Pressure', 'IP68 + 5ATM', 'WearOS 4'],
    specifications: { 'Size': '47mm', 'Display': '1.5" Super AMOLED', 'Battery': '425mAh', 'Storage': '16GB', 'OS': 'WearOS 4 + One UI Watch 5', 'Water': '5ATM + IP68' },
    warranty: '1 Year Samsung Kenya Warranty',
    seller: SAMSUNG_SELLER, tags: ['smartwatch', 'health', 'wearable'],
    deliveryDays: '1–2 business days',
  },
  {
    id: 'prod-8',
    name: 'Canon EOS R50 Mirrorless Camera',
    brand: 'Canon', category: 'cameras',
    price: 98999, originalPrice: 114999, discount: 14,
    images: [IMAGES.camera, IMAGES.camera, IMAGES.camera],
    rating: 4.7, reviewCount: 64, inStock: true, stockCount: 4,
    description: 'Canon EOS R50 — compact mirrorless camera with 24.2MP and Dual Pixel CMOS AF.',
    features: ['24.2MP APS-C Sensor', 'Dual Pixel CMOS AF II', '4K Video', 'In-camera RAW Processing', 'Wi-Fi + Bluetooth', 'Vari-angle Touchscreen'],
    specifications: { 'Sensor': '24.2MP APS-C CMOS', 'AF Points': '651 (Dual Pixel)', 'Video': '4K 30fps, FHD 120fps', 'ISO': '100–32000', 'Battery': '~300 shots', 'Weight': '375g (body)' },
    warranty: '1 Year Canon Kenya Warranty',
    seller: TECH_SELLER, tags: ['mirrorless', '4k', 'content-creator'],
    isTrending: true,
    deliveryDays: '2–3 business days',
  },
  {
    id: 'prod-9',
    name: 'Dell XPS 15 9530 Intel Core i7 RTX 4070',
    brand: 'Dell', category: 'laptops',
    price: 249999, originalPrice: 279999, discount: 11,
    images: [IMAGES.laptop, IMAGES.macbook, IMAGES.laptop],
    rating: 4.6, reviewCount: 89, inStock: true, stockCount: 7,
    description: 'Dell XPS 15 with OLED display, 13th Gen Intel Core i7, and RTX 4070.',
    features: ['OLED Touch Display', 'RTX 4070 8GB', '32GB DDR5 RAM', '1TB NVMe SSD', 'Thunderbolt 4', 'Backlit Keyboard'],
    specifications: { 'Processor': 'Intel Core i7-13700H', 'GPU': 'NVIDIA RTX 4070 8GB', 'RAM': '32GB DDR5', 'Storage': '1TB SSD', 'Display': '15.6" OLED 3.5K Touch', 'Battery': '86Wh 6-cell' },
    warranty: '1 Year Dell ProSupport',
    seller: TECH_SELLER, tags: ['oled', 'gaming', 'rtx', 'professional'],
    bnplAvailable: true, monthlyInstallment: 20833, isFeatured: true,
    deliveryDays: '2–3 business days',
  },
  {
    id: 'prod-10',
    name: 'LG 9kg Front Load Washing Machine',
    brand: 'LG', category: 'washing-machines',
    price: 74999, originalPrice: 89999, discount: 17,
    images: [IMAGES.washer, IMAGES.washer, IMAGES.washer],
    rating: 4.5, reviewCount: 55, inStock: true, stockCount: 9,
    description: 'LG 9kg front load washer with AI DD technology and TurboWash 360.',
    features: ['AI Direct Drive', 'TurboWash 360', 'Steam Wash+', 'A Energy Rating', '6 Motion DD', 'Auto Dosing'],
    specifications: { 'Capacity': '9kg', 'Energy': 'A+++', 'Spin': '1400rpm', 'Programs': '14', 'Noise': '52dB wash / 73dB spin', 'Dimensions': '600×600×850mm' },
    warranty: '10 Year Motor Warranty + 2 Year Parts',
    requiresInstallation: true, installationFee: 2500,
    seller: LG_SELLER, tags: ['washing-machine', 'front-load', 'inverter'],
    bnplAvailable: true, monthlyInstallment: 6250,
    deliveryDays: '3–5 business days',
  },
  {
    id: 'prod-11',
    name: 'iPad Pro 12.9" M2 256GB Wi-Fi',
    brand: 'Apple', category: 'smartphones',
    price: 159999, originalPrice: 179999, discount: 11,
    images: [IMAGES.tablet, IMAGES.iphone, IMAGES.tablet],
    rating: 4.8, reviewCount: 134, inStock: true, stockCount: 10,
    description: 'iPad Pro with M2 chip, Liquid Retina XDR display, and Apple Pencil hover.',
    features: ['M2 Chip', 'Liquid Retina XDR', 'ProMotion 120Hz', 'Apple Pencil Hover', 'Wi-Fi 6E', 'Thunderbolt 4'],
    specifications: { 'Chip': 'Apple M2', 'Display': '12.9" Liquid Retina XDR', 'Storage': '256GB', 'Camera': '12MP Wide + 10MP Ultra', 'Battery': '10hrs', 'Connectivity': 'Wi-Fi 6E, Bluetooth 5.3' },
    warranty: '1 Year Apple International Warranty',
    seller: APPLE_SELLER, tags: ['ipad', 'tablet', 'm2', 'pro'],
    bnplAvailable: true, monthlyInstallment: 13333, isTrending: true,
    deliveryDays: '1–2 business days',
  },
  {
    id: 'prod-12',
    name: 'JBL Charge 5 Portable Bluetooth Speaker',
    brand: 'JBL', category: 'audio',
    price: 16999, originalPrice: 21999, discount: 23,
    images: [IMAGES.speaker, IMAGES.headphones, IMAGES.speaker],
    rating: 4.6, reviewCount: 203, inStock: true, stockCount: 45,
    description: 'JBL Charge 5 with powerful sound, 20-hour battery, and IP67 waterproof.',
    features: ['IP67 Waterproof', '20-Hour Battery', 'USB-C Charging', 'PartyBoost', 'JBL Pro Sound', 'Built-in Powerbank'],
    specifications: { 'Output': '40W RMS', 'Battery': '7500mAh / 20hrs', 'Frequency': '65Hz–20kHz', 'Connectivity': 'Bluetooth 5.1', 'Water': 'IP67', 'Weight': '960g' },
    warranty: '1 Year JBL Warranty',
    seller: TECH_SELLER, tags: ['bluetooth', 'waterproof', 'portable', 'outdoor'],
    isFlashSale: true,
    deliveryDays: '1–2 business days',
  },
]

export const reviews: Review[] = [
  { id: 'rev-1', productId: 'prod-1', author: 'James Kamau', location: 'Nairobi', rating: 5, title: 'Absolutely incredible phone', body: 'The S Pen is a game changer. Camera quality blows everything else out of the water. Fast delivery too!', date: 'March 12, 2025', verified: true, helpful: 24 },
  { id: 'rev-2', productId: 'prod-1', author: 'Amina Hassan', location: 'Mombasa', rating: 4, title: 'Great phone, pricey but worth it', body: 'Battery life is excellent. Only wish it was a bit lighter. M-PESA payment was super easy.', date: 'February 28, 2025', verified: true, helpful: 12 },
  { id: 'rev-3', productId: 'prod-2', author: 'David Otieno', location: 'Kisumu', rating: 5, title: 'Best iPhone yet', body: 'The titanium feels premium. Camera is incredible for photography. Worth every shilling.', date: 'April 1, 2025', verified: true, helpful: 18 },
  { id: 'rev-4', productId: 'prod-6', author: 'Sarah Wanjiku', location: 'Thika', rating: 5, title: 'Life-changing for commuters', body: 'I use matatus daily and these block out all noise. Battery lasts the whole week!', date: 'March 20, 2025', verified: true, helpful: 31 },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, limit)
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.isFeatured).slice(0, limit)
}

export function getFlashSaleProducts(limit = 6): Product[] {
  return products.filter((p) => p.isFlashSale).slice(0, limit)
}

export function formatKES(amount: number): string {
  return `Ksh ${amount.toLocaleString('en-KE')}`
}
