import { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight, Star, Shield, Heart, ArrowRight } from 'lucide-react';

export default function PlansMarketplace() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    planType: 'all',
    priceRange: 'all',
    coverage: 'all',
  });

  useEffect(() => {
    // Simulate API fetch with a delay
    setTimeout(() => {
      const mockPlans = [
        {
          id: 1,
          name: 'Gold Family Plan',
          type: 'family',
          monthlyPremium: 450.00,
          coverageLevel: 'comprehensive',
          deductible: 1500,
          description: 'Comprehensive coverage for families with children, including dental and vision.',
          rating: 4.8,
          features: ['Primary care', 'Specialists', 'Emergency care', 'Hospital stays', 'Prescription drugs', 'Mental health', 'Dental', 'Vision'],
          bestFor: 'Families needing comprehensive coverage',
          icon: 'shield'
        },
        {
          id: 2,
          name: 'Silver Individual Plan',
          type: 'individual',
          monthlyPremium: 225.50,
          coverageLevel: 'standard',
          deductible: 2500,
          description: 'Balanced coverage for individuals with affordable monthly premiums.',
          rating: 4.2,
          features: ['Primary care', 'Specialists', 'Emergency care', 'Hospital stays', 'Prescription drugs', 'Mental health'],
          bestFor: 'Individual professionals seeking balanced coverage',
          icon: 'star'
        },
        {
          id: 3,
          name: 'Bronze Family Plan',
          type: 'family',
          monthlyPremium: 320.75,
          coverageLevel: 'basic',
          deductible: 3500,
          description: 'Essential coverage for families at an affordable price point.',
          rating: 4.0,
          features: ['Primary care', 'Emergency care', 'Hospital stays', 'Prescription drugs'],
          bestFor: 'Budget-conscious families',
          icon: 'heart'
        },
        {
          id: 4,
          name: 'Platinum Individual Plan',
          type: 'individual',
          monthlyPremium: 510.25,
          coverageLevel: 'premium',
          deductible: 1000,
          description: 'Premium coverage with low deductibles and comprehensive benefits.',
          rating: 4.9,
          features: ['Primary care', 'Specialists', 'Emergency care', 'Hospital stays', 'Prescription drugs', 'Mental health', 'Dental', 'Vision', 'Alternative medicine', 'Wellness programs'],
          bestFor: 'Individuals seeking premium healthcare with minimal out-of-pocket costs',
          icon: 'shield'
        },
        {
          id: 5,
          name: 'Gold Individual Plan',
          type: 'individual',
          monthlyPremium: 380.00,
          coverageLevel: 'comprehensive',
          deductible: 1800,
          description: 'Comprehensive coverage for individuals with a good balance of premiums and benefits.',
          rating: 4.5,
          features: ['Primary care', 'Specialists', 'Emergency care', 'Hospital stays', 'Prescription drugs', 'Mental health', 'Dental'],
          bestFor: 'Individuals wanting comprehensive coverage with reasonable premiums',
          icon: 'star'
        },
        {
          id: 6,
          name: 'Silver Family Plan',
          type: 'family',
          monthlyPremium: 410.50,
          coverageLevel: 'standard',
          deductible: 2000,
          description: 'Family coverage with a good balance of benefits and cost.',
          rating: 4.3,
          features: ['Primary care', 'Specialists', 'Emergency care', 'Hospital stays', 'Prescription drugs', 'Mental health'],
          bestFor: 'Families looking for value-oriented coverage',
          icon: 'heart'
        },
        {
          id: 7,
          name: 'Bronze Individual Plan',
          type: 'individual',
          monthlyPremium: 175.25,
          coverageLevel: 'basic',
          deductible: 4000,
          description: 'Basic coverage for healthy individuals looking for protection against major medical events.',
          rating: 3.8,
          features: ['Primary care', 'Emergency care', 'Hospital stays', 'Basic prescription drugs'],
          bestFor: 'Young, healthy individuals wanting basic protection',
          icon: 'shield'
        },
        {
          id: 8,
          name: 'Platinum Family Plan',
          type: 'family',
          monthlyPremium: 620.00,
          coverageLevel: 'premium',
          deductible: 800,
          description: 'Top-tier family coverage with comprehensive benefits and minimal out-of-pocket expenses.',
          rating: 5.0,
          features: ['Primary care', 'Specialists', 'Emergency care', 'Hospital stays', 'Prescription drugs', 'Mental health', 'Dental', 'Vision', 'Alternative medicine', 'Wellness programs', 'Global coverage'],
          bestFor: 'Families wanting the best possible healthcare coverage',
          icon: 'star'
        }
      ];
      setPlans(mockPlans);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const renderIcon = (iconName) => {
    switch(iconName) {
      case 'star':
        return <Star className="w-6 h-6 text-white" />;
      case 'shield':
        return <Shield className="w-6 h-6 text-white" />;
      case 'heart':
        return <Heart className="w-6 h-6 text-white" />;
      default:
        return <Star className="w-6 h-6 text-white" />;
    }
  };

  const getCoverageColor = (level) => {
    switch(level) {
      case 'basic':
        return 'bg-gray-200 text-gray-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'comprehensive':
        return 'bg-indigo-100 text-indigo-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconBackground = (icon) => {
    switch(icon) {
      case 'star':
        return 'bg-[#ED6A5A]';
      case 'shield':
        return 'bg-[#071E22]';
      case 'heart':
        return 'bg-[#EC5F4F]';
      default:
        return 'bg-[#ED6A5A]';
    }
  };

  const filteredPlans = plans.filter(plan => {
    // Search term filter
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Plan type filter
    const matchesPlanType = filters.planType === 'all' || plan.type === filters.planType;
    
    // Price range filter
    let matchesPriceRange = true;
    if (filters.priceRange === 'under-200') {
      matchesPriceRange = plan.monthlyPremium < 200;
    } else if (filters.priceRange === '200-400') {
      matchesPriceRange = plan.monthlyPremium >= 200 && plan.monthlyPremium <= 400;
    } else if (filters.priceRange === 'over-400') {
      matchesPriceRange = plan.monthlyPremium > 400;
    }
    
    // Coverage level filter
    const matchesCoverage = filters.coverage === 'all' || plan.coverageLevel === filters.coverage;
    
    return matchesSearch && matchesPlanType && matchesPriceRange && matchesCoverage;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#071E22] to-[#121212] text-white">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Health Coverage</h1>
          <p className="text-lg max-w-2xl mb-8 opacity-90">Compare plans and discover the right balance of coverage and affordability for you and your family</p>
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search health plans..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-800 bg-opacity-50 rounded-lg leading-5 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#ED6A5A] focus:border-transparent transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Filters Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-[#071E22] mb-4">Filter Plans</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label htmlFor="planType" className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
              <select
                id="planType"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#ED6A5A] focus:border-[#ED6A5A] bg-white transition-colors duration-200"
                value={filters.planType}
                onChange={(e) => handleFilterChange('planType', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="family">Family</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                id="priceRange"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#ED6A5A] focus:border-[#ED6A5A] bg-white transition-colors duration-200"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="under-200">Under $200/month</option>
                <option value="200-400">$200 - $400/month</option>
                <option value="over-400">Over $400/month</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="coverage" className="block text-sm font-medium text-gray-700 mb-2">Coverage Level</label>
              <select
                id="coverage"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#ED6A5A] focus:border-[#ED6A5A] bg-white transition-colors duration-200"
                value={filters.coverage}
                onChange={(e) => handleFilterChange('coverage', e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="comprehensive">Comprehensive</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-[#ED6A5A] rounded-md shadow-sm hover:bg-[#EC5F4F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] w-full transition-colors duration-200"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    planType: 'all',
                    priceRange: 'all',
                    coverage: 'all',
                  });
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700">
              {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'} found
            </p>
            <div className="text-sm text-[#ED6A5A]">
              Sort by: <span className="font-medium cursor-pointer hover:underline">Price</span> | <span className="cursor-pointer hover:underline">Rating</span>
            </div>
          </div>
        )}

        {/* Plans grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-t-[#ED6A5A] border-[#071E22] border-opacity-20 rounded-full animate-spin"></div>
              <div className="mt-4 text-center text-[#071E22] font-medium">Loading plans...</div>
            </div>
          </div>
        ) : (
          <>
            {filteredPlans.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl shadow-md">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xl font-medium text-[#071E22] mb-2">No plans found</p>
                <p className="text-gray-500 max-w-md mx-auto">We couldn't find any plans matching your criteria. Try adjusting your filters or search term.</p>
                <button
                  className="mt-6 px-6 py-2 text-sm font-medium text-white bg-[#ED6A5A] rounded-md shadow-sm hover:bg-[#EC5F4F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200"
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      planType: 'all',
                      priceRange: 'all',
                      coverage: 'all',
                    });
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className="overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="px-6 pt-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-[#071E22]`}>
                            {renderIcon(plan.icon)}
                          </div>
                          <div className="ml-3">
                            <h3 className="text-lg font-semibold text-[#071E22]">{plan.name}</h3>
                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${getCoverageColor(plan.coverageLevel)}`}>
                              {plan.coverageLevel.charAt(0).toUpperCase() + plan.coverageLevel.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium text-gray-700">{plan.rating}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm">{plan.description}</p>
                      </div>
                      
                      <div className="flex items-baseline justify-between mb-4 py-3 border-t border-b border-gray-100">
                        <div>
                          <span className="text-2xl font-bold text-[#071E22]">${plan.monthlyPremium.toFixed(2)}</span>
                          <span className="ml-1 text-sm text-gray-500">/month</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-500">
                            ${plan.deductible} deductible
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Best for:</p>
                        <p className="text-sm font-medium text-[#071E22]">{plan.bestFor}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Key features:</p>
                        <div className="flex flex-wrap gap-2">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-[#071E22] rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                          {plan.features.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-[#ED6A5A] bg-opacity-10 text-[#ED6A5A] rounded-md">
                              +{plan.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50">
                      <a 
                        href={`/plan-details/${plan.id}`}
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-[#ED6A5A] rounded-md hover:bg-[#EC5F4F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 group"
                      >
                        View Details & Apply
                        <ArrowRight className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#071E22] text-white mt-12">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-4">HealthPlus</h3>
              <p className="text-sm text-gray-300">Helping you find the perfect health insurance coverage for your needs.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-[#ED6A5A] transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-[#ED6A5A] transition-colors duration-200">How It Works</a></li>
                <li><a href="#" className="hover:text-[#ED6A5A] transition-colors duration-200">Insurance FAQ</a></li>
                <li><a href="#" className="hover:text-[#ED6A5A] transition-colors duration-200">Contact Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-sm text-gray-300 mb-2">Get updates on new plans and promotions</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#ED6A5A] focus:border-[#ED6A5A] flex-1"
                />
                <button className="px-4 py-2 bg-[#ED6A5A] text-white text-sm font-medium rounded-r-md hover:bg-[#EC5F4F] transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-sm text-gray-400 text-center">
            © 2025 HealthPlus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}