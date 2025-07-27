import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Heart,
  ShoppingCart,
  Star,
  StarHalf,
  Grid,
  List,
  ArrowLeft,
  ArrowRight,
  Package,
  Sparkles,
  TrendingUp,
  Zap,
  Eye,
  MessageSquare,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useProductStore } from "../../Store/productsStore";
import { Link, useParams } from "react-router-dom";
import { useCartStore } from "../../Store/cartStore";

const MainProductPage = () => {
  // State management remains unchanged
  // const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { getProducts, products: allProducts } = useProductStore();
  const { addToCart: handleAddToCart } = useCartStore();

  const { id } = useParams();

  const productsPerPage = 8;

  // Mock products data for demonstration
  const [products, setProducts] = useState([]);

  // Initialize products on component mount
  useEffect(() => {
    getProducts(id);
  }, [getProducts, id]);

  useEffect(() => {
    if (allProducts.length > 0) {
      setProducts(allProducts);
    }
  }, [allProducts]);
  // Categories logic
  useEffect(() => {
    if (products.length > 0) {
      const categoryMap = new Map();
      products.forEach((product) => {
        if (product.category) {
          const categoryKey = product.category.toLowerCase();
          if (categoryMap.has(categoryKey)) {
            categoryMap.get(categoryKey).count++;
          } else {
            categoryMap.set(categoryKey, {
              id: categoryKey,
              name:
                product.category.charAt(0).toUpperCase() +
                product.category.slice(1),
              count: 1,
            });
          }
        }
      });
      setCategories(Array.from(categoryMap.values()));
      setFilteredProducts(products);
    } else {
      setCategories([]);
      setFilteredProducts([]);
    }
  }, [products]);

  // Pagination logic
  useEffect(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const productsToShow = filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
    setCurrentProducts(productsToShow);
  }, [filteredProducts, currentPage, productsPerPage]);

  // Filtering logic
  useEffect(() => {
    let result = [...products];

    if (activeCategory) {
      result = result.filter(
        (product) => product.category?.toLowerCase() === activeCategory
      );
    }

    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.productName?.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search) ||
          product.category?.toLowerCase().includes(search) ||
          product.brand?.toLowerCase().includes(search)
      );
    }

    if (sortOption === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "name") {
      result = [...result].sort(
        (a, b) => a.productName?.localeCompare(b.productName) || 0
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, activeCategory, sortOption, products]);

  // Cart management

  const addToCart = (product) => {
    const productToAdd = {
      productId: product._id,
      quantity: 1,
      price: product.price,
      name: product.productName,
      imageUrl: product.images[0].imageUrl,
      serviceId: product.serviceId,
    };

    handleAddToCart(productToAdd);
    console.log(product);
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const renderStars = (rating) => {
    const stars = [];
    const ratingValue = rating || 0;
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-red-400 text-red-400" />
        );
      } else if (i - 0.5 <= ratingValue) {
        stars.push(
          <StarHalf key={i} className="w-4 h-4 fill-red-400 text-red-400" />
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  // Empty state component
  const NoProductsFound = () => (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="bg-gray-100 rounded-full p-8 mb-6">
        <Package className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        No products found
      </h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {searchTerm || activeCategory
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Our product catalog is being updated. Check back soon!"}
      </p>
      {(searchTerm || activeCategory) && (
        <div className="flex gap-3">
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Clear Search
            </button>
          )}
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl mb-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative px-8 py-16 md:px-16 md:py-20">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-red-200" />
                <span className="text-red-200 font-medium text-sm uppercase tracking-wide">
                  Welcome to Our Store
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Explore Our Latest Collection
              </h2>
              <p className="text-red-100 text-lg mb-8 leading-relaxed">
                Discover a variety of products tailored to your needs. Start
                browsing today and find what you love!
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rating</option>
                <option value="name">Name: A-Z</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${
                    viewMode === "grid"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${
                    viewMode === "list"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <span className="text-sm font-medium text-gray-700 mr-4">
                  Categories:
                </span>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                      activeCategory === category.id
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-300"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {products.length > 0 && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {currentProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>
              {activeCategory && (
                <span className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                  <Filter className="w-3 h-3 mr-1" />
                  {categories.find((c) => c.id === activeCategory)?.name}
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div
              className={`grid gap-6 mb-12 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Image Section */}
                  <div
                    className={`relative bg-gray-50 ${
                      viewMode === "list"
                        ? "w-48 flex-shrink-0"
                        : "aspect-square"
                    } rounded-t-xl overflow-hidden`}
                  >
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-10 transition-colors ${
                        wishlist.includes(product._id)
                          ? "text-red-600"
                          : "text-gray-400 hover:text-red-600"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(product._id) ? "fill-current" : ""
                        }`}
                      />
                    </button>

                    {product.quantity < 5 && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Only {product.quantity} left
                      </div>
                    )}

                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].imageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.productName}
                    </h3>

                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-sm text-gray-500">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      ${product.price?.toFixed(2) || "0.00"}
                    </div>

                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                        <Link to={`/view/${product._id}`}>
                          <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            View
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-red-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <NoProductsFound />
        )}
      </div>
    </div>
  );
};

export default MainProductPage;
