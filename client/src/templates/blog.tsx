import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TemplateActions from "@/components/features/template-actions";
import { 
  Search,
  Calendar,
  User,
  Tag,
  ArrowRight,
  Share,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Clock,
  TrendingUp,
  Eye
} from "lucide-react";

export default function BlogTemplate() {
  const categories = ["All", "Technology", "Design", "Business", "Lifestyle", "Travel"];
  
  const featuredPost = {
    id: 1,
    title: "The Future of Web Development: What to Expect in 2024",
    excerpt: "Explore the latest trends and technologies that are shaping the future of web development, from AI integration to new frameworks.",
    author: "Sarah Johnson",
    date: "Dec 15, 2023",
    readTime: "8 min read",
    category: "Technology",
    image: "💻",
    likes: 234,
    comments: 45,
    views: "12.5K"
  };

  const posts = [
    {
      id: 2,
      title: "10 Design Principles Every Developer Should Know",
      excerpt: "Learn the fundamental design principles that will make your applications more user-friendly and visually appealing.",
      author: "Mike Chen",
      date: "Dec 12, 2023",
      readTime: "6 min read",
      category: "Design",
      image: "🎨",
      likes: 189,
      comments: 23,
      views: "8.2K"
    },
    {
      id: 3,
      title: "Building a Successful Remote Team Culture",
      excerpt: "Discover strategies for creating and maintaining a strong team culture in a remote work environment.",
      author: "Emily Rodriguez",
      date: "Dec 10, 2023",
      readTime: "5 min read",
      category: "Business",
      image: "🏢",
      likes: 156,
      comments: 34,
      views: "6.7K"
    },
    {
      id: 4,
      title: "The Art of Minimalist Living in 2024",
      excerpt: "How adopting a minimalist lifestyle can improve your productivity, mental health, and overall well-being.",
      author: "David Park",
      date: "Dec 8, 2023",
      readTime: "4 min read",
      category: "Lifestyle",
      image: "🧘",
      likes: 203,
      comments: 67,
      views: "9.1K"
    },
    {
      id: 5,
      title: "Hidden Gems: 5 Underrated Travel Destinations",
      excerpt: "Discover amazing travel destinations that offer incredible experiences without the crowds of popular tourist spots.",
      author: "Lisa Wang",
      date: "Dec 5, 2023",
      readTime: "7 min read",
      category: "Travel",
      image: "✈️",
      likes: 145,
      comments: 29,
      views: "5.8K"
    },
    {
      id: 6,
      title: "Mastering TypeScript: Advanced Tips and Tricks",
      excerpt: "Take your TypeScript skills to the next level with these advanced techniques and best practices.",
      author: "Alex Thompson",
      date: "Dec 3, 2023",
      readTime: "9 min read",
      category: "Technology",
      image: "⚡",
      likes: 278,
      comments: 56,
      views: "15.2K"
    }
  ];

  const popularTags = [
    "JavaScript", "React", "Design", "Productivity", "Remote Work",
    "Startup", "AI", "Web Development", "UX/UI", "Business"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TemplateActions templateId="blog" templateName="Blog" />
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">BlogHub</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Categories</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent w-64"
                />
              </div>
              <Button variant="outline">Subscribe</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Insights & Ideas for 
            <span className="text-yellow-300"> Modern Life</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Discover the latest trends, tips, and insights from industry experts. 
            Join our community of learners and innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
              Start Reading
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Article */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 h-64 flex items-center justify-center">
                <div className="text-8xl">{featuredPost.image}</div>
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900">Featured</Badge>
              </div>
              
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <Badge variant="secondary">{featuredPost.category}</Badge>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{featuredPost.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{featuredPost.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{featuredPost.views}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Articles */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-40 flex items-center justify-center">
                      <div className="text-5xl">{post.image}</div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-3 text-xs text-gray-600">
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {post.date}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
                          Read More
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3">
                Load More Articles
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get the latest articles delivered straight to your inbox.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-300"
                />
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 hover:bg-blue-600 text-gray-800 hover:text-white text-sm rounded-full transition-colors font-medium"
                  >
                    <Tag className="h-3 w-3 inline mr-1" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Articles */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                Trending
              </h3>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post, index) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm hover:text-blue-600 transition-colors cursor-pointer">
                        {post.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <span>{post.views} views</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="ml-2 text-xl font-bold">BlogHub</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your source for insightful articles on technology, design, business, and lifestyle.
              </p>
            </div>
            
            {[
              {
                title: "Categories",
                links: ["Technology", "Design", "Business", "Lifestyle", "Travel"]
              },
              {
                title: "Resources",
                links: ["About Us", "Contact", "Privacy Policy", "Terms of Service"]
              },
              {
                title: "Connect",
                links: ["Newsletter", "RSS Feed", "Twitter", "LinkedIn"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BlogHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}