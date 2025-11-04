import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  User,
  ChevronRight,
  Star,
  TrendingUp,
  Truck,
  ShieldCheck,
  ArrowRight,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { useProductStore } from "../../Store/productsStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Triple your money's worth with
              <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {" "}
                Triple Portion
              </span>
            </h1>
            <p className="text-xl text-slate-600">
              Shop the latest trends with free shipping on orders over $50.
              Quality products, unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-semibold border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Browse Categories
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80"
                  alt="Product 1"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=80"
                  alt="Product 2"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80"
                  alt="Product 3"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&auto=format&fit=crop&q=80"
                  alt="Product 4"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryGrid = () => {
  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop&q=80",
      count: "2,341 products",
    },
    {
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&auto=format&fit=crop&q=80",
      count: "5,678 products",
    },
    {
      name: "Home & Living",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80",
      count: "1,234 products",
    },
    {
      name: "Beauty",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=80",
      count: "987 products",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Shop by Category
        </h2>
        <p className="text-slate-600">Explore our wide range of products</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl mb-3 aspect-square">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-sm text-white/90">{category.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductGrid = ({ products }) => {
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid");

  // const products = [
  //   {
  //     id: 1,
  //     name: "Premium Wireless Headphones",
  //     price: 199.99,
  //     originalPrice: 299.99,
  //     rating: 4.8,
  //     reviews: 324,
  //     image:
  //       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  //     badge: "Best Seller",
  //     discount: 33,
  //   },
  //   {
  //     id: 2,
  //     name: "Smart Watch Series 5",
  //     price: 399.99,
  //     originalPrice: 499.99,
  //     rating: 4.9,
  //     reviews: 512,
  //     image:
  //       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  //     badge: "New",
  //     discount: 20,
  //   },
  //   {
  //     id: 3,
  //     name: "Designer Sneakers",
  //     price: 129.99,
  //     originalPrice: 179.99,
  //     rating: 4.7,
  //     reviews: 198,
  //     image:
  //       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  //     badge: "Sale",
  //     discount: 28,
  //   },
  //   {
  //     id: 4,
  //     name: "Leather Backpack",
  //     price: 89.99,
  //     originalPrice: 129.99,
  //     rating: 4.6,
  //     reviews: 156,
  //     image:
  //       "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  //     badge: null,
  //     discount: 31,
  //   },
  //   {
  //     id: 5,
  //     name: "Minimalist Desk Lamp",
  //     price: 59.99,
  //     originalPrice: 89.99,
  //     rating: 4.5,
  //     reviews: 89,
  //     image:
  //       "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
  //     badge: null,
  //     discount: 33,
  //   },
  //   {
  //     id: 6,
  //     name: "Organic Cotton T-Shirt",
  //     price: 29.99,
  //     originalPrice: 49.99,
  //     rating: 4.8,
  //     reviews: 267,
  //     image:
  //       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  //     badge: "Eco-Friendly",
  //     discount: 40,
  //   },
  // ];

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Trending Products
            </h2>
            <p className="text-slate-600">
              Discover what's popular this season
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-white transition-colors">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex bg-white rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-red-100 text-red-600"
                    : "text-slate-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-red-100 text-red-600"
                    : "text-slate-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={
                    product.image
                      ? product.image.imageUrl
                      : product.images && product.images.length > 0
                      ? product.images[0].imageUrl || product.images[0]
                      : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.type && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                    {product.type}
                  </div>
                )}

                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors duration-200 ${
                      favorites.has(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-slate-600"
                    }`}
                  />
                </button>
                <button className="absolute bottom-2 left-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center space-x-1">
                  <ShoppingCart className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>

              <div className="p-3">
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-600 ml-1">
                    ({product.reviews})
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-slate-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold text-slate-900">
                      ${product.price}
                    </span>
                    {/* {product.originalPrice && (
                      <span className="text-xs text-slate-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )} */}
                  </div>
                  <Link
                    to={`/products/${product.type}/${product.serviceId}/${
                      product.id || product._id
                    }`}
                  >
                    <button className="text-red-600 hover:text-red-700 font-medium text-xs flex items-center space-x-0.5">
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            View All Products
          </button>
        </div> */}
      </div>
    </div>
  );
};

const ECommerceMarketplace = () => {
  const { fetchDisplayProducts, displayProducts, loading } = useProductStore();

  useEffect(() => {
    fetchDisplayProducts();
  }, [fetchDisplayProducts]);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      <CategoryGrid />
      <ProductGrid products={displayProducts} />
    </div>
  );
};

export default ECommerceMarketplace;
