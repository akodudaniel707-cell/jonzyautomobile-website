import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  onMessage: (productId: string) => void;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onMessage,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-32 sm:h-40 lg:h-48 rounded-t-lg"></div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
          No products found
        </h3>
        <p className="text-sm sm:text-base text-gray-500 px-4">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onMessage={onMessage}
        />
      ))}
    </div>
  );
};

export default ProductGrid;