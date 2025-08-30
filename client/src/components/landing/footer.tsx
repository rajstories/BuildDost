import { Box } from "lucide-react";
import { SiX, SiGithub, SiLinkedin, SiDiscord } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#", internal: true, action: "features" },
      { name: "Templates", href: "#", internal: true, action: "templates" },
      { name: "Pricing", href: "#", internal: true, action: "pricing" },
      { name: "Changelog", href: "#", internal: true, action: "changelog" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Documentation", href: "#", internal: true, action: "documentation" },
      { name: "Help Center", href: "https://wa.me/919958262272?text=Hi%2C%20I%20need%20help%20with%20BuildDost", internal: false },
      { name: "Community", href: "#", internal: true, action: "community" },
      { name: "Contact", href: "https://wa.me/919958262272?text=Hi%2C%20I%20want%20to%20contact%20BuildDost%20team", internal: false },
    ],
  },
];

const socialLinks = [
  { icon: SiX, href: "https://x.com/rajstories", name: "X" },
  { icon: SiGithub, href: "https://github.com/rajstories", name: "GitHub" },
  { icon: SiLinkedin, href: "https://linkedin.com/in/rajhub", name: "LinkedIn" },
  { icon: SiDiscord, href: "https://discord.gg/builddost", name: "Discord" },
];

export default function Footer() {
  const { toast } = useToast();

  const handleLinkClick = (linkName: string, href: string, isInternal: boolean, action?: string) => {
    if (isInternal && action) {
      // Handle internal actions with informative toasts
      const messages = {
        features: "Explore our AI-powered features: real-time code generation, drag-and-drop builder, and smart templates!",
        templates: "Browse our template library: e-commerce, portfolios, dashboards, and more - all customizable!",
        pricing: "Simple pricing: Free tier available, Premium starts at $9/month with advanced AI features.",
        changelog: "Stay updated with our latest releases, bug fixes, and new AI capabilities!",
        documentation: "Access our comprehensive docs, tutorials, and API guides. Full library coming soon!",
        community: "Join our developer community for collaboration, support, and exclusive updates!"
      };
      
      toast({ 
        title: linkName, 
        description: messages[action as keyof typeof messages] || `${linkName} information`,
        duration: 5000
      });
    } else if (!isInternal && href.includes('wa.me')) {
      // WhatsApp links - open directly
      window.open(href, '_blank');
      toast({ 
        title: "WhatsApp", 
        description: `Opening WhatsApp to ${linkName.toLowerCase()} BuildDost team`,
        duration: 3000
      });
    } else {
      toast({ title: "Navigation", description: `Opening ${linkName}` });
    }
  };

  const handleSocialClick = (socialName: string) => {
    toast({ title: "Social Media", description: `Opening ${socialName} profile` });
  };

  return (
    <footer className="relative z-10 border-t border-border/30 bg-background/80 backdrop-blur-sm py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-9 h-9">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-lg shadow-md"></div>
                {/* Inner gradient overlay */}
                <div className="absolute inset-0.5 bg-gradient-to-br from-primary/20 to-transparent rounded-[6px]"></div>
                {/* Logo symbol */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                    <path 
                      d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" 
                      fill="currentColor" 
                      fillOpacity="0.9"
                    />
                    <path 
                      d="M9 22V12H15V22" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <circle cx="12" cy="8" r="1.5" fill="currentColor" fillOpacity="0.7"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight" data-testid="footer-logo">BuildDost</span>
            </div>
            <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed max-w-xs" data-testid="footer-description">
              AI-powered full-stack builder for non-technical founders.
            </p>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index} data-testid={`footer-section-${section.title.toLowerCase()}`}>
              <h4 className="font-semibold text-foreground mb-6 text-sm tracking-wide" data-testid={`footer-title-${section.title.toLowerCase()}`}>
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      target={link.internal ? undefined : "_blank"}
                      rel={link.internal ? undefined : "noopener noreferrer"}
                      onClick={(e) => {
                        if (link.internal) {
                          e.preventDefault();
                        }
                        handleLinkClick(link.name, link.href, link.internal, (link as any).action);
                      }}
                      className="text-sm text-muted-foreground/70 hover:text-foreground hover:text-primary transition-all duration-200 font-medium cursor-pointer hover:underline hover:underline-offset-4"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div data-testid="footer-social">
            <h4 className="font-semibold text-foreground mb-6 text-sm tracking-wide" data-testid="footer-title-connect">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick(social.name)}
                    className="text-muted-foreground/60 hover:text-foreground hover:text-primary transition-all duration-300 hover:scale-125 p-2 rounded-lg hover:bg-muted/30 hover:shadow-lg cursor-pointer"
                    data-testid={`social-link-${social.name.toLowerCase()}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/30 mt-12 pt-8 text-center" data-testid="footer-copyright">
          <p className="text-sm text-muted-foreground/60 font-medium">
            © 2025 BuildDost. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
