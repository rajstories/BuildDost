import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import TemplateActions from "@/components/features/template-actions";
import { 
  ArrowRight, 
  ExternalLink, 
  Github,
  Mail,
  MapPin,
  Download,
  Eye,
  Calendar,
  User,
  Send
} from "lucide-react";

export default function PortfolioTemplate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Web Development",
      image: "🛒",
      description: "Modern e-commerce platform built with React and Node.js featuring real-time inventory management and secure payment processing.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      demo: "#",
      github: "#",
      featured: true
    },
    {
      id: 2,
      title: "Mobile Banking App",
      category: "Mobile Development", 
      image: "📱",
      description: "Secure mobile banking application with biometric authentication and real-time transaction monitoring.",
      tech: ["React Native", "Firebase", "Node.js"],
      demo: "#",
      github: "#",
      featured: true
    },
    {
      id: 3,
      title: "Analytics Dashboard",
      category: "Data Visualization",
      image: "📊",
      description: "Real-time analytics dashboard for tracking business metrics with interactive charts and reports.",
      tech: ["Vue.js", "D3.js", "Python", "PostgreSQL"],
      demo: "#",
      github: "#",
      featured: false
    },
    {
      id: 4,
      title: "Social Media Platform",
      category: "Full Stack",
      image: "💬",
      description: "Social networking platform with real-time messaging, content sharing, and user engagement features.",
      tech: ["Next.js", "Socket.io", "Redis", "AWS"],
      demo: "#",
      github: "#",
      featured: false
    },
    {
      id: 5,
      title: "AI Content Generator",
      category: "AI/ML",
      image: "🤖",
      description: "AI-powered content generation tool using machine learning to create engaging copy and marketing materials.",
      tech: ["Python", "TensorFlow", "FastAPI", "React"],
      demo: "#",
      github: "#",
      featured: true
    },
    {
      id: 6,
      title: "Project Management Tool",
      category: "Productivity",
      image: "📋",
      description: "Collaborative project management platform with task tracking, team communication, and progress visualization.",
      tech: ["Angular", "Express.js", "MongoDB", "Socket.io"],
      demo: "#",
      github: "#",
      featured: false
    }
  ];

  const skills = [
    { name: "JavaScript", level: 95 },
    { name: "React/Next.js", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "Python", level: 80 },
    { name: "TypeScript", level: 88 },
    { name: "MongoDB", level: 82 },
    { name: "AWS", level: 75 },
    { name: "Docker", level: 70 }
  ];

  const handleDownloadResume = () => {
    // Create a fake resume download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Alex Johnson - Resume\n\nFull Stack Developer\n\nExperience:\n- 5+ years of web development\n- 50+ projects completed\n- 30+ happy clients\n\nSkills:\n- JavaScript, React, Node.js\n- Python, TypeScript\n- MongoDB, AWS, Docker';
    link.download = 'Alex_Johnson_Resume.txt';
    link.click();
    toast({ title: "Resume Downloaded!", description: "Alex Johnson's resume has been downloaded successfully." });
  };

  const handleViewDemo = (project: any) => {
    toast({ 
      title: "Demo Launched!", 
      description: `Opening demo for ${project.title}` 
    });
    // In a real app, this would open the actual demo URL
  };

  const handleViewCode = (project: any) => {
    toast({ 
      title: "Code Repository", 
      description: `Opening GitHub repository for ${project.title}` 
    });
    // In a real app, this would open the GitHub URL
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ 
        title: "Please fill in all required fields", 
        variant: "destructive" 
      });
      return;
    }
    toast({ 
      title: "Message Sent!", 
      description: "Thank you for your message. I'll get back to you soon!" 
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSocialClick = (platform: string) => {
    toast({ 
      title: `Opening ${platform}`, 
      description: `Redirecting to ${platform} profile...` 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <TemplateActions templateId="portfolio" templateName="Portfolio" />
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-gray-900">Alex Johnson</div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-blue-600 transition-colors" data-testid="nav-about">About</button>
              <button onClick={() => scrollToSection('projects')} className="text-gray-700 hover:text-blue-600 transition-colors" data-testid="nav-projects">Projects</button>
              <button onClick={() => scrollToSection('skills')} className="text-gray-700 hover:text-blue-600 transition-colors" data-testid="nav-skills">Skills</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-600 transition-colors" data-testid="nav-contact">Contact</button>
            </div>
            <Button onClick={handleDownloadResume} className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-download-resume">
              <Download className="h-4 w-4 mr-2" />
              Resume
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-6xl mb-6">👨‍💻</div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Full Stack Developer & 
                <span className="text-blue-400"> Creative Problem Solver</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300 leading-relaxed">
                I craft exceptional digital experiences through innovative web development, 
                turning complex problems into elegant solutions that drive business growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => scrollToSection('projects')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4" data-testid="button-view-work">
                  <Eye className="h-5 w-5 mr-2" />
                  View My Work
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button size="lg" onClick={() => scrollToSection('contact')} variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4" data-testid="button-get-in-touch">
                  <Mail className="h-5 w-5 mr-2" />
                  Get In Touch
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Projects Completed</span>
                    <span className="text-3xl font-bold">50+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Years Experience</span>
                    <span className="text-3xl font-bold">5+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Happy Clients</span>
                    <span className="text-3xl font-bold">30+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Me</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                I'm a passionate full-stack developer with over 5 years of experience creating 
                innovative web applications. I specialize in React, Node.js, and modern web technologies, 
                always staying up-to-date with the latest industry trends.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                My journey began with a Computer Science degree and has evolved through working with 
                startups and established companies, where I've learned to balance technical excellence 
                with business objectives.
              </p>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>Available for freelance</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What I Do</h3>
              <div className="space-y-4">
                {[
                  "🎨 Frontend Development with React & Vue.js",
                  "⚡ Backend Development with Node.js & Python", 
                  "📱 Mobile App Development with React Native",
                  "☁️ Cloud Architecture & DevOps with AWS",
                  "🤖 AI/ML Integration & Data Analysis",
                  "🎯 UI/UX Design & User Experience Optimization"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-lg mr-3">{item.split(' ')[0]}</span>
                    <span className="text-gray-700">{item.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here are some of my recent projects that showcase my skills and passion for creating 
              exceptional digital experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {project.featured && (
                  <Badge className="absolute top-4 left-4 z-10 bg-blue-600 text-white">Featured</Badge>
                )}
                
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 h-48 flex items-center justify-center">
                  <div className="text-6xl">{project.image}</div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-4">
                      <Button size="sm" onClick={() => handleViewDemo(project)} className="bg-white text-gray-900 hover:bg-gray-100" data-testid={`button-demo-${project.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Demo
                      </Button>
                      <Button size="sm" onClick={() => handleViewCode(project)} variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900" data-testid={`button-code-${project.id}`}>
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                    <div className="flex space-x-2">
                      <button onClick={() => handleViewDemo(project)} className="text-gray-400 hover:text-blue-600" data-testid={`button-external-${project.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleViewCode(project)} className="text-gray-400 hover:text-blue-600" data-testid={`button-github-${project.id}`}>
                        <Github className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={() => toast({ title: "All Projects", description: "Loading complete project portfolio..." })} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3" data-testid="button-view-all-projects">
              View All Projects
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
            <p className="text-xl text-gray-600">Technologies I work with to bring ideas to life</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Technical Skills</h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Services</h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Web Development",
                    description: "Full-stack web applications using modern frameworks and best practices"
                  },
                  {
                    title: "Mobile Development", 
                    description: "Cross-platform mobile apps with React Native and native performance"
                  },
                  {
                    title: "UI/UX Design",
                    description: "User-centered design and intuitive interfaces that convert"
                  },
                  {
                    title: "Consulting",
                    description: "Technical consultation and architecture planning for your projects"
                  }
                ].map((service, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                    <h4 className="font-bold text-gray-900 mb-2">{service.title}</h4>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              I'm always excited to work on new projects and collaborate with amazing people. 
              Let's discuss how we can bring your ideas to life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-400 mr-4" />
                    <span>alex.johnson@email.com</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-400 mr-4" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-400 mr-4" />
                    <span>Available for new projects</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Follow Me</h4>
                <div className="flex space-x-4">
                  {['LinkedIn', 'GitHub', 'Twitter', 'Dribbble'].map((platform, index) => (
                    <button key={index} onClick={() => handleSocialClick(platform)} className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors" data-testid={`button-social-${platform.toLowerCase()}`}>
                      <span className="text-sm font-bold">{platform[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white" 
                      data-testid="input-name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white" 
                      data-testid="input-email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white" 
                    data-testid="input-subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white"
                    data-testid="textarea-message"
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3" data-testid="button-send-message">
                  Send Message
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">&copy; 2024 Alex Johnson. All rights reserved. Built with ❤️ using React & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}