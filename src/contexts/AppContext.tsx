import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, CartItem, Message, MediaAttachment, Customer, Order, BlogPost } from '@/types';

interface SavedSearch {
  id: string;
  query: string;
  category?: string;
  notificationsEnabled: boolean;
  createdAt: Date;
  matchCount: number;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  products: Product[];
  filteredProducts: Product[];
  cart: CartItem[];
  currentUser: User;
  messages: Message[];
  savedSearches: SavedSearch[];
  customers: Customer[];
  orders: Order[];
  blogPosts: BlogPost[];
  isAdminAuthenticated: boolean;
  authenticateAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  sendMessage: (receiverId: string, content: string, productId?: string, media?: any[]) => void;
  searchProducts: (query: string, category?: string) => void;
  saveSearch: (query: string, category?: string) => void;
  toggleSearchNotifications: (searchId: string, enabled: boolean) => void;
  deleteSavedSearch: (searchId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'views'>) => void;
  deleteBlogPost: (id: string) => void;
  incrementBlogViews: (id: string) => void;
  sendMarketingEmail: (subject: string, message: string) => Promise<void>;
}

const ADMIN_PASSWORD = 'jonzy2026';

const mockAdmin: User = {
  id: 'admin-1',
  name: 'JonzyAutomobile Admin',
  email: 'admin@jonzyautomobile.ng',
  isAdmin: true,
  rating: 4.9,
  avatar: '/placeholder.svg'
};

const mockProducts: Product[] = [
  {
    id: '1',
    title: '2022 Toyota Camry',
    description: 'Brand new Toyota Camry with full warranty and premium features',
    price: 15500000,
    category: 'Vehicles',
    images: [
      'https://d64gsuwffb70l.cloudfront.net/688278e0a9392a6ae2c558c4_1757471252539_2151f31c.webp',
      'https://d64gsuwffb70l.cloudfront.net/688278e0a9392a6ae2c558c4_1757471254586_65926f8c.webp'
    ],
    location: 'Lagos, Nigeria',
    condition: 'new',
    createdAt: new Date(),
    adminId: 'admin-1',
    isSold: false
  },
  {
    id: '2',
    title: 'Luxury 3BR Apartment Ikoyi',
    description: 'Premium 3-bedroom apartment with ocean view in Ikoyi, Lagos',
    price: 2500000,
    category: 'Apartments for rent',
    images: [
      'https://d64gsuwffb70l.cloudfront.net/688278e0a9392a6ae2c558c4_1757471263629_0aa7f649.webp'
    ],
    location: 'Lagos, Nigeria',
    condition: 'new',
    createdAt: new Date(),
    adminId: 'admin-1',
    isSold: false
  },
  {
    id: '3',
    title: 'iPhone 15 Pro Max',
    description: 'Latest iPhone 15 Pro Max with 512GB storage, unlocked',
    price: 1850000,
    category: 'Electronics',
    images: [
      'https://d64gsuwffb70l.cloudfront.net/688278e0a9392a6ae2c558c4_1757471276187_280fb00d.webp'
    ],
    location: 'Abuja, Nigeria',
    condition: 'new',
    createdAt: new Date(),
    adminId: 'admin-1',
    isSold: false
  },
  {
    id: '4',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Latest Samsung flagship with S Pen and advanced camera system',
    price: 1650000,
    category: 'Electronics',
    images: [
      'https://d64gsuwffb70l.cloudfront.net/688278e0a9392a6ae2c558c4_1757471285064_4f3db66c.webp'
    ],
    location: 'Lagos, Nigeria',
    condition: 'new',
    createdAt: new Date(),
    adminId: 'admin-1',
    isSold: false
  }
];

const mockBlogPosts: BlogPost[] = [
  {
    id: 'b1',
    title: 'Top 5 Cars to Buy in Nigeria 2026',
    content: 'Looking for the best cars to purchase in Nigeria this year? Our experts have curated a list of the top 5 vehicles that offer excellent value, reliability, and resale potential. From fuel-efficient sedans to spacious SUVs, we cover what every Nigerian buyer needs to know before making their next big purchase.',
    type: 'article',
    thumbnail: 'https://d64gsuwffb70l.cloudfront.net/688278e0a9392a6ae2c558c4_1757471252539_2151f31c.webp',
    author: 'JonzyAutomobile',
    createdAt: new Date(),
    views: 42
  },
  {
    id: 'b2',
    title: 'How to Choose the Right Apartment in Lagos',
    content: 'Finding the perfect apartment in Lagos can be challenging. In this comprehensive guide, we walk you through location selection, budget planning, security considerations, and legal aspects of renting in Nigeria\'s biggest city.',
    type: 'article',
    thumbnail: 'https://d64gsuwffb70l.cloudfront.net/688278e0a9392a6ae2c558c4_1757471263629_0aa7f649.webp',
    author: 'JonzyAutomobile',
    createdAt: new Date(),
    views: 28
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Helper to safely load from localStorage
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
  }
  return fallback;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('jonzy-products', mockProducts));
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('jonzy-cart', []));
  const [currentUser] = useState<User>(mockAdmin);
  const [messages, setMessages] = useState<Message[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(() => loadFromStorage('jonzy-customers', []));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('jonzy-orders', []));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadFromStorage('jonzy-blog', mockBlogPosts));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem('jonzy-admin-auth') === 'true'
  );

  // Persist data
  useEffect(() => { localStorage.setItem('jonzy-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('jonzy-products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('jonzy-customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('jonzy-orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('jonzy-blog', JSON.stringify(blogPosts)); }, [blogPosts]);

  // Keep filteredProducts in sync when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Automated recurring marketing email (simulated – runs once every 7 days per browser)
  useEffect(() => {
    const lastRun = localStorage.getItem('jonzy-last-marketing');
    const now = Date.now();
    const WEEK = 7 * 24 * 60 * 60 * 1000;
    if (customers.length > 0 && (!lastRun || now - parseInt(lastRun) > WEEK)) {
      // Fire and forget – subscribe all customers to CRM so they receive broadcasts
      customers.forEach(c => {
        fetch('/api/crm/69e1bf759fe601f60b927e06/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: c.email, name: c.name, tag: 'recurring-customer' })
        }).catch(() => {});
      });
      localStorage.setItem('jonzy-last-marketing', String(now));
    }
  }, [customers]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const authenticateAdmin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('jonzy-admin-auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('jonzy-admin-auth');
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: Date.now().toString(),
        productId, 
        quantity: 1,
        addedAt: new Date()
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const sendMessage = (receiverId: string, content: string, productId?: string, media?: any[]) => {
    const mediaAttachments: MediaAttachment[] = media ? media.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      type: item.type,
      url: URL.createObjectURL(item.file),
      filename: item.file.name,
      size: item.file.size,
      duration: item.type === 'audio' ? 0 : undefined
    })) : [];

    const messageType = media && media.length > 0 ? 
      (media[0].type === 'audio' ? 'voice' : 'media') : 'text';

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId,
      productId,
      content,
      timestamp: new Date(),
      media: mediaAttachments,
      messageType
    }]);
  };

  const searchProducts = (query: string, category?: string) => {
    let filtered = products;
    if (query.trim()) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category && category !== 'All Categories') {
      filtered = filtered.filter(product => product.category === category);
    }
    setFilteredProducts(filtered);
  };

  const saveSearch = (query: string, category?: string) => {
    if (savedSearches.find(s => s.query.toLowerCase() === query.toLowerCase() && s.category === category)) return;
    const matchCount = products.filter(product => {
      const matchesQuery = query.trim() ? (
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      ) : true;
      const matchesCategory = category && category !== 'All Categories' ? product.category === category : true;
      return matchesQuery && matchesCategory;
    }).length;
    setSavedSearches(prev => [...prev, {
      id: Date.now().toString(), query, category,
      notificationsEnabled: true, createdAt: new Date(), matchCount
    }]);
  };

  const toggleSearchNotifications = (searchId: string, enabled: boolean) => {
    setSavedSearches(prev => prev.map(s => s.id === searchId ? { ...s, notificationsEnabled: enabled } : s));
  };

  const deleteSavedSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== searchId));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...productData, id: Date.now().toString() };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);

    // Update / create customer record
    setCustomers(prev => {
      const existing = prev.find(c => c.email.toLowerCase() === orderData.customerEmail.toLowerCase());
      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          name: orderData.customerName,
          phone: orderData.customerPhone,
          address: orderData.customerAddress,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + orderData.total,
          lastPurchase: new Date()
        } : c);
      }
      return [...prev, {
        id: `CUST-${Date.now()}`,
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        address: orderData.customerAddress,
        totalOrders: 1,
        totalSpent: orderData.total,
        lastPurchase: new Date(),
        createdAt: new Date()
      }];
    });

    // Reduce inventory (mark sold if last)
    orderData.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        setProducts(prev => prev.map(p => p.id === item.productId ? { ...p, isSold: true } : p));
      }
    });

    // Subscribe customer to CRM for order confirmation & future marketing
    fetch('/api/crm/69e1bf759fe601f60b927e06/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: orderData.customerEmail,
        name: orderData.customerName,
        phone: orderData.customerPhone,
        tag: 'customer',
        metadata: {
          orderId: newOrder.id,
          total: orderData.total,
          items: orderData.items.length
        }
      })
    }).catch(() => {});

    // Clear the cart after successful order
    setCart([]);

    return newOrder;
  };

  const addBlogPost = (post: Omit<BlogPost, 'id' | 'createdAt' | 'views'>) => {
    setBlogPosts(prev => [{
      ...post,
      id: `BLOG-${Date.now()}`,
      createdAt: new Date(),
      views: 0
    }, ...prev]);
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
  };

  const incrementBlogViews = (id: string) => {
    setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, views: p.views + 1 } : p));
  };

  const sendMarketingEmail = async (subject: string, message: string) => {
    // Broadcast to CRM by re-subscribing customers with message tag
    await Promise.all(customers.map(c =>
      fetch('/api/crm/69e1bf759fe601f60b927e06/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: c.email,
          name: c.name,
          tag: 'marketing-broadcast',
          metadata: { subject, message }
        })
      }).catch(() => {})
    ));
  };

  return (
    <AppContext.Provider value={{
      sidebarOpen, toggleSidebar, products, filteredProducts, cart,
      currentUser, messages, savedSearches, customers, orders, blogPosts,
      isAdminAuthenticated, authenticateAdmin, logoutAdmin,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      sendMessage, searchProducts, saveSearch, toggleSearchNotifications, deleteSavedSearch,
      addProduct, updateProduct, deleteProduct,
      placeOrder, addBlogPost, deleteBlogPost, incrementBlogViews, sendMarketingEmail
    }}>
      {children}
    </AppContext.Provider>
  );
};
