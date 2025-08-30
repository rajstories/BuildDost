import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import TemplateActions from "@/components/features/template-actions";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Zap, 
  Shield,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";
import { useState } from "react";

export default function LandingPageTemplate() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    toast({ title: "Navigation", description: `Scrolled to ${sectionId} section` });
  };

  const handleGetStarted = () => {
    toast({ title: "Get Started", description: "Redirecting to registration page..." });
  };

  const handleStartTrial = () => {
    toast({ title: "Free Trial", description: "Starting your 14-day free trial..." });
  };

  const handleWatchDemo = () => {
    toast({ title: "Demo", description: "Opening product demo video..." });
  };

  const handleFeatureClick = (featureTitle: string) => {
    toast({ title: "Feature Details", description: `Learn more about ${featureTitle}` });
  };

  const handlePlanSelect = (planName: string, price: string) => {
    toast({ title: "Plan Selected", description: `Selected ${planName} plan at ${price}/month` });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      toast({ title: "Form Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Message Sent", description: "Thank you! We'll get back to you within 24 hours." });
    setFormData({ firstName: "", lastName: "", email: "", message: "" });
  };

  const handleContactInfo = (type: string, value: string) => {
    if (type === 'phone') {
      window.open(`tel:${value}`, '_self');
    } else if (type === 'email') {
      window.open(`mailto:${value}`, '_self');
    } else if (type === 'address') {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(value)}`, '_blank');
    }
    toast({ title: "Contact", description: `Opening ${type}: ${value}` });
  };

  const handleSocialClick = (platform: string) => {
    toast({ title: "Social Media", description: `Opening ${platform} profile` });
  };

  const handleFooterLink = (linkName: string) => {
    toast({ title: "Navigation", description: `Opening ${linkName} page` });
  };
  return (
    <div className="min-h-screen bg-white">
      <TemplateActions templateId="landing" templateName="Landing Page" />
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">BusinessPro</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => handleScrollTo('features')} className="text-gray-700 hover:text-blue-600 transition-colors" data-testid="nav-features">Features</button>
              <button onClick={() => handleScrollTo('pricing')} className="text-gray-700 hover:text-blue-600 transition-colors" data-testid="nav-pricing">Pricing</button>
              <button onClick={() => handleScrollTo('about')} className="text-gray-700 hover:text-blue-600 transition-colors" data-testid="nav-about">About</button>
              <button onClick={() => handleScrollTo('contact')} className="text-gray-700 hover:text-blue-600 transition-colors" data-testid="nav-contact">Contact</button>
            </div>
            <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-nav-get-started">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white border-white/20 mb-4">
                ✨ New: AI-Powered Solutions
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transform Your Business with 
                <span className="text-yellow-300"> Smart Solutions</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Join over 10,000+ businesses that trust our platform to streamline operations, 
                boost productivity, and drive growth with cutting-edge technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleStartTrial} className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4" data-testid="button-start-trial">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button size="lg" onClick={handleWatchDemo} variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4" data-testid="button-watch-demo">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-white font-bold text-xl mb-2">Analytics Dashboard</h3>
                  <p className="text-white/80">Real-time insights and reporting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and features your business needs to thrive in today's competitive market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Experience blazing-fast performance with our optimized infrastructure and cutting-edge technology."
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Your data is protected with enterprise-grade security, encryption, and compliance standards."
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Seamlessly work together with advanced collaboration tools and real-time synchronization."
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <button key={index} onClick={() => handleFeatureClick(feature.title)} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-left w-full" data-testid={`feature-${feature.title.toLowerCase().replace(' ', '-')}`}>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <div className="flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold">4.9/5</span>
                <span>from 2,500+ reviews</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO, TechStart Inc.",
                image: "👩‍💼",
                quote: "This platform revolutionized how we operate. Our productivity increased by 300% within the first month."
              },
              {
                name: "Michael Chen",
                role: "CTO, DataFlow Solutions",
                image: "👨‍💻",
                quote: "The best investment we've made. The ROI was evident from day one, and the support team is exceptional."
              },
              {
                name: "Emily Rodriguez",
                role: "Founder, GrowthLab",
                image: "👩‍🚀",
                quote: "Incredible results! We scaled from 10 to 100 clients seamlessly with their robust infrastructure."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$29",
                period: "/month",
                features: ["Up to 5 users", "10GB storage", "Basic support", "Core features"],
                popular: false
              },
              {
                name: "Professional",
                price: "$79",
                period: "/month",
                features: ["Up to 25 users", "100GB storage", "Priority support", "Advanced features", "Analytics"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "$199",
                period: "/month",
                features: ["Unlimited users", "1TB storage", "24/7 support", "All features", "Custom integrations"],
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg ${plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="bg-blue-600 text-white mb-4">Most Popular</Badge>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => handlePlanSelect(plan.name, plan.price)} className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`} data-testid={`button-plan-${plan.name.toLowerCase()}`}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-600 mb-8">
                Ready to transform your business? Contact our team for a personalized demo and consultation.
              </p>
              
              <div className="space-y-4">
                <button onClick={() => handleContactInfo('phone', '+1 (555) 123-4567')} className="flex items-center hover:text-blue-600 transition-colors" data-testid="contact-phone">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">+1 (555) 123-4567</span>
                </button>
                <button onClick={() => handleContactInfo('email', 'hello@businesspro.com')} className="flex items-center hover:text-blue-600 transition-colors" data-testid="contact-email">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">hello@businesspro.com</span>
                </button>
                <button onClick={() => handleContactInfo('address', '123 Business Ave, Suite 100, NY 10001')} className="flex items-center hover:text-blue-600 transition-colors" data-testid="contact-address">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">123 Business Ave, Suite 100, NY 10001</span>
                </button>
              </div>

              <div className="flex space-x-4 mt-8">
                {[{Icon: Facebook, name: 'Facebook'}, {Icon: Twitter, name: 'Twitter'}, {Icon: Linkedin, name: 'LinkedIn'}, {Icon: Instagram, name: 'Instagram'}].map(({Icon, name}, index) => (
                  <button key={index} onClick={() => handleSocialClick(name)} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" data-testid={`social-${name.toLowerCase()}`}>
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
                    data-testid="input-email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    data-testid="input-message"
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3" data-testid="button-send-message">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="ml-2 text-xl font-bold">BusinessPro</span>
              </div>
              <p className="text-gray-400">
                Empowering businesses worldwide with innovative solutions and cutting-edge technology.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Security", "Integrations"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Press", "Partners"]
              },
              {
                title: "Support",
                links: ["Help Center", "Documentation", "Community", "Contact"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <button onClick={() => handleFooterLink(link)} className="text-gray-400 hover:text-white transition-colors" data-testid={`footer-${link.toLowerCase().replace(' ', '-')}`}>{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BusinessPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}