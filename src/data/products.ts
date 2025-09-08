import { Product } from '@/types/product';
import headphonesImg from '@/assets/headphones.jpg';
import smartphoneImg from '@/assets/smartphone.jpg';
import laptopImg from '@/assets/laptop.jpg';
import smartwatchImg from '@/assets/smartwatch.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    image: headphonesImg,
    category: 'Audio',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    rating: 4.8,
    inStock: true,
  },
  {
    id: '2',
    name: 'Latest Smartphone',
    price: 899.99,
    image: smartphoneImg,
    category: 'Electronics',
    description: 'Cutting-edge smartphone with advanced features and stunning display.',
    rating: 4.7,
    inStock: true,
  },
  {
    id: '3',
    name: 'Ultra-thin Laptop',
    price: 1299.99,
    image: laptopImg,
    category: 'Computers',
    description: 'Powerful and portable laptop perfect for work and entertainment.',
    rating: 4.9,
    inStock: true,
  },
  {
    id: '4',
    name: 'Smart Fitness Watch',
    price: 249.99,
    image: smartwatchImg,
    category: 'Wearables',
    description: 'Advanced smartwatch with health tracking and fitness features.',
    rating: 4.6,
    inStock: true,
  },
  {
    id: '5',
    name: 'Wireless Earbuds Pro',
    price: 179.99,
    image: headphonesImg,
    category: 'Audio',
    description: 'Compact wireless earbuds with superior sound quality and long battery life.',
    rating: 4.5,
    inStock: true,
  },
  {
    id: '6',
    name: 'Gaming Laptop',
    price: 1899.99,
    image: laptopImg,
    category: 'Computers',
    description: 'High-performance gaming laptop with powerful graphics and fast processor.',
    rating: 4.8,
    inStock: false,
  },
];