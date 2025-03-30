
import { ShoppingBag, Check, Package, Truck, Shield } from 'lucide-react';


const ProductSection = () => {
    return (
        <div className="max-w-full mx-auto  bg-[#141824] shadow-2xl rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/2 h-80 md:h-auto relative bg-white">
                    <div className="absolute inset-0 bg-white mix-blend-overlay z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80"
                        alt="Premium product showcase"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 bg-[#1a1f2b] p-8 md:p-10 relative">
                    <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500"></div>


                    <h2 className="text-3xl font-bold mt-2 mb-4 text-white">
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Premium</span> Marketplace
                    </h2>

                    <p className="text-gray-300 mb-8">
                        Discover our handpicked selection of high-quality products from trusted global vendors, all in one convenient platform.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-md">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Curated Selection</h3>
                                <p className="text-gray-400 text-sm">Only the best products make it to our marketplace</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-md">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Fast Delivery</h3>
                                <p className="text-gray-400 text-sm">Reliable shipping across the globe</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-md">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Verified Quality</h3>
                                <p className="text-gray-400 text-sm">Thoroughly tested products</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-md">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Bulk Discounts</h3>
                                <p className="text-gray-400 text-sm">Special pricing for businesses</p>
                            </div>
                        </div>
                    </div>

                    <a href="#" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                        Explore Products
                        <ShoppingBag className="ml-2 w-4 h-4" />
                    </a>

                    <div className="mt-6 flex items-center text-gray-400 text-sm">
                        <Check className="mr-2 text-blue-400 w-4 h-4" />
                        Trusted by 2000+ businesses worldwide
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSection;