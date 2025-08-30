import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TemplateActions from "@/components/features/template-actions";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Filter,
  Search,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  User,
  Menu
} from "lucide-react";
import { useState } from "react";

export default function EcommerceTemplate() {
  const [cartItems, setCartItems] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Electronics", "Clothing", "Home", "Sports", "Books"];

  const products = [
    {
      id: 1,
      name: "Wireless Headphones Pro",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.8,
      reviews: 124,
      image: "🎧",
      category: "Electronics",
      bestseller: true,
      discount: 25,
      inStock: true
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.6,
      reviews: 89,
      image: "⌚",
      category: "Electronics",
      bestseller: false,
      discount: 20,
      inStock: true
    },
    {
      id: 3,
      name: "Premium Coffee Maker",
      price: 159.99,
      originalPrice: null,
      rating: 4.9,
      reviews: 234,
      image: "☕",
      category: "Home",
      bestseller: true,
      discount: 0,
      inStock: true
    },
    {
      id: 4,
      name: "Designer Backpack",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.5,
      reviews: 67,
      image: "🎒",
      category: "Clothing",
      bestseller: false,
      discount: 25,
      inStock: false
    },
    {
      id: 5,
      name: "Gaming Mechanical Keyboard",
      price: 149.99,
      originalPrice: null,
      rating: 4.7,
      reviews: 156,
      image: "⌨️",
      category: "Electronics",
      bestseller: false,
      discount: 0,
      inStock: true
    },
    {
      id: 6,
      name: "Yoga Mat Premium",
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.4,
      reviews: 89,
      image: "🧘",
      category: "Sports",
      bestseller: false,
      discount: 28,
      inStock: true
    }
  ];

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplateActions templateId="ecommerce" templateName="E-commerce Store" />
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        🚚 Free shipping on orders over $50 | 🎉 Use code SAVE20 for 20% off
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">ShopPro</span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="relative p-2">
                <Heart className="h-6 w-6" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" className="relative p-2">
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </Badge>
              </Button>
              <Button variant="ghost" className="p-2">
                <User className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-12">
            <Button variant="ghost" className="flex items-center space-x-2 text-sm">
              <Menu className="h-4 w-4" />
              <span>Categories</span>
            </Button>
            {categories.slice(1).map((category) => (
              <a key={category} href="#" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                {category}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white border-white/20 mb-4">
                🔥 Limited Time Offer
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Discover Amazing 
                <span className="text-yellow-300"> Deals</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Shop the latest products with up to 50% off. Free shipping on all orders over $50.
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4">
                Shop Now
                <ShoppingCart className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <div className="text-center">
              <div className="text-9xl mb-4">🛍️</div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">50%</div>
                <div className="text-lg">Off Everything</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
              { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
              { icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
              { icon: CreditCard, title: "Payment Options", desc: "Multiple payment methods" }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 mb-8 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                  <div className="text-6xl">{product.image}</div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-1">
                    {product.bestseller && (
                      <Badge className="bg-orange-500 text-white">Bestseller</Badge>
                    )}
                    {product.discount > 0 && (
                      <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>
                    )}
                  </div>

                  {/* Wishlist */}
                  <Button 
                    variant="ghost" 
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100">
                      Quick View
                    </Button>
                  </div>

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge className="bg-red-500 text-white">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!product.inStock}
                    onClick={() => setCartItems(prev => prev + 1)}
                  >
                    {product.inStock ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    ) : (
                      'Out of Stock'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers.
          </p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg border-0 text-gray-900 focus:ring-2 focus:ring-blue-600"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-l-none">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">ShopPro</span>
              </div>
              <p className="text-gray-600 mb-4">
                Your one-stop destination for quality products at amazing prices.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram'].map((social, index) => (
                  <a key={index} href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <span className="text-xs font-bold">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Shop",
                links: ["Electronics", "Clothing", "Home & Garden", "Sports & Outdoors"]
              },
              {
                title: "Support",
                links: ["Help Center", "Shipping Info", "Returns", "Size Guide"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Press", "Affiliate Program"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2024 ShopPro. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}