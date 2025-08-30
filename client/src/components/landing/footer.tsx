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
    <footer className="border-t border-border bg-card/30 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Box className="text-primary-foreground text-sm" size={16} />
              </div>
              <span className="text-xl font-bold text-foreground" data-testid="footer-logo">BuildDost</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="footer-description">
              AI-powered full-stack builder for non-technical founders.
            </p>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index} data-testid={`footer-section-${section.title.toLowerCase()}`}>
              <h4 className="font-semibold text-foreground mb-4" data-testid={`footer-title-${section.title.toLowerCase()}`}>
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="hover:text-foreground transition-colors"
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
            <h4 className="font-semibold text-foreground mb-4" data-testid="footer-title-connect">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`social-link-${social.name.toLowerCase()}`}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground" data-testid="footer-copyright">
          © 2024 BuildDost. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
