export interface Seller {
  id: string
  name: string
  verified: boolean
  isVerified: boolean
  badge: 'basic' | 'verified' | 'premium' | 'authorized'
  rating: number
  salesCount: number
  productCount: number
  totalRevenue: number
  location: string
  responseTime: string
  description: string
}

export interface Product {
  id: string
  name: string
  slug: string
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
  requiresInstallation: boolean
  installationFee?: number
  seller: Seller
  tags: string[]
  bnplAvailable: boolean
  monthlyInstallment?: number
  isFlashSale?: boolean
  isFeatured?: boolean
  isTrending?: boolean
  deliveryDays: string
}

export interface Category {
  id: string
  name: string
  slug: string
  iconName: string
  productCount: number
  color: string
  description: string
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
  imageUrl?: string
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  items: { productId: string; name: string; quantity: number; price: number; image: string }[]
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'mpesa' | 'cash' | 'card' | 'bnpl'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  deliveryAddress: string
  county: string
  createdAt: string
  mpesaRef?: string
  courierName?: string
  trackingNumber?: string
}

export const sellers: Seller[] = [
  { id: 's1', name: 'Samsung Kenya Official', verified: true, isVerified: true, badge: 'authorized', rating: 4.9, salesCount: 3240, productCount: 48, totalRevenue: 4500000, location: 'Nairobi CBD', responseTime: '< 1 hour', description: 'Official Samsung Kenya store — genuine products with full warranty.' },
  { id: 's2', name: 'Avechi Electronics', verified: true, isVerified: true, badge: 'authorized', rating: 4.8, salesCount: 2190, productCount: 120, totalRevenue: 3200000, location: 'Westlands, Nairobi', responseTime: '< 2 hours', description: "Kenya's largest authorised electronics dealer with 10+ brands." },
  { id: 's3', name: 'Techmart Kenya', verified: true, isVerified: true, badge: 'premium', rating: 4.6, salesCount: 1560, productCount: 85, totalRevenue: 1800000, location: 'Mombasa Road', responseTime: '< 3 hours', description: 'Premium electronics and accessories for professionals.' },
  { id: 's4', name: 'Quickmart Electronics', verified: true, isVerified: true, badge: 'verified', rating: 4.5, salesCount: 890, productCount: 42, totalRevenue: 950000, location: 'Kisumu', responseTime: '< 4 hours', description: 'Affordable electronics for Western Kenya.' },
  { id: 's5', name: 'iStore Kenya', verified: true, isVerified: true, badge: 'authorized', rating: 4.9, salesCount: 1870, productCount: 30, totalRevenue: 2700000, location: 'The Junction Mall', responseTime: '< 1 hour', description: 'Authorised Apple Premium Reseller in Kenya.' },
]

export const categories: Category[] = [
  { id: '1', name: 'Smartphones', slug: 'smartphones', iconName: 'Smartphone', productCount: 245, color: 'from-blue-500 to-blue-700', description: 'Latest phones from top brands' },
  { id: '2', name: 'Laptops', slug: 'laptops', iconName: 'Laptop', productCount: 132, color: 'from-violet-500 to-violet-700', description: 'Laptops for work & gaming' },
  { id: '3', name: 'Televisions', slug: 'televisions', iconName: 'Tv', productCount: 89, color: 'from-cyan-500 to-cyan-700', description: 'Smart TVs & home cinema' },
  { id: '4', name: 'Fridges', slug: 'fridges', iconName: 'Thermometer', productCount: 67, color: 'from-teal-500 to-teal-700', description: 'Refrigerators & freezers' },
  { id: '5', name: 'Washing Machines', slug: 'washing-machines', iconName: 'RefreshCw', productCount: 45, color: 'from-indigo-500 to-indigo-700', description: 'Front load & top load' },
  { id: '6', name: 'Audio', slug: 'audio', iconName: 'Headphones', productCount: 178, color: 'from-pink-500 to-pink-700', description: 'Headphones, earbuds & speakers' },
  { id: '7', name: 'Tablets', slug: 'tablets', iconName: 'Tablet', productCount: 54, color: 'from-orange-500 to-orange-700', description: 'Tablets for work & entertainment' },
  { id: '8', name: 'Cookers', slug: 'cookers', iconName: 'Flame', productCount: 38, color: 'from-red-500 to-red-700', description: 'Gas cookers & electric stoves' },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 139999,
    originalPrice: 159999,
    discount: 12,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&q=80',
    ],
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    stockCount: 15,
    description: 'The Samsung Galaxy S24 Ultra redefines flagship performance. Powered by Snapdragon 8 Gen 3, its 200MP quad-camera and built-in S Pen make it the ultimate productivity and creativity companion.',
    features: [
      '200MP quad-camera with 100× Space Zoom',
      'Built-in S Pen with zero latency',
      'Snapdragon 8 Gen 3 for Galaxy',
      '6.8" Dynamic AMOLED 2X, 120Hz ProMotion',
      '5000mAh with 45W fast charging + 15W wireless',
      'Galaxy AI features (Circle to Search, Live Translate)',
    ],
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X, 3088×1440',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'RAM': '12GB',
      'Storage': '256GB / 512GB / 1TB',
      'Main Camera': '200MP + 12MP UW + 50MP 5× + 10MP 3×',
      'Front Camera': '12MP',
      'Battery': '5000mAh',
      'Charging': '45W wired, 15W wireless',
      'OS': 'Android 14, One UI 6.1',
      'Weight': '232g',
      'Colors': 'Titanium Black, Gray, Violet, Yellow',
    },
    warranty: '12 months Samsung Kenya official warranty',
    requiresInstallation: false,
    seller: sellers[0],
    tags: ['5G', 'S Pen', 'AI Camera', 'Flagship', '200MP'],
    bnplAvailable: true,
    monthlyInstallment: 11667,
    isFeatured: true,
    isTrending: true,
    deliveryDays: '1-2 business days',
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    brand: 'Apple',
    category: 'smartphones',
    price: 174999,
    originalPrice: 189999,
    discount: 8,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&q=80',
    ],
    rating: 4.9,
    reviewCount: 189,
    inStock: true,
    stockCount: 8,
    description: 'The iPhone 15 Pro features a lightweight titanium design and the powerful A17 Pro chip — the first 3nm chip in a smartphone. Its 48MP main camera shoots ProRAW and ProRes video.',
    features: [
      'A17 Pro chip – first 3nm mobile chip',
      'Titanium frame with matte glass back',
      '48MP main + 12MP ultrawide + 12MP 3× telephoto',
      'ProMotion 6.1" Super Retina XDR OLED',
      'Action button – fully customizable',
      'USB-C with USB 3 speeds',
    ],
    specifications: {
      'Display': '6.1" LTPO Super Retina XDR, 2556×1179',
      'Chip': 'A17 Pro (3nm)',
      'RAM': '8GB',
      'Storage': '128GB / 256GB / 512GB / 1TB',
      'Camera': '48MP + 12MP UW + 12MP 3× Tele',
      'Front': '12MP TrueDepth',
      'Battery': 'Up to 23h video playback',
      'Connectivity': 'USB-C USB 3, Wi-Fi 6E, 5G',
      'OS': 'iOS 17',
      'Weight': '187g',
    },
    warranty: '12 months Apple Kenya warranty + AppleCare+ option',
    requiresInstallation: false,
    seller: sellers[4],
    tags: ['A17 Pro', 'Titanium', 'ProRAW', 'ProRes', 'Premium'],
    bnplAvailable: true,
    monthlyInstallment: 14583,
    isFeatured: false,
    isTrending: true,
    deliveryDays: '1-2 business days',
  },
  {
    id: '3',
    name: 'Infinix Hot 40 Pro',
    slug: 'infinix-hot-40-pro',
    brand: 'Infinix',
    category: 'smartphones',
    price: 18999,
    originalPrice: 26999,
    discount: 30,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&q=80',
    ],
    rating: 4.3,
    reviewCount: 412,
    inStock: true,
    stockCount: 67,
    description: 'Infinix Hot 40 Pro delivers excellent value with a 6.78" FHD+ display, 108MP camera, and 45W fast charging at an unbeatable price. Perfect for university students and budget-conscious buyers.',
    features: [
      '6.78" FHD+ 90Hz display',
      '108MP main camera',
      '5000mAh battery with 45W fast charging',
      'Helio G99 processor',
      'Dual SIM + expandable storage',
      '3.5mm headphone jack',
    ],
    specifications: {
      'Display': '6.78" IPS LCD, FHD+, 90Hz',
      'Processor': 'MediaTek Helio G99',
      'RAM': '8GB (+ 8GB virtual)',
      'Storage': '256GB',
      'Camera': '108MP + 2MP depth',
      'Front': '32MP',
      'Battery': '5000mAh, 45W',
      'OS': 'Android 13, XOS 13',
      'Weight': '193g',
    },
    warranty: '12 months Infinix Kenya warranty',
    requiresInstallation: false,
    seller: sellers[2],
    tags: ['Budget', '108MP', '45W Charging', 'Student Pick'],
    bnplAvailable: false,
    isFlashSale: true,
    isTrending: false,
    deliveryDays: '2-3 business days',
  },
  {
    id: '4',
    name: 'Apple MacBook Air M3',
    slug: 'macbook-air-m3',
    brand: 'Apple',
    category: 'laptops',
    price: 159999,
    originalPrice: 174999,
    discount: 9,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&q=80',
    ],
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    stockCount: 12,
    description: 'The MacBook Air with M3 chip is the world\'s best consumer laptop. Fanless, silent, and lasting up to 18 hours, it delivers desktop-class performance in a featherlight 1.24kg frame.',
    features: [
      'Apple M3 chip (8-core CPU, 10-core GPU)',
      'Up to 18 hours battery life',
      '13.6" Liquid Retina display, P3 wide color',
      'Silent fanless design, 1.24kg',
      'MagSafe charging + 2× Thunderbolt 4',
      'macOS Sonoma with Apple Intelligence',
    ],
    specifications: {
      'Display': '13.6" Liquid Retina, 2560×1664, P3',
      'Chip': 'Apple M3 (3nm)',
      'CPU Cores': '8-core',
      'GPU Cores': '10-core',
      'RAM': '8GB / 16GB / 24GB',
      'Storage': '256GB / 512GB / 1TB / 2TB SSD',
      'Battery': 'Up to 18h',
      'Weight': '1.24kg',
      'Ports': 'MagSafe 3, 2× Thunderbolt 4, 3.5mm',
      'OS': 'macOS Sonoma',
    },
    warranty: '12 months Apple warranty + AppleCare+ available',
    requiresInstallation: false,
    seller: sellers[4],
    tags: ['M3 Chip', 'Fanless', '18h Battery', 'Ultralight'],
    bnplAvailable: true,
    monthlyInstallment: 13333,
    isFeatured: true,
    isTrending: true,
    deliveryDays: '1-2 business days',
  },
  {
    id: '5',
    name: 'HP Pavilion 15 Laptop',
    slug: 'hp-pavilion-15',
    brand: 'HP',
    category: 'laptops',
    price: 64999,
    originalPrice: 74999,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&q=80',
    ],
    rating: 4.4,
    reviewCount: 287,
    inStock: true,
    stockCount: 24,
    description: 'HP Pavilion 15 is the perfect everyday laptop for work, study, and entertainment. Powered by Intel Core i5 12th Gen with a vibrant FHD IPS display and a full day battery.',
    features: [
      'Intel Core i5-1235U 12th Gen',
      '15.6" FHD IPS anti-glare display',
      '8GB DDR4 RAM, upgradeable to 32GB',
      '512GB NVMe SSD',
      'Intel Iris Xe integrated graphics',
      'HP Fast Charge – 50% in 45 minutes',
    ],
    specifications: {
      'Display': '15.6" FHD IPS (1920×1080)',
      'Processor': 'Intel Core i5-1235U (12th Gen)',
      'RAM': '8GB DDR4-3200',
      'Storage': '512GB PCIe NVMe SSD',
      'Graphics': 'Intel Iris Xe',
      'Battery': '41Wh, ~8h',
      'Weight': '1.75kg',
      'Ports': 'USB-C, 2× USB-A, HDMI, SD, 3.5mm',
      'OS': 'Windows 11 Home',
    },
    warranty: '1 year HP international warranty',
    requiresInstallation: false,
    seller: sellers[1],
    tags: ['Intel i5', 'Windows 11', 'Student', 'Work Laptop'],
    bnplAvailable: true,
    monthlyInstallment: 5417,
    isFeatured: false,
    isTrending: false,
    deliveryDays: '2-3 business days',
  },
  {
    id: '6',
    name: 'Samsung 55" QLED 4K Smart TV',
    slug: 'samsung-55-qled-4k-tv',
    brand: 'Samsung',
    category: 'televisions',
    price: 89999,
    originalPrice: 109999,
    discount: 18,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f4834b?w=600&auto=format&q=80',
    ],
    rating: 4.7,
    reviewCount: 198,
    inStock: true,
    stockCount: 9,
    description: 'Samsung 55" QLED TV with Quantum Dot technology delivers 100% color volume for stunning picture quality. Smart TV with built-in Netflix, YouTube, and DSTV Now.',
    features: [
      'Quantum Dot technology – 100% color volume',
      '4K UHD resolution with HDR10+',
      'Tizen Smart TV – Netflix, YouTube, Prime',
      'Dolby Digital+ sound',
      'Motion Rate 200 – sports & gaming ready',
      'AirPlay 2 & SmartThings compatible',
    ],
    specifications: {
      'Screen Size': '55"',
      'Resolution': '4K UHD (3840×2160)',
      'Panel': 'QLED',
      'HDR': 'HDR10+',
      'Smart Platform': 'Tizen',
      'HDMI Ports': '4',
      'USB Ports': '2',
      'Audio': '20W, Dolby Digital+',
      'Dimensions (with stand)': '124.3×78.4×26.5cm',
    },
    warranty: '2 years Samsung Kenya warranty + free installation',
    requiresInstallation: true,
    installationFee: 0,
    seller: sellers[0],
    tags: ['QLED', '4K', 'Smart TV', 'Netflix', 'Tizen'],
    bnplAvailable: true,
    monthlyInstallment: 7500,
    isFeatured: true,
    isTrending: false,
    deliveryDays: '2-4 business days',
  },
  {
    id: '7',
    name: 'Hisense 43" FHD Smart TV',
    slug: 'hisense-43-fhd-smart-tv',
    brand: 'Hisense',
    category: 'televisions',
    price: 32999,
    originalPrice: 39999,
    discount: 18,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&q=80',
    ],
    rating: 4.3,
    reviewCount: 356,
    inStock: true,
    stockCount: 31,
    description: 'Hisense 43" Smart TV running VIDAA OS with built-in Netflix and YouTube. Full HD display, DTS virtual-X sound, and a slim bezel design for any living room.',
    features: [
      'VIDAA Smart OS with voice search',
      'Full HD 1080p display',
      'DTS Virtual-X surround sound',
      'Dolby Audio',
      'Triple tuner (DVB-T2/S2/C)',
      'Slim bezel design',
    ],
    specifications: {
      'Screen Size': '43"',
      'Resolution': 'Full HD (1920×1080)',
      'Smart Platform': 'VIDAA',
      'HDMI': '3',
      'USB': '2',
      'Audio': '16W',
      'Tuner': 'DVB-T2/S2/C',
    },
    warranty: '2 years Hisense Kenya warranty',
    requiresInstallation: true,
    installationFee: 500,
    seller: sellers[3],
    tags: ['FHD', 'Smart TV', 'VIDAA', 'Budget TV', 'Netflix'],
    bnplAvailable: false,
    isFeatured: false,
    isTrending: false,
    deliveryDays: '2-4 business days',
  },
  {
    id: '8',
    name: 'LG 385L Double Door Fridge',
    slug: 'lg-385l-double-door-fridge',
    brand: 'LG',
    category: 'fridges',
    price: 54999,
    originalPrice: 64999,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&q=80',
    ],
    rating: 4.6,
    reviewCount: 143,
    inStock: true,
    stockCount: 6,
    description: 'LG 385L double door refrigerator with Smart Inverter Compressor for energy efficiency. LinearCooling keeps food fresh 2× longer, and Door Cooling+ ensures even temperature throughout.',
    features: [
      'Smart Inverter Compressor – 10-year warranty',
      'LinearCooling: keeps food fresh 2× longer',
      'Door Cooling+ for fast and even cooling',
      'Hygiene Fresh+ multi-air flow system',
      '385L total capacity (270L fridge + 115L freezer)',
      'A++ Energy Rating',
    ],
    specifications: {
      'Capacity': '385L (270L + 115L)',
      'Energy Rating': 'A++',
      'Compressor': 'Smart Inverter',
      'Freezer': 'Bottom Freezer',
      'Color': 'Silver / Dark Graphite',
      'Dimensions': '70×67.5×182cm',
      'Weight': '78kg',
    },
    warranty: '1 year parts & labor, 10 years compressor warranty',
    requiresInstallation: true,
    installationFee: 1500,
    seller: sellers[1],
    tags: ['Inverter', 'Energy Efficient', 'Bottom Freezer', 'Large Capacity'],
    bnplAvailable: true,
    monthlyInstallment: 4583,
    isFlashSale: true,
    isFeatured: true,
    isTrending: false,
    deliveryDays: '3-5 business days',
  },
  {
    id: '9',
    name: 'LG 9KG Front Load Washing Machine',
    slug: 'lg-9kg-front-load-washing-machine',
    brand: 'LG',
    category: 'washing-machines',
    price: 64999,
    originalPrice: 74999,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&q=80',
    ],
    rating: 4.5,
    reviewCount: 98,
    inStock: true,
    stockCount: 11,
    description: 'LG 9kg front-load washing machine with AI DD (Direct Drive) technology learns fabric weight and softness for the optimal wash cycle every time. TurboWash 360° washes full loads in 39 minutes.',
    features: [
      'AI Direct Drive – learns your fabric type',
      'TurboWash 360° – full load in 39 minutes',
      'Steam technology removes 99.9% of allergens',
      '1400 RPM spin speed',
      'Eco Hybrid mode for energy savings',
      'Smart Diagnosis via LG ThinQ app',
    ],
    specifications: {
      'Capacity': '9kg',
      'Spin Speed': '1400 RPM',
      'Energy Rating': 'A+++',
      'Programs': '14',
      'Dimensions': '60×56×85cm',
      'Weight': '72kg',
      'Noise': '49dB wash, 74dB spin',
    },
    warranty: '2 years parts & labor, 10 years motor warranty',
    requiresInstallation: true,
    installationFee: 2000,
    seller: sellers[1],
    tags: ['AI DD', 'TurboWash', 'Steam', 'Front Load', 'Inverter'],
    bnplAvailable: true,
    monthlyInstallment: 5417,
    isFeatured: false,
    isTrending: false,
    deliveryDays: '3-5 business days',
  },
  {
    id: '10',
    name: 'Bruhm 4-Burner Gas Cooker',
    slug: 'bruhm-4-burner-gas-cooker',
    brand: 'Bruhm',
    category: 'cookers',
    price: 16999,
    originalPrice: 21999,
    discount: 23,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&q=80',
    ],
    rating: 4.4,
    reviewCount: 267,
    inStock: true,
    stockCount: 44,
    description: 'Bruhm 60cm freestanding 4-burner gas cooker with electric oven and grill. Stainless steel finish, auto-ignition, and full safety cut-off valves on all burners.',
    features: [
      '4 gas burners with auto-ignition',
      '65L electric oven with grill',
      'Stainless steel finish',
      'Safety cut-off valve on all burners',
      'Removable cast iron pan supports',
      'Turbo grill for faster cooking',
    ],
    specifications: {
      'Burners': '4 gas (1 wok + 2 semi-rapid + 1 auxiliary)',
      'Oven Capacity': '65L',
      'Ignition': 'Auto-electric',
      'Fuel': 'LPG / Natural Gas',
      'Width': '60cm',
      'Material': 'Stainless Steel',
      'Warranty': '1 year',
    },
    warranty: '1 year Bruhm Kenya warranty',
    requiresInstallation: true,
    installationFee: 1000,
    seller: sellers[3],
    tags: ['Gas Cooker', '4 Burner', 'Electric Oven', 'Auto-ignition'],
    bnplAvailable: false,
    isFeatured: false,
    isTrending: false,
    deliveryDays: '2-4 business days',
  },
  {
    id: '11',
    name: 'Sony WH-1000XM5 Headphones',
    slug: 'sony-wh-1000xm5',
    brand: 'Sony',
    category: 'audio',
    price: 27999,
    originalPrice: 34999,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&q=80',
    ],
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    stockCount: 18,
    description: 'Sony WH-1000XM5 – the gold standard of noise cancellation. Eight microphones and two processors deliver unmatched ANC. 30-hour battery life with quick charge. Crystal-clear calls with AI noise reduction.',
    features: [
      'Industry-leading noise cancellation – 8 microphones',
      '30h battery + 3h from 3-min quick charge',
      'Multipoint Bluetooth (connect 2 devices)',
      'Speak-to-Chat & Touch Sensor controls',
      '360 Reality Audio certified',
      '30mm driver with Sony DSEE Extreme',
    ],
    specifications: {
      'Driver Unit': '30mm',
      'Frequency': '4Hz–40,000Hz',
      'Bluetooth': '5.2, SBC/AAC/LDAC',
      'Battery': '30h (ANC on)',
      'Quick Charge': '3 min → 3h',
      'Weight': '250g',
      'Foldable': 'Yes',
      'Mic': '8 microphones',
    },
    warranty: '1 year Sony Kenya warranty',
    requiresInstallation: false,
    seller: sellers[2],
    tags: ['ANC', 'LDAC', '30h Battery', 'Premium Audio', 'Multipoint'],
    bnplAvailable: false,
    isFeatured: false,
    isTrending: true,
    deliveryDays: '1-3 business days',
  },
  {
    id: '12',
    name: 'JBL Charge 5 Portable Speaker',
    slug: 'jbl-charge-5',
    brand: 'JBL',
    category: 'audio',
    price: 11999,
    originalPrice: 16999,
    discount: 29,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&q=80',
    ],
    rating: 4.7,
    reviewCount: 441,
    inStock: true,
    stockCount: 53,
    description: 'JBL Charge 5 delivers powerful sound with a built-in power bank. IP67 waterproof and dustproof, it charges your devices while playing music for up to 20 hours.',
    features: [
      'IP67 waterproof and dustproof',
      '20h battery life',
      'USB-C power bank to charge your phone',
      'JBL PartyBoost – pair with multiple speakers',
      'Pure Bass with passive radiator',
      'Speakerphone with noise-cancelling mic',
    ],
    specifications: {
      'Output Power': '30W RMS',
      'Frequency': '65Hz–20kHz',
      'Bluetooth': '5.1',
      'Battery': '7500mAh (20h playback)',
      'Charging': 'USB-C, charges phone via USB-A',
      'Waterproof': 'IP67',
      'Weight': '960g',
    },
    warranty: '1 year JBL warranty',
    requiresInstallation: false,
    seller: sellers[2],
    tags: ['Waterproof', 'IP67', 'Power Bank', '20h Battery', 'PartyBoost'],
    bnplAvailable: false,
    isFlashSale: true,
    isTrending: false,
    deliveryDays: '1-3 business days',
  },
  {
    id: '13',
    name: 'Samsung Galaxy Tab S9',
    slug: 'samsung-galaxy-tab-s9',
    brand: 'Samsung',
    category: 'tablets',
    price: 69999,
    originalPrice: 79999,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&q=80',
    ],
    rating: 4.7,
    reviewCount: 134,
    inStock: true,
    stockCount: 14,
    description: 'Samsung Galaxy Tab S9 with Dynamic AMOLED 2X display and IP68 water resistance. Snapdragon 8 Gen 2 powers seamless multitasking, DeX mode, and Samsung Notes with the S Pen included.',
    features: [
      '11" Dynamic AMOLED 2X, 120Hz, Vision Booster',
      'Snapdragon 8 Gen 2 for Galaxy',
      'IP68 water & dust resistance',
      'S Pen included (in-box)',
      'Samsung DeX desktop mode',
      '8400mAh battery with 45W fast charge',
    ],
    specifications: {
      'Display': '11" Dynamic AMOLED 2X, 2560×1600',
      'Processor': 'Snapdragon 8 Gen 2',
      'RAM': '8GB / 12GB',
      'Storage': '128GB / 256GB',
      'Camera': '13MP rear, 12MP ultra-wide front',
      'Battery': '8400mAh, 45W',
      'OS': 'Android 13, One UI 5.1',
      'Weight': '498g',
    },
    warranty: '1 year Samsung Kenya warranty',
    requiresInstallation: false,
    seller: sellers[0],
    tags: ['AMOLED', 'S Pen', 'IP68', 'DeX', 'Snapdragon 8 Gen 2'],
    bnplAvailable: true,
    monthlyInstallment: 5833,
    isFeatured: false,
    isTrending: false,
    deliveryDays: '1-3 business days',
  },
  {
    id: '14',
    name: 'Apple AirPods Pro 2nd Gen',
    slug: 'airpods-pro-2',
    brand: 'Apple',
    category: 'audio',
    price: 29999,
    originalPrice: 34999,
    discount: 14,
    images: [
      'https://images.unsplash.com/photo-1590658006821-04f4008d5717?w=600&auto=format&q=80',
    ],
    rating: 4.8,
    reviewCount: 278,
    inStock: true,
    stockCount: 22,
    description: 'AirPods Pro 2 with H2 chip delivers 2× more noise cancellation than the original. Adaptive Transparency, Conversation Awareness, and 30h total battery with MagSafe charging case.',
    features: [
      '2× improved Active Noise Cancellation (H2 chip)',
      'Adaptive Transparency – hear what matters',
      'Personalized Spatial Audio',
      '30h total battery (6h AirPods + 24h case)',
      'MagSafe & wireless charging case',
      'IPX4 sweat and water resistance',
    ],
    specifications: {
      'Chip': 'Apple H2',
      'ANC': '2× improved',
      'Battery': '6h + 24h case = 30h total',
      'Connectivity': 'Bluetooth 5.3',
      'Charging': 'MagSafe, Lightning, Qi',
      'Water Resistance': 'IPX4',
      'Weight': '5.3g per earbud',
    },
    warranty: '1 year Apple warranty',
    requiresInstallation: false,
    seller: sellers[4],
    tags: ['H2 Chip', 'ANC', 'MagSafe', 'Spatial Audio', 'Premium'],
    bnplAvailable: false,
    isFeatured: false,
    isTrending: true,
    deliveryDays: '1-2 business days',
  },
  {
    id: '15',
    name: 'TCL 65" QLED 4K Smart TV',
    slug: 'tcl-65-qled-4k-tv',
    brand: 'TCL',
    category: 'televisions',
    price: 79999,
    originalPrice: 94999,
    discount: 16,
    images: [
      'https://images.unsplash.com/photo-1571415060716-baff7991ddc3?w=600&auto=format&q=80',
    ],
    rating: 4.5,
    reviewCount: 176,
    inStock: true,
    stockCount: 7,
    description: 'TCL 65" QLED TV with mini-LED backlighting and Dolby Vision IQ for cinema-quality picture. Google TV built-in gives access to 700,000+ movies and shows, with Google Assistant.',
    features: [
      'QLED with mini-LED backlight',
      'Dolby Vision IQ + Dolby Atmos',
      'Google TV – 700K+ apps',
      'ONKYO 2.0 sound system (30W)',
      'HDR Premium 1000',
      'HDMI 2.1 with 144Hz VRR for gaming',
    ],
    specifications: {
      'Screen Size': '65"',
      'Resolution': '4K UHD',
      'Panel': 'QLED Mini-LED',
      'HDR': 'Dolby Vision IQ, HDR10+',
      'Smart': 'Google TV',
      'Audio': '30W, Dolby Atmos',
      'HDMI': '4 (1× HDMI 2.1)',
      'Gaming': '144Hz VRR, ALLM, FreeSync',
    },
    warranty: '2 years TCL Kenya warranty',
    requiresInstallation: true,
    installationFee: 0,
    seller: sellers[3],
    tags: ['QLED', 'Google TV', 'Dolby Vision', '65 inch', '4K'],
    bnplAvailable: true,
    monthlyInstallment: 6667,
    isFeatured: false,
    isTrending: false,
    deliveryDays: '3-5 business days',
  },
  {
    id: '16',
    name: 'Xiaomi Redmi Note 13 Pro+',
    slug: 'xiaomi-redmi-note-13-pro-plus',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 34999,
    originalPrice: 42999,
    discount: 19,
    images: [
      'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600&auto=format&q=80',
    ],
    rating: 4.5,
    reviewCount: 389,
    inStock: true,
    stockCount: 38,
    description: 'Xiaomi Redmi Note 13 Pro+ packs a 200MP OIS camera and 120W HyperCharge into a sleek curved AMOLED display. Achieves 0–100% charge in 19 minutes — perfect for the busy Kenyan on the go.',
    features: [
      '200MP OIS main camera',
      '120W HyperCharge – 0 to 100% in 19 minutes',
      '6.67" 1.5K AMOLED, 120Hz curved display',
      'MediaTek Dimensity 7200-Ultra',
      'IP68 water and dust resistance',
      '5000mAh battery',
    ],
    specifications: {
      'Display': '6.67" 1.5K AMOLED 120Hz',
      'Processor': 'Dimensity 7200-Ultra',
      'RAM': '12GB',
      'Storage': '256GB / 512GB',
      'Main Camera': '200MP OIS + 8MP UW + 2MP macro',
      'Front': '16MP',
      'Battery': '5000mAh, 120W',
      'OS': 'MIUI 14 / HyperOS',
      'Weight': '204g',
    },
    warranty: '1 year Xiaomi Kenya warranty',
    requiresInstallation: false,
    seller: sellers[2],
    tags: ['200MP', '120W Charging', 'AMOLED', 'IP68', 'Curved Display'],
    bnplAvailable: false,
    isFeatured: false,
    isTrending: false,
    deliveryDays: '2-3 business days',
  },
]

export const reviews: Review[] = [
  { id: 'r1', productId: '1', author: 'David M.', location: 'Nairobi', rating: 5, title: 'Best Android phone I\'ve ever owned', body: 'The camera is insane. 100× zoom is not a gimmick. The S Pen makes this a real productivity tool. M-PESA integration on Samsung Pay works flawlessly.', date: '2024-03-12', verified: true, helpful: 34 },
  { id: 'r2', productId: '1', author: 'Amina K.', location: 'Mombasa', rating: 4, title: 'Excellent phone, slightly heavy', body: 'Screen quality is unmatched. Battery lasts me through the day easily. Only complaint is the weight – it\'s a bit heavy for one-handed use.', date: '2024-02-28', verified: true, helpful: 18 },
  { id: 'r3', productId: '4', author: 'Brian O.', location: 'Kisumu', rating: 5, title: 'MacBook Air is worth every shilling', body: 'I run heavy design projects on this with zero fan noise. Battery honestly lasts 15+ hours of real work. The M3 chip is incredibly fast.', date: '2024-03-01', verified: true, helpful: 27 },
  { id: 'r4', productId: '6', author: 'Mary W.', location: 'Nakuru', rating: 5, title: 'Picture quality is stunning', body: 'The QLED colors are vibrant without being over-saturated. Setup was easy and the Samsung support team came for installation on time. Very happy!', date: '2024-02-15', verified: true, helpful: 21 },
  { id: 'r5', productId: '11', author: 'Tom N.', location: 'Thika', rating: 5, title: 'These headphones are genuinely magical', body: 'The noise cancellation blocks out matatu noise completely. I use them for morning commute and can finally focus. Best purchase this year.', date: '2024-03-20', verified: true, helpful: 45 },
]

export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerName: 'Sarah Wanjiku',
    customerPhone: '+254 712 345 678',
    items: [
      { productId: '1', name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 139999, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&auto=format&q=80' },
    ],
    total: 139999,
    status: 'delivered',
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    deliveryAddress: '14 Hurlingham Road, Nairobi',
    county: 'Nairobi',
    createdAt: '2024-03-18T09:30:00Z',
    mpesaRef: 'QGH7R4KLMN',
    courierName: 'G4S Courier',
    trackingNumber: 'G4S-2024-44521',
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Brian Ochieng',
    customerPhone: '+254 722 876 543',
    items: [
      { productId: '12', name: 'JBL Charge 5', quantity: 1, price: 11999, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&auto=format&q=80' },
      { productId: '14', name: 'Apple AirPods Pro 2', quantity: 1, price: 29999, image: 'https://images.unsplash.com/photo-1590658006821-04f4008d5717?w=200&auto=format&q=80' },
    ],
    total: 41998,
    status: 'shipped',
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    deliveryAddress: 'Kisumu CBD, Oginga Odinga St',
    county: 'Kisumu',
    createdAt: '2024-03-20T14:15:00Z',
    mpesaRef: 'RKL9P2WXYZ',
    courierName: 'Fargo Courier',
    trackingNumber: 'FRG-2024-88932',
  },
  {
    id: 'ORD-2024-003',
    customerName: 'Mercy Achieng',
    customerPhone: '+254 733 222 111',
    items: [
      { productId: '5', name: 'HP Pavilion 15', quantity: 1, price: 64999, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&auto=format&q=80' },
    ],
    total: 64999,
    status: 'processing',
    paymentMethod: 'bnpl',
    paymentStatus: 'paid',
    deliveryAddress: 'Westlands, Ring Road',
    county: 'Nairobi',
    createdAt: '2024-03-21T10:00:00Z',
  },
  {
    id: 'ORD-2024-004',
    customerName: 'John Kamau',
    customerPhone: '+254 700 111 222',
    items: [
      { productId: '8', name: 'LG 385L Fridge', quantity: 1, price: 54999, image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&auto=format&q=80' },
    ],
    total: 54999,
    status: 'confirmed',
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    deliveryAddress: 'Kitengela, Namanga Road',
    county: 'Kajiado',
    createdAt: '2024-03-22T16:45:00Z',
    mpesaRef: 'VYX3M8QRST',
  },
  {
    id: 'ORD-2024-005',
    customerName: 'Grace Njeri',
    customerPhone: '+254 711 444 333',
    items: [
      { productId: '4', name: 'MacBook Air M3', quantity: 1, price: 159999, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&q=80' },
    ],
    total: 159999,
    status: 'pending',
    paymentMethod: 'card',
    paymentStatus: 'pending',
    deliveryAddress: 'Karen, Langata Road',
    county: 'Nairobi',
    createdAt: '2024-03-22T18:00:00Z',
  },
]

export const flashSaleProducts = products.filter((p) => p.isFlashSale)
export const featuredProducts = products.filter((p) => p.isFeatured)
export const trendingProducts = products.filter((p) => p.isTrending)

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, limit)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  )
}
