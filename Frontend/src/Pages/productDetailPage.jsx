import { useState, useEffect } from "react";
import {
  Heart,
  ArrowLeft,
  Share2,
  Check,
  Clock,
  MapPin,
  Star,
  Camera,
  MessageSquare,
  X,
  ShoppingCart,
  Eye,
  Shield,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Award,
  Package,
  Calendar,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "../../Store/cartStore";
import { useReviewStore } from "../../Store/reviewsStore";
import { useProductStore } from "../../Store/productsStore";
import { useParams } from "react-router-dom";



const fallbackGalleryImages = [
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
  "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
  "https://images.unsplash.com/photo-1545127398-14699f92334b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
];

const mockReviews = [
  {
    id: 1,
    name: "Emily Johnson",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Absolutely incredible work! Sarah captured our wedding day perfectly. Every moment was beautifully documented.",
    avatar: "EJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    date: "1 month ago",
    comment:
      "Professional, creative, and so easy to work with. The photos exceeded our expectations!",
    avatar: "MC",
  },
  {
    id: 3,
    name: "Lisa Rodriguez",
    rating: 4,
    date: "2 months ago",
    comment:
      "Great photography skills and attention to detail. Highly recommend for any special event.",
    avatar: "LR",
  },
];

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [productDetails, setProductDetails] = useState([]);

  const [quantityToBuy, setQuantityToBuy] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { id } = useParams();

  // Mock store functions (replace with actual store calls)
  const { getProductById, fetchedProduct } = useProductStore();

  const { addToCart } = useCartStore();
  const { setisModelOpen } = useReviewStore();

  // Format price to currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  useEffect(() => {
    if (id) {
      getProductById(id);
    }
  }, [getProductById, id]);

  useEffect(() => {
    if (fetchedProduct) {
      setProductDetails(fetchedProduct);
      // Set the first available image as active
      if (fetchedProduct.serviceId?.image?.url) {
        setActiveImage(fetchedProduct.serviceId.image.url);
      } else if (fetchedProduct.images && fetchedProduct.images.length > 0) {
        setActiveImage(fetchedProduct.images[0].imageUrl);
      }
    }
  }, [fetchedProduct]);

  useEffect(() => {
    if (productDetails) {
      if (productDetails.serviceId?.image?.url) {
        setActiveImage(productDetails.serviceId.image.url);
      } else if (productDetails.images && productDetails.images.length > 0) {
        setActiveImage(productDetails.images[0].imageUrl);
      }
    }
  }, [productDetails]);

  const getAllImages = () => {
    if (!productDetails) return fallbackGalleryImages;

    const images = [];
    if (productDetails.serviceId?.image?.url) {
      images.push(productDetails.serviceId.image.url);
    }
    if (productDetails.images && productDetails.images.length > 0) {
      productDetails.images.forEach((img) => {
        if (img.imageUrl && !images.includes(img.imageUrl)) {
          images.push(img.imageUrl);
        }
      });
    }
    return images.length === 0 ? fallbackGalleryImages : images;
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const addToCartHandler = async () => {
    const productToAdd = {
      name: productDetails.productName,
      price: productDetails.price,
      quantity: quantityToBuy,
      typeOf: "product",
      imageUrl:
        productDetails.images[0]?.imageUrl ||
        productDetails.serviceId?.image?.url,
      serviceId: productDetails.serviceId.id || productDetails.serviceId,
      productId: productDetails._id,
    };
    addToCart(productToAdd);
  };

  const nextImage = () => {
    const allImages = getAllImages();
    const nextIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(nextIndex);
    setActiveImage(allImages[nextIndex]);
  };

  const prevImage = () => {
    const allImages = getAllImages();
    const prevIndex =
      currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setActiveImage(allImages[prevIndex]);
  };

  const allImages = getAllImages();
  const reviewCount = mockReviews.length + Math.floor(Math.random() * 47) + 10;

  // Calculate discounted price if available (you can add originalPrice field if needed)
  const hasDiscount = false; // Set based on your business logic
  const originalPrice = hasDiscount ? productDetails.price * 1.2 : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
              <img
                src={activeImage || allImages[0]}
                alt={productDetails.productName}
                className="w-full h-full object-cover"
              />

              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </>
              )}

              {/* Zoom button */}
              <button
                onClick={() => openLightbox(activeImage)}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-all text-sm font-medium flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>Zoom</span>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {productDetails.typeOf}
                </span>
                {productDetails.brand && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {productDetails.brand}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(productDetails.serviceId?.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {productDetails.serviceId?.rating} ({reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productDetails.productName}
              </h1>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(productDetails.price)}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      Save{" "}
                      {Math.round(
                        ((originalPrice - productDetails.price) /
                          originalPrice) *
                          100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">
                {productDetails.description}
              </p>
            </div>

            {/* Category Info */}
            <div className="bg-gray-100 rounded-lg p-3">
              <span className="text-sm text-gray-600">Category: </span>
              <span className="font-medium text-gray-900">
                {productDetails.category}
              </span>
              {productDetails.gender && productDetails.gender !== "Unisex" && (
                <>
                  <span className="text-sm text-gray-600 ml-4">Gender: </span>
                  <span className="font-medium text-gray-900">
                    {productDetails.gender}
                  </span>
                </>
              )}
            </div>

            {productDetails.sizes && productDetails.sizes.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Available Sizes:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {productDetails.sizes.map((size, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200 cursor-pointer text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                {productDetails.quantity > 0 ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <XCircle size={20} className="text-red-500" />
                )}
                <span
                  className={`font-semibold ${
                    productDetails.quantity > 0
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {productDetails.quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
                {productDetails.quantity > 0 && (
                  <span className="text-sm text-gray-500">
                    ({productDetails.quantity} available)
                  </span>
                )}
              </div>
            </div>

            {/* Warranty Information */}
            {productDetails.warranty === "yes" &&
              productDetails.warrantyConditions && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Award size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Warranty Included
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {productDetails.warrantyConditions.map((condition, idx) => (
                      <p key={idx} className="text-sm text-blue-700">
                        • {condition}
                      </p>
                    ))}
                  </div>
                </div>
              )}

            {/* Vendor Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  {productDetails.serviceId?.vendorName?.charAt(0) || "S"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Sold by {productDetails.serviceId?.vendorName || "Seller"}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      Ships in 2-3 days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: "overview", label: "What you will get" },
                    { id: "gallery", label: "Gallery" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-red-500 text-red-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-8">
                {activeTab === "overview" && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {productDetails.features?.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-white" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      )) || <p className="text-gray-500">No features listed</p>}
                    </div>
                  </div>
                )}

                {activeTab === "gallery" && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {allImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => openLightbox(img)}
                        >
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() =>
                    setQuantityToBuy(Math.max(1, quantityToBuy - 1))
                  }
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} className="text-gray-600" />
                </button>
                <span className="px-4 py-2 text-center min-w-[60px] border-x border-gray-300">
                  {quantityToBuy}
                </span>
                <button
                  onClick={() =>
                    setQuantityToBuy(
                      Math.min(productDetails.quantity, quantityToBuy + 1)
                    )
                  }
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={quantityToBuy >= productDetails.quantity}
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => addToCartHandler()}
                disabled={productDetails.quantity <= 0}
                className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  productDetails.quantity > 0
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={20} />
                <span>
                  {productDetails.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                </span>
              </button>

              <button
                onClick={() => setisModelOpen()}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg border border-gray-300 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare size={20} />
                <span>View Reviews ({reviewCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-200 mt-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield size={20} className="text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              Verified Product
            </p>
            <p className="text-xs text-gray-500 mt-1">Authentic guarantee</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck size={20} className="text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
            <p className="text-xs text-gray-500 mt-1">2-3 business days</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <RefreshCw size={20} className="text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Easy Returns</p>
            <p className="text-xs text-gray-500 mt-1">30 day policy</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage}
            alt="Enlarged view"
            className="max-w-screen-lg max-h-screen object-contain"
          />
        </div>
      )}
    </div>
  );
}
