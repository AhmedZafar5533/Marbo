import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit, Trash2, Eye, X, Save } from "lucide-react";
import { useProductStore } from "../../../Store/productsStore";
import { Link } from "react-router-dom";

const ProductCard = React.memo(({ product, onView, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <div className="relative">
      <img
        src={
          product.images[0]?.imageUrl ||
          "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-2 right-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.quantity > 20
              ? "bg-green-100 text-green-800"
              : product.quantity > 5
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.quantity} in stock
        </span>
      </div>
    </div>

    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-lg truncate">
          {product.name}
        </h3>
        <span className="text-indigo-600 font-bold">${product.price}</span>
      </div>

      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
        {product.description}
      </p>

      <div className="flex justify-between items-center mb-3">
        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
          {product.category}
        </span>
        <span className="text-gray-500 text-xs">
          {product.features.length} features
        </span>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => onView(product)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </button>
        <button
          onClick={() => onEdit(product)}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="flex items-center text-red-600 hover:text-red-800 text-sm"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  </div>
));

const Modal = ({ show, type, product, onClose, onSave, onProductChange }) => {
  if (!show || !product) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onProductChange({ ...product, [name]: value });
  };

  const handleNumericInputChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string for clearing input, otherwise parse as number
    const numericValue =
      value === ""
        ? ""
        : name === "price"
        ? parseFloat(value)
        : parseInt(value, 10);
    onProductChange({ ...product, [name]: numericValue });
  };

  const handleFeaturesChange = (e) => {
    onProductChange({
      ...product,
      features: e.target.value.split(",").map((f) => f.trim()),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {type === "view"
              ? "Product Details"
              : type === "edit"
              ? "Edit Product"
              : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {type === "view" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Product Images
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-gray-700">Name:</label>
                    <p className="text-gray-600">{product.name}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">
                      Category:
                    </label>
                    <p className="text-gray-600">{product.category}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">
                      Price:
                    </label>
                    <p className="text-gray-600">${product.price}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">
                      Quantity:
                    </label>
                    <p className="text-gray-600">{product.quantity}</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-700">
                  Description:
                </label>
                <p className="text-gray-600 mt-1">{product.description}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Features:</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name" // Use name attribute for generic handler
                    value={product.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleNumericInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={handleNumericInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={product.features.join(", ")}
                  onChange={handleFeaturesChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'view', 'edit', 'add'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const { getInventory, products: inventory, loading } = useProductStore();

  useEffect(() => {
    getInventory("Groceries");
  }, [getInventory]);

  useEffect(() => {
    if (!loading && inventory) {
      setProducts(inventory);
    }
  }, [inventory, loading]);

  const filteredProducts = products.filter((product) => {
    const name = product.name || "";
    const description = product.description || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const categories = [...new Set(products.map((product) => product.category))];

  const handleViewProduct = useCallback((product) => {
    setSelectedProduct(product);
    setModalType("view");
    setShowModal(true);
  }, []);

  const handleEditProduct = useCallback((product) => {
    setSelectedProduct({ ...product });
    setModalType("edit");
    setShowModal(true);
  }, []);

  const handleDeleteProduct = useCallback((productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    }
  }, []);

  const handleSaveProduct = useCallback(() => {
    if (modalType === "add") {
      const newProduct = {
        ...selectedProduct,
        _id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts((prevProducts) => [...prevProducts, newProduct]);
    } else if (modalType === "edit") {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === selectedProduct._id
            ? { ...selectedProduct, updatedAt: new Date() }
            : product
        )
      );
    }
    setShowModal(false);
    setSelectedProduct(null);
  }, [modalType, selectedProduct]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedProduct(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Product Inventory
          </h1>
          <p className="text-gray-600">
            Manage your product catalog and inventory
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:w-64">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <Link to="/dashboard/vendor/add/products">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        show={showModal}
        type={modalType}
        product={selectedProduct}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        onProductChange={setSelectedProduct}
      />
    </div>
  );
};

export default InventoryPage;
