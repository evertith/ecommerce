export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  features: string[];
  specifications: {
    [key: string]: string;
  };
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    features: [
      'Active Noise Cancellation',
      '40-hour battery life',
      'Bluetooth 5.0',
      'Touch controls',
      'Built-in microphone'
    ],
    specifications: {
      'Brand': 'AudioPro',
      'Model': 'WH-1000XM4',
      'Color': 'Black',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.0',
      'Battery Life': '40 hours'
    }
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop&q=80',
    description: 'Advanced smartwatch with health tracking and notifications.',
    features: [
      'Heart rate monitoring',
      'Sleep tracking',
      'GPS',
      'Water resistant',
      '5-day battery life'
    ],
    specifications: {
      'Brand': 'TechFit',
      'Model': 'SW-200',
      'Color': 'Silver',
      'Weight': '50g',
      'Display': '1.4" AMOLED',
      'Battery Life': '5 days'
    }
  },
  {
    id: '3',
    name: 'Laptop Backpack',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80',
    description: 'Durable and spacious laptop backpack with multiple compartments.',
    features: [
      'Fits 15.6" laptops',
      'Water resistant',
      'USB charging port',
      'Anti-theft design',
      'Padded straps'
    ],
    specifications: {
      'Brand': 'TravelPro',
      'Model': 'SecurePack',
      'Color': 'Gray',
      'Capacity': '25L',
      'Material': 'Polyester',
      'Weight': '1.2kg'
    }
  },
  {
    id: '4',
    name: 'Wireless Mouse',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop&q=80',
    description: 'Ergonomic wireless mouse with precise tracking and long battery life.',
    features: [
      'Ergonomic design',
      'Precise tracking',
      'Long battery life',
      'Silent clicks',
      'Adjustable DPI'
    ],
    specifications: {
      'Brand': 'TechComfort',
      'Model': 'WM-100',
      'Color': 'Black',
      'Connectivity': '2.4GHz',
      'Battery Life': '12 months',
      'DPI Range': '800-1600'
    }
  },
  {
    id: '5',
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop&q=80',
    description: 'RGB mechanical keyboard with custom switches and keycaps.',
    features: [
      'RGB backlight',
      'Cherry MX switches',
      'PBT keycaps',
      'Aluminum frame',
      'USB-C connection'
    ],
    specifications: {
      'Brand': 'KeyMaster',
      'Model': 'MK-200',
      'Color': 'Black',
      'Switch Type': 'Cherry MX Red',
      'Layout': 'TKL',
      'Connection': 'USB-C'
    }
  },
  {
    id: '6',
    name: 'USB-C Hub',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop&q=80',
    description: 'Multi-port USB-C hub with HDMI, USB, and card reader support.',
    features: [
      'HDMI output',
      'USB 3.0 ports',
      'SD card reader',
      'Ethernet port',
      'Power delivery'
    ],
    specifications: {
      'Brand': 'ConnectPro',
      'Model': 'CH-100',
      'Color': 'Silver',
      'Ports': '7-in-1',
      'Power Delivery': '100W',
      'HDMI Resolution': '4K@60Hz'
    }
  }
]; 