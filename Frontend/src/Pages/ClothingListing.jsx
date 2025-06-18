import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, Heart, ShoppingCart, Star, StarHalf, Grid, List, ArrowLeft, ArrowRight, Package, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useClothingStore } from "../../Store/clothingStore";
import { Link, useParams } from "react-router-dom";

const MainClothingPage = () => {
    // The interface breathed with controlled precision. Each state variable positioned exactly where needed.
    const [cartItems, setCartItems] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortOption, setSortOption] = useState("featured");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const { getAllClothes, clothing: allClothing } = useClothingStore()

    const { id } = useParams()

    const productsPerPage = 8;

    // Mock products data for demonstration
    const [products, setProducts] = useState([]);

    // Initialize products on component mount
    useEffect(() => {
        getAllClothes(id)
    }, [getAllClothes, id]);

    useEffect(() => {
        if (allClothing.length > 0) {
            setProducts(allClothing);
        }
    }, [allClothing]);

    // Categories emerged from the data landscape. Not imposed, but discovered.
    useEffect(() => {
        if (products.length > 0) {
            const categoryMap = new Map();

            products.forEach(product => {
                if (product.category) {
                    const categoryKey = product.category.toLowerCase();
                    if (categoryMap.has(categoryKey)) {
                        categoryMap.get(categoryKey).count++;
                    } else {
                        categoryMap.set(categoryKey, {
                            id: categoryKey,
                            name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
                            count: 1
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

    // Pagination logic. Methodical division of information into digestible portions.
    useEffect(() => {
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const productsToShow = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
        setCurrentProducts(productsToShow);
    }, [filteredProducts, currentPage, productsPerPage]);

    // The filtering algorithm. Each parameter adjusted with surgical precision.
    useEffect(() => {
        let result = [...products];

        if (activeCategory) {
            result = result.filter((product) => product.category?.toLowerCase() === activeCategory);
        }

        if (searchTerm.trim() !== "") {
            const search = searchTerm.toLowerCase();
            result = result.filter(
                (product) =>
                    product.productName?.toLowerCase().includes(search) ||
                    product.description?.toLowerCase().includes(search) ||
                    product.category?.toLowerCase().includes(search) ||
                    product.brand?.toLowerCase().includes(search) ||
                    product.gender?.toLowerCase().includes(search)
            );
        }

        if (sortOption === "price-low") {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-high") {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortOption === "name") {
            result = [...result].sort((a, b) => a.productName?.localeCompare(b.productName) || 0);
        } else if (sortOption === "brand") {
            result = [...result].sort((a, b) => a.brand?.localeCompare(b.brand) || 0);
        }

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [searchTerm, activeCategory, sortOption, products]);

    // Cart manipulation. Each addition calculated, deliberate.
    const addToCart = useCallback(
        (product) => {
            const existingItem = cartItems.find((item) => item._id === product._id);

            if (existingItem) {
                setCartItems(
                    cartItems.map((item) =>
                        item._id === product._id
                            ? { ...item, cartQuantity: item.cartQuantity + 1 }
                            : item
                    )
                );
            } else {
                setCartItems([...cartItems, { ...product, cartQuantity: 1 }]);
            }
        },
        [cartItems]
    );

    // Wishlist toggle. Binary choice executed with quiet precision.
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

    // Get the first available image from the product
    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) {
            return product.images[0].imageUrl;
        }
        return null;
    };

    // Format price display
    const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : '0.00';
    };

    // Check if product is low in stock
    const isLowStock = (quantity) => {
        return quantity < 5;
    };

    // The floating cart. Persistent reminder of accumulated choices.
    const FloatingCart = () => (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-2xl shadow-2xl hover:shadow-red-500/25 hover:from-red-700 hover:to-red-800 transition-all duration-300 relative group transform hover:scale-105"
                onClick={() => {/* Cart panel logic remains dormant for now */ }}
            >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-semibold animate-pulse">
                        {cartItems.reduce((total, item) => total + item.cartQuantity, 0)}
                    </span>
                )}
                <span className="absolute -bottom-12 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg whitespace-nowrap backdrop-blur-sm">
                    View Cart
                </span>
            </button>
        </div>
    );

    // Empty state. The void where products should exist.
    const NoProductsFound = () => (
        <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-amber-100 rounded-full blur-2xl opacity-50"></div>
                <div className="relative text-gray-400 p-8 bg-white rounded-3xl shadow-lg">
                    <Package className="w-20 h-20 mx-auto" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No products found</h3>
            <p className="text-gray-500 text-center mb-8 max-w-md leading-relaxed">
                {searchTerm || activeCategory
                    ? "We couldn't find any products matching your criteria. Try adjusting your search or explore different categories."
                    : "Our shelves are being restocked with amazing products. Please check back soon for exciting new arrivals!"
                }
            </p>
            {(searchTerm || activeCategory) && (
                <div className="flex gap-3">
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-full hover:from-red-100 hover:to-red-200 transition-all duration-300 text-sm font-medium shadow-sm"
                        >
                            Clear Search
                        </button>
                    )}
                    {activeCategory && (
                        <button
                            onClick={() => setActiveCategory(null)}
                            className="px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-full hover:from-red-100 hover:to-red-200 transition-all duration-300 text-sm font-medium shadow-sm"
                        >
                            Clear Filter ({categories.find(c => c.id === activeCategory)?.name})
                            <span className="ml-2">×</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
            <FloatingCart />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section - The opening statement */}
                <section className="pt-8 mb-20">
                    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-amber-600 rounded-3xl shadow-2xl overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>

                        <div className="relative flex flex-col lg:flex-row justify-between items-center p-8 lg:p-16">
                            <div className="lg:w-1/2 mb-8 lg:mb-0 text-white z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles className="w-6 h-6 text-amber-300" />
                                    <span className="text-amber-200 font-medium text-sm uppercase tracking-wider">Limited Time</span>
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                                    Fashion Sale
                                </h1>
                                <p className="text-lg lg:text-xl mb-8 text-white/90 leading-relaxed max-w-lg">
                                    Discover premium clothing and accessories with amazing discounts. Limited quantities available!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="bg-white text-red-700 px-8 py-4 rounded-2xl font-semibold hover:bg-white/95 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Shop Now
                                    </button>
                                    <button className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                                        View Collection
                                    </button>
                                </div>
                            </div>
                            <div className="lg:w-1/2 flex justify-center relative z-10">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-red-400/30 rounded-3xl blur-2xl"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                                        alt="Fashion Collection"
                                        className="relative w-full max-w-md rounded-2xl object-cover shadow-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search Interface - The gateway to discovery */}
                <section className="mb-12">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        <div className="flex-1 max-w-2xl">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search for amazing products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 shadow-lg hover:shadow-xl text-lg placeholder-gray-400"
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                {searchTerm && (
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                        <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                                            {filteredProducts.length} found
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-3 rounded-xl transition-all duration-300 ${viewMode === "grid"
                                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                                        : "hover:bg-gray-50 text-gray-600"
                                        }`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-3 rounded-xl transition-all duration-300 ${viewMode === "list"
                                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                                        : "hover:bg-gray-50 text-gray-600"
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories - Taxonomy of desire */}
                {categories.length > 0 && (
                    <section className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">
                                Explore Categories
                            </h2>
                            <p className="text-gray-600 text-lg">Discover products tailored to your interests</p>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${activeCategory === category.id
                                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl shadow-red-500/25'
                                        : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 shadow-lg hover:shadow-xl border border-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold">{category.name}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${activeCategory === category.id
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gradient-to-r from-red-100 to-amber-100 text-red-600'
                                            }`}>
                                            {category.count}
                                        </span>
                                    </div>
                                    {activeCategory !== category.id && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-amber-500/0 group-hover:from-red-500/5 group-hover:to-amber-500/5 transition-all duration-300"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Products Section - The catalog of possibilities */}
                <section className="mb-20">
                    {products.length > 0 && (
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Zap className="w-5 h-5 text-red-500" />
                                    <span className="font-medium">
                                        Showing {currentProducts.length} of {filteredProducts.length} products
                                    </span>
                                </div>
                                {activeCategory && (
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-full text-sm font-medium hover:from-red-100 hover:to-red-200 transition-all duration-300 shadow-sm"
                                    >
                                        <Filter className="w-4 h-4" />
                                        {categories.find(c => c.id === activeCategory)?.name}
                                        <span className="ml-1 text-lg">×</span>
                                    </button>
                                )}
                            </div>
                            <select
                                className="w-full lg:w-56 bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="featured">✨ Featured</option>
                                <option value="price-low">💰 Price: Low to High</option>
                                <option value="price-high">💎 Price: High to Low</option>
                                <option value="name">🔤 Name: A-Z</option>
                                <option value="brand">🏷️ Brand: A-Z</option>
                            </select>
                        </div>
                    )}

                    {/* Product Grid - Where choices crystallize into action */}
                    {currentProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {currentProducts.map((product) => (
                                    <div key={product._id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 relative overflow-hidden flex flex-col h-full transform hover:scale-[1.02]">
                                        {/* Wishlist - The heart's quiet preference */}
                                        <button
                                            className={`absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center z-20 transition-all duration-300 hover:scale-110 ${wishlist.includes(product._id)
                                                ? 'text-red-500 bg-red-50 shadow-red-200'
                                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                }`}
                                            onClick={() => toggleWishlist(product._id)}
                                        >
                                            <Heart className={`w-5 h-5 ${wishlist.includes(product._id) ? 'fill-current' : ''}`} />
                                        </button>

                                        {/* Image - Visual reality of the object */}
                                        <div className="relative h-52 bg-gradient-to-b from-gray-50 to-white overflow-hidden rounded-t-3xl">
                                            {isLowStock(product.quantity) && (
                                                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-2 rounded-full z-10 shadow-lg animate-pulse">
                                                    Only {product.quantity} left!
                                                </div>
                                            )}

                                            {/* Brand badge */}
                                            {product.brand && (
                                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md">
                                                    {product.brand}
                                                </div>
                                            )}

                                            {getProductImage(product) ? (
                                                <img
                                                    src={getProductImage(product)}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                                    <div className="text-gray-300 text-center">
                                                        <Package className="w-12 h-12 mx-auto mb-2" />
                                                        <span className="text-sm">No Image</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content - The essential information */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {product.category}
                                                </span>
                                                {product.gender && (
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {product.gender}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight"
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                {product.productName}
                                            </h3>

                                            {/* Show available sizes if any */}
                                            {product.sizes && product.sizes.length > 0 && (
                                                <div className="mb-3">
                                                    <span className="text-xs text-gray-500 mb-1 block">Available Sizes:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {product.sizes.slice(0, 4).map((size, index) => (
                                                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                                {size}
                                                            </span>
                                                        ))}
                                                        {product.sizes.length > 4 && (
                                                            <span className="text-xs text-gray-400">+{product.sizes.length - 4} more</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Price and Actions - The moment of decision */}
                                            <div className="mt-auto">
                                                <div className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                                                        ${formatPrice(product.price)}
                                                    </span>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-2xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => addToCart(product)}
                                                        disabled={product.quantity === 0}
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                        {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                    </button>
                                                    <Link to={`/service/Traditional-Clothing/view/${product._id}`}>
                                                        <button className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 py-3 px-4 rounded-2xl font-semibold hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200 hover:border-gray-300">
                                                            View
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination - Navigation through the catalog's architecture */}
                            {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-6 mt-16">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-gray-100 hover:border-red-200 group"
                                            disabled={currentPage === 1}
                                            onClick={() => paginate(currentPage - 1)}
                                        >
                                            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                                        </button>

                                        <div className="flex gap-2">
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
                                                        className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${currentPage === pageNum
                                                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25'
                                                            : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 shadow-lg hover:shadow-xl border border-gray-100'
                                                            }`}
                                                        onClick={() => paginate(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-gray-100 hover:border-red-200 group"
                                            disabled={currentPage === totalPages}
                                            onClick={() => paginate(currentPage + 1)}
                                        >
                                            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                                        </button>
                                    </div>

                                    <div className="text-sm text-gray-600 bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-100">
                                        Showing page {currentPage} of {totalPages} ({filteredProducts.length} total products)
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <NoProductsFound />
                    )}
                </section>
            </div>
        </div>
    );
};

export default MainClothingPage;