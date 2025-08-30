import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  Bell,
  Search,
  Settings,
  Calendar,
  Download,
  Filter,
  MoreVertical,
  Plus,
  RefreshCw
} from "lucide-react";

export default function DashboardTemplate() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Active Users",
      value: "12,483",
      change: "+5.4%",
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Total Orders",
      value: "1,846",
      change: "-2.3%",
      trend: "down",
      icon: ShoppingCart,
      color: "purple"
    },
    {
      title: "Page Views",
      value: "89,342",
      change: "+12.8%",
      trend: "up",
      icon: Eye,
      color: "orange"
    }
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John Smith", product: "Wireless Headphones", amount: "$299.99", status: "Completed", date: "2023-12-15" },
    { id: "#ORD-002", customer: "Sarah Johnson", product: "Smart Watch", amount: "$199.99", status: "Processing", date: "2023-12-15" },
    { id: "#ORD-003", customer: "Mike Wilson", product: "Laptop Stand", amount: "$89.99", status: "Shipped", date: "2023-12-14" },
    { id: "#ORD-004", customer: "Emily Davis", product: "Coffee Maker", amount: "$159.99", status: "Pending", date: "2023-12-14" },
    { id: "#ORD-005", customer: "David Chen", product: "Desk Organizer", amount: "$49.99", status: "Completed", date: "2023-12-13" }
  ];

  const topProducts = [
    { name: "Wireless Headphones", sales: 124, revenue: "$37,196", image: "🎧" },
    { name: "Smart Watch", sales: 89, revenue: "$17,791", image: "⌚" },
    { name: "Laptop Stand", sales: 67, revenue: "$6,029", image: "💻" },
    { name: "Coffee Maker", sales: 45, revenue: "$7,199", image: "☕" },
    { name: "Desk Organizer", sales: 34, revenue: "$1,699", image: "📝" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">DashPro</span>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-1 px-3">
            {[
              { name: "Dashboard", icon: BarChart3, active: true },
              { name: "Orders", icon: ShoppingCart, active: false },
              { name: "Customers", icon: Users, active: false },
              { name: "Products", icon: Eye, active: false },
              { name: "Analytics", icon: TrendingUp, active: false },
              { name: "Settings", icon: Settings, active: false }
            ].map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href="#"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  {item.name}
                </a>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, Admin!</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="relative p-2">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </Badge>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
              return (
                <div key={stat.title} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendIcon className="h-4 w-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Last 30 days
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Mock Chart */}
                <div className="h-64 bg-gradient-to-t from-blue-50 to-white rounded-xl flex items-end justify-center space-x-2 p-4">
                  {[40, 65, 35, 80, 45, 70, 60, 85, 55, 75, 90, 65].map((height, index) => (
                    <div
                      key={index}
                      className="bg-blue-600 rounded-t-lg w-8 transition-all hover:bg-blue-700"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Revenue</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span>Profit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Top Products</h2>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                      {product.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-600">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Products
              </Button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Order ID</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Customer</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Product</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Amount</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-blue-600">{order.id}</td>
                      <td className="py-4 px-6 text-gray-900">{order.customer}</td>
                      <td className="py-4 px-6 text-gray-700">{order.product}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">{order.amount}</td>
                      <td className="py-4 px-6">
                        <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-1`}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{order.date}</td>
                      <td className="py-4 px-6">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Showing 5 of 247 orders</p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}