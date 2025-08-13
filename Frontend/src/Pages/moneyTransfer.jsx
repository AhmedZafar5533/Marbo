import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  ArrowRight,
  Globe,
  User,
  CreditCard,
  Trash2,
  ShoppingCart,
  AlertTriangle,
  LogIn,
} from "lucide-react";
import { useMoneyTransferStore } from "../../Store/moneyTransferStore";
import { useAuthStore } from "../../Store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, useParams } from "react-router-dom";

const MoneyTransferService = () => {

  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("0.00");
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [order, setOrder] = useState(null);

  // Pickup form fields
  const [recipientName, setRecipientName] = useState("");
  const [identificationCard, setIdentificationCard] = useState("");

  // Transfer form fields
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [cnic, setCnic] = useState("");

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const deliveryFormRef = useRef(null);

  const { id } = useParams();

  const { authenticationState } = useAuthStore();
  const {
    exchangeRate,
    checkConversionRate,
    loading,
    addOrder,
    getOrderData,
    transferData,
  } = useMoneyTransferStore();

  const currencies = [
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
    { code: "AFN", name: "Afghan Afghani", flag: "🇦🇫" },
    { code: "ALL", name: "Albanian Lek", flag: "🇦🇱" },
    { code: "AMD", name: "Armenian Dram", flag: "🇦🇲" },
    { code: "ANG", name: "Netherlands Antillean Guilder", flag: "🇳🇱" },
    { code: "AOA", name: "Angolan Kwanza", flag: "🇦🇴" },
    { code: "ARS", name: "Argentine Peso", flag: "🇦🇷" },
    { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
    { code: "AWG", name: "Aruban Florin", flag: "🇦🇼" },
    { code: "AZN", name: "Azerbaijani Manat", flag: "🇦🇿" },
    { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark", flag: "🇧🇦" },
    { code: "BBD", name: "Barbadian Dollar", flag: "🇧🇧" },
    { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
    { code: "BGN", name: "Bulgarian Lev", flag: "🇧🇬" },
    { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭" },
    { code: "BIF", name: "Burundian Franc", flag: "🇧🇮" },
    { code: "BMD", name: "Bermudian Dollar", flag: "🇧🇲" },
    { code: "BND", name: "Brunei Dollar", flag: "🇧🇳" },
    { code: "BOB", name: "Bolivian Boliviano", flag: "🇧🇴" },
    { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
    { code: "BSD", name: "Bahamian Dollar", flag: "🇧🇸" },
    { code: "BTC", name: "Bitcoin", flag: "₿" },
    { code: "BTN", name: "Bhutanese Ngultrum", flag: "🇧🇹" },
    { code: "BWP", name: "Botswanan Pula", flag: "🇧🇼" },
    { code: "BYN", name: "Belarusian Ruble", flag: "🇧🇾" },
    { code: "BZD", name: "Belize Dollar", flag: "🇧🇿" },
    { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "CDF", name: "Congolese Franc", flag: "🇨🇩" },
    { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
    { code: "CLF", name: "Chilean Unit of Account (UF)", flag: "🇨🇱" },
    { code: "CLP", name: "Chilean Peso", flag: "🇨🇱" },
    { code: "CNH", name: "Chinese Yuan (Offshore)", flag: "🇨🇳" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
    { code: "COP", name: "Colombian Peso", flag: "🇨🇴" },
    { code: "CRC", name: "Costa Rican Colón", flag: "🇨🇷" },
    { code: "CUC", name: "Cuban Convertible Peso", flag: "🇨🇺" },
    { code: "CUP", name: "Cuban Peso", flag: "🇨🇺" },
    { code: "CVE", name: "Cape Verdean Escudo", flag: "🇨🇻" },
    { code: "CZK", name: "Czech Koruna", flag: "🇨🇿" },
    { code: "DJF", name: "Djiboutian Franc", flag: "🇩🇯" },
    { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
    { code: "DOP", name: "Dominican Peso", flag: "🇩🇴" },
    { code: "DZD", name: "Algerian Dinar", flag: "🇩🇿" },
    { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },
    { code: "ERN", name: "Eritrean Nakfa", flag: "🇪🇷" },
    { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "FJD", name: "Fijian Dollar", flag: "🇫🇯" },
    { code: "FKP", name: "Falkland Islands Pound", flag: "🇫🇰" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "GEL", name: "Georgian Lari", flag: "🇬🇪" },
    { code: "GGP", name: "Guernsey Pound", flag: "🇬🇬" },
    { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭" },
    { code: "GIP", name: "Gibraltar Pound", flag: "🇬🇮" },
    { code: "GMD", name: "Gambian Dalasi", flag: "🇬🇲" },
    { code: "GNF", name: "Guinean Franc", flag: "🇬🇳" },
    { code: "GTQ", name: "Guatemalan Quetzal", flag: "🇬🇹" },
    { code: "GYD", name: "Guyanaese Dollar", flag: "🇬🇾" },
    { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
    { code: "HNL", name: "Honduran Lempira", flag: "🇭🇳" },
    { code: "HRK", name: "Croatian Kuna", flag: "🇭🇷" },
    { code: "HTG", name: "Haitian Gourde", flag: "🇭🇹" },
    { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺" },
    { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
    { code: "ILS", name: "Israeli New Sheqel", flag: "🇮🇱" },
    { code: "IMP", name: "Isle of Man Pound", flag: "🇮🇲" },
    { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
    { code: "IQD", name: "Iraqi Dinar", flag: "🇮🇶" },
    { code: "IRR", name: "Iranian Rial", flag: "🇮🇷" },
    { code: "ISK", name: "Icelandic Króna", flag: "🇮🇸" },
    { code: "JEP", name: "Jersey Pound", flag: "🇯🇪" },
    { code: "JMD", name: "Jamaican Dollar", flag: "🇯🇲" },
    { code: "JOD", name: "Jordanian Dinar", flag: "🇯🇴" },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪" },
    { code: "KGS", name: "Kyrgystani Som", flag: "🇰🇬" },
    { code: "KHR", name: "Cambodian Riel", flag: "🇰🇭" },
    { code: "KMF", name: "Comorian Franc", flag: "🇰🇲" },
    { code: "KPW", name: "North Korean Won", flag: "🇰🇵" },
    { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
    { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼" },
    { code: "KYD", name: "Cayman Islands Dollar", flag: "🇰🇾" },
    { code: "KZT", name: "Kazakhstani Tenge", flag: "🇰🇿" },
    { code: "LAK", name: "Laotian Kip", flag: "🇱🇦" },
    { code: "LBP", name: "Lebanese Pound", flag: "🇱🇧" },
    { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰" },
    { code: "LRD", name: "Liberian Dollar", flag: "🇱🇷" },
    { code: "LSL", name: "Lesotho Loti", flag: "🇱🇸" },
    { code: "LYD", name: "Libyan Dinar", flag: "🇱🇾" },
    { code: "MAD", name: "Moroccan Dirham", flag: "🇲🇦" },
    { code: "MDL", name: "Moldovan Leu", flag: "🇲🇩" },
    { code: "MGA", name: "Malagasy Ariary", flag: "🇲🇬" },
    { code: "MKD", name: "Macedonian Denar", flag: "🇲🇰" },
    { code: "MMK", name: "Myanmar Kyat", flag: "🇲🇲" },
    { code: "MNT", name: "Mongolian Tugrik", flag: "🇲🇳" },
    { code: "MOP", name: "Macanese Pataca", flag: "🇲🇴" },
    { code: "MRU", name: "Mauritanian Ouguiya", flag: "🇲🇷" },
    { code: "MUR", name: "Mauritian Rupee", flag: "🇲🇺" },
    { code: "MVR", name: "Maldivian Rufiyaa", flag: "🇲🇻" },
    { code: "MWK", name: "Malawian Kwacha", flag: "🇲🇼" },
    { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
    { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
    { code: "MZN", name: "Mozambican Metical", flag: "🇲🇿" },
    { code: "NAD", name: "Namibian Dollar", flag: "🇳🇦" },
    { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
    { code: "NIO", name: "Nicaraguan Córdoba", flag: "🇳🇮" },
    { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
    { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵" },
    { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
    { code: "OMR", name: "Omani Rial", flag: "🇴🇲" },
    { code: "PAB", name: "Panamanian Balboa", flag: "🇵🇦" },
    { code: "PEN", name: "Peruvian Nuevo Sol", flag: "🇵🇪" },
    { code: "PGK", name: "Papua New Guinean Kina", flag: "🇵🇬" },
    { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
    { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
    { code: "PLN", name: "Polish Zloty", flag: "🇵🇱" },
    { code: "PYG", name: "Paraguayan Guarani", flag: "🇵🇾" },
    { code: "QAR", name: "Qatari Rial", flag: "🇶🇦" },
    { code: "RON", name: "Romanian Leu", flag: "🇷🇴" },
    { code: "RSD", name: "Serbian Dinar", flag: "🇷🇸" },
    { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
    { code: "RWF", name: "Rwandan Franc", flag: "🇷🇼" },
    { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
    { code: "SBD", name: "Solomon Islands Dollar", flag: "🇸🇧" },
    { code: "SCR", name: "Seychellois Rupee", flag: "🇸🇨" },
    { code: "SDG", name: "Sudanese Pound", flag: "🇸🇩" },
    { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
    { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
    { code: "SHP", name: "Saint Helena Pound", flag: "🇸🇭" },
    { code: "SLL", name: "Sierra Leonean Leone", flag: "🇸🇱" },
    { code: "SOS", name: "Somali Shilling", flag: "🇸🇴" },
    { code: "SRD", name: "Surinamese Dollar", flag: "🇸🇷" },
    { code: "SSP", name: "South Sudanese Pound", flag: "🇸🇸" },
    { code: "STD", name: "São Tomé and Príncipe Dobra (Old)", flag: "🇸🇹" },
    { code: "STN", name: "São Tomé and Príncipe Dobra", flag: "🇸🇹" },
    { code: "SVC", name: "Salvadoran Colón", flag: "🇸🇻" },
    { code: "SYP", name: "Syrian Pound", flag: "🇸🇾" },
    { code: "SZL", name: "Swazi Lilangeni", flag: "🇸🇿" },
    { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
    { code: "TJS", name: "Tajikistani Somoni", flag: "🇹🇯" },
    { code: "TMT", name: "Turkmenistani Manat", flag: "🇹🇲" },
    { code: "TND", name: "Tunisian Dinar", flag: "🇹🇳" },
    { code: "TOP", name: "Tongan Paʻanga", flag: "🇹🇴" },
    { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
    { code: "TTD", name: "Trinidad and Tobago Dollar", flag: "🇹🇹" },
    { code: "TWD", name: "Taiwan New Dollar", flag: "🇹🇼" },
    { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿" },
    { code: "UAH", name: "Ukrainian Hryvnia", flag: "🇺🇦" },
    { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬" },
    { code: "UYU", name: "Uruguayan Peso", flag: "🇺🇾" },
    { code: "UZS", name: "Uzbekistan Som", flag: "🇺🇿" },
    { code: "VES", name: "Venezuelan Bolívar", flag: "🇻🇪" },
    { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
    { code: "VUV", name: "Vanuatu Vatu", flag: "🇻🇺" },
    { code: "WST", name: "Samoan Tala", flag: "🇼🇸" },
    { code: "XAF", name: "CFA Franc BEAC", flag: "🌍" },
    { code: "XAG", name: "Silver Ounce", flag: "🥈" },
    { code: "XAU", name: "Gold Ounce", flag: "🥇" },
    { code: "XCD", name: "East Caribbean Dollar", flag: "🏝️" },
    { code: "XDR", name: "Special Drawing Rights", flag: "🏛️" },
    { code: "XOF", name: "CFA Franc BCEAO", flag: "🌍" },
    { code: "XPD", name: "Palladium Ounce", flag: "⚪" },
    { code: "XPF", name: "CFP Franc", flag: "🏝️" },
    { code: "XPT", name: "Platinum Ounce", flag: "⚪" },
    { code: "YER", name: "Yemeni Rial", flag: "🇾🇪" },
    { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
    { code: "ZMW", name: "Zambian Kwacha", flag: "🇿🇲" },
    { code: "ZWL", name: "Zimbabwean Dollar", flag: "🇿🇼" },
  ];

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      checkConversionRate(fromCurrency, toCurrency);
    }
  }, [fromCurrency, toCurrency, checkConversionRate]);

  useEffect(() => {
    getOrderData(id);
  }, [id, getOrderData]);

  useEffect(() => {
    if (transferData) {
      setOrder(transferData);
    }
  }, [transferData]);

  useEffect(() => {
    if (!amount || isNaN(exchangeRate)) {
      setConvertedAmount("0.00");
    } else {
      const converted = parseFloat(amount) * exchangeRate;
      console.log(converted);
      setConvertedAmount(converted.toFixed(2));
    }
  }, [amount, exchangeRate]);

  // Filter out the opposite-selected currency
  const filteredFromCurrencies = React.useMemo(
    () =>
      currencies
        .filter((c) => c.code !== toCurrency)
        .filter(
          (currency) =>
            currency.code.toLowerCase().includes(fromSearch.toLowerCase()) ||
            currency.name.toLowerCase().includes(fromSearch.toLowerCase())
        ),
    [fromSearch, toCurrency]
  );

  const filteredToCurrencies = React.useMemo(
    () =>
      currencies
        .filter((c) => c.code !== fromCurrency)
        .filter(
          (currency) =>
            currency.code.toLowerCase().includes(toSearch.toLowerCase()) ||
            currency.name.toLowerCase().includes(toSearch.toLowerCase())
        ),
    [toSearch, fromCurrency]
  );

  const handleAmountChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  }, []);

  const handleContinue = () => {
    setShowDeliveryForm(true);
    // Smooth scroll to delivery form
    setTimeout(() => {
      deliveryFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    const orderData = {
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
      convertedAmount: parseFloat(convertedAmount),
      exchangeRate,
      deliveryMethod,
    };

    if (deliveryMethod === "pickup") {
      orderData.recipientName = recipientName;
      orderData.recipientId = identificationCard;
    } else if (deliveryMethod === "transfer") {
      orderData.bankName = bankName;
      orderData.recipientName = accountHolderName;
      orderData.recipientId = cnic;
      orderData.accountNumber = accountNumber;
      orderData.deliveryMethod = "bank";
    }

    const success = await addOrder(orderData, id);
    if (!success) {
      return;
    }

    setOrder(orderData);
    // Reset form fields
    setRecipientName("");
    setIdentificationCard("");
    setBankName("");
    setAccountNumber("");
    setAccountHolderName("");
    setCnic("");
    setShowDeliveryForm(false);

    console.log("Order submitted:", orderData);
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Added to cart:", order);
    alert("Order added to cart!");
  };

  const handleDeleteOrder = () => {
    setOrder(null);
    setShowDeliveryForm(false);
  };

  const resetForm = () => {
    setFromCurrency("");
    setToCurrency("");
    setAmount("");
    setConvertedAmount("0.00");
    setShowDeliveryForm(false);
    setDeliveryMethod("");
    setOrder(null);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setFromDropdownOpen(false);
        setFromSearch("");
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setToDropdownOpen(false);
        setToSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const CurrencyDropdown = React.memo(
    ({
      isOpen,
      setIsOpen,
      selectedCurrency,
      setSelectedCurrency,
      search,
      setSearch,
      filteredCurrencies,
      dropdownRef,
      label,
    }) => (
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-left hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {currencies.find((c) => c.code === selectedCurrency)?.flag}
              </span>
              <div>
                <div className="font-semibold text-gray-900">
                  {selectedCurrency}
                </div>
                <div className="text-sm text-gray-500">
                  {currencies.find((c) => c.code === selectedCurrency)?.name}
                </div>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search currencies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="w-full border-2 border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48">
              {filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency.code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{currency.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {currency.code}
                      </div>
                      <div className="text-sm text-gray-500">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {!authenticationState && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 transform shadow-2xl border border-white/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-red-100 rounded-2xl mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Login Required
                </h3>
                <div className="bg-red-50 rounded-2xl p-6 mb-8">
                  <p className="text-gray-700 leading-relaxed">
                    To use this service, you must{" "}
                    <span className="font-bold text-red-600">log in</span> or{" "}
                    <span className="font-bold text-red-600">
                      create an account
                    </span>
                    .
                  </p>
                  <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-red-500">
                    <p className="text-sm text-gray-600">
                      <strong>🔒 Note:</strong> Authentication is required to
                      continue.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link to="/login">
                    <button className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Login / Sign Up
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-red-100 rounded-full px-4 py-2 mb-6">
            <Globe className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">
              Global Money Transfer
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Send money
            <span className="text-red-600"> worldwide</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Fast, secure, and affordable international transfers with real-time
            exchange rates
          </p>
        </div>

        {order && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-8 font-sans">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Summary
              </h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Order #{order._id} {/* Changed from order.id to order._id */}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Transfer Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">
                      {order.fromCurrency} {order.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">
                      {order.toCurrency} {order.convertedAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exchange Rate:</span>
                    {/* Ensure exchangeRate is directly accessible */}
                    <span className="font-medium">{order.exchangeRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Method:</span>
                    <span className="font-medium capitalize">
                      {order.deliveryMethod}
                    </span>
                  </div>
                  {/* Removed Order Time as it's not present in the provided data or Mongoose schema */}
                  {/*
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Time:</span>
                  <span className="font-medium">{formatOrderTime(order.timestamp)}</span>
                </div>
                */}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  {order.deliveryMethod === "pickup"
                    ? "Recipient Details"
                    : "Banking Details"}
                </h3>
                <div className="space-y-2">
                  {order.deliveryMethod === "pickup" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">
                          {order.recipientName}{" "}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipient ID:</span>
                        <span className="font-medium">
                          {order.recipientId}{" "}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Name:</span>
                        <span className="font-medium">
                          {order.bankName}{" "}
                          {/* Changed from order.banking.bankName */}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium">
                          {order.accountNumber}{" "}
                          {/* Changed from order.banking.accountNumber */}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Holder:</span>
                        <span className="font-medium">
                          {order.recipientName}{" "}
                          {/* Changed from order.banking.accountHolderName to recipientName */}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CNIC:</span>
                        <span className="font-medium">{order.recipientId}</span>
                      </div>
                      
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleDeleteOrder}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete Order</span>
              </button>
            </div>

            <button
              onClick={resetForm}
              className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
            >
              Create New Transfer
            </button>
          </div>
        )}

        {/* Main Form - Only show if no order exists */}
        {!order && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-end">
              {/* You Send */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    You send
                  </h3>
                </div>
                <CurrencyDropdown
                  isOpen={fromDropdownOpen}
                  setIsOpen={setFromDropdownOpen}
                  selectedCurrency={fromCurrency}
                  setSelectedCurrency={setFromCurrency}
                  search={fromSearch}
                  setSearch={setFromSearch}
                  filteredCurrencies={filteredFromCurrencies}
                  dropdownRef={fromRef}
                  label="From"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:z-10">
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-full p-4 shadow-lg">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* They Receive */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    They receive
                  </h3>
                </div>
                <CurrencyDropdown
                  isOpen={toDropdownOpen}
                  setIsOpen={setToDropdownOpen}
                  selectedCurrency={toCurrency}
                  setSelectedCurrency={setToCurrency}
                  search={toSearch}
                  setSearch={setToSearch}
                  filteredCurrencies={filteredToCurrencies}
                  dropdownRef={toRef}
                  label="To"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-2xl font-semibold bg-gray-50">
                    {convertedAmount}
                  </div>
                </div>
              </div>
            </div>

            {/* Rate Info & CTA */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 text-gray-600">
                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    Exchange rate: 1 {fromCurrency} = {exchangeRate}{" "}
                    {toCurrency}
                  </span>
                </div>
                <span className="text-sm">
                  Total to pay: ${parseFloat(amount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={!fromCurrency || !toCurrency || !amount}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Delivery Method Form */}
        {showDeliveryForm && !order && (
          <div
            ref={deliveryFormRef}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12"
          >
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Choose Delivery Method
              </h3>
            </div>

            {/* Delivery Method Selection */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => setDeliveryMethod("pickup")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  deliveryMethod === "pickup"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <User className="w-6 h-6 text-red-600" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Money Pickup
                  </h4>
                </div>
                <p className="text-gray-600">
                  Recipient can collect cash from our partner locations
                </p>
              </button>

              <button
                onClick={() => setDeliveryMethod("transfer")}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  deliveryMethod === "transfer"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <CreditCard className="w-6 h-6 text-red-600" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Bank Transfer
                  </h4>
                </div>
                <p className="text-gray-600">
                  Direct transfer to recipient's bank account
                </p>
              </button>
            </div>

            {/* Form based on delivery method */}
            {deliveryMethod && (
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                {deliveryMethod === "pickup" && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Recipient Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipient Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          placeholder="Enter recipient's full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Identification Card Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={identificationCard}
                          onChange={(e) =>
                            setIdentificationCard(e.target.value)
                          }
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          placeholder="Enter ID card number"
                        />
                      </div>
                    </div>
                  </>
                )}

                {deliveryMethod === "transfer" && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Banking Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          placeholder="Enter bank name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          placeholder="Enter account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Holder Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={accountHolderName}
                          onChange={(e) => setAccountHolderName(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          placeholder="Enter account holder name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CNIC *
                        </label>
                        <input
                          type="text"
                          required
                          value={cnic}
                          onChange={(e) => setCnic(e.target.value)}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                          placeholder="Enter CNIC number"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowDeliveryForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Submit Order
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoneyTransferService;
