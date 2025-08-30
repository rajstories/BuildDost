import { Box } from "lucide-react";
import { SiX, SiGithub, SiLinkedin, SiDiscord } from "react-icons/si";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Templates", href: "#templates" },
      { name: "Pricing", href: "#pricing" },
      { name: "Changelog", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Documentation", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
];

const socialLinks = [
  { icon: SiX, href: "#", name: "X" },
  { icon: SiGithub, href: "#", name: "GitHub" },
  { icon: SiLinkedin, href: "#", name: "LinkedIn" },
  { icon: SiDiscord, href: "#", name: "Discord" },
];

export default function Footer() {
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
                      className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors font-medium"
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
                    className="text-muted-foreground/60 hover:text-foreground transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-muted/20"
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
