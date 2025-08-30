import { Button } from "@/components/ui/button";
import { Plus, Globe, Eye, Edit, Share } from "lucide-react";
import { Link } from "wouter";

const mockProjects = [
  {
    id: "1",
    name: "E-commerce Store",
    description: "Online store with payment integration",
    status: "Live",
    statusColor: "bg-green-500",
    lastModified: "2 hours ago",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    id: "2",
    name: "Personal Blog",
    description: "Content management system",
    status: "Draft",
    statusColor: "bg-yellow-500",
    lastModified: "1 day ago",
    gradient: "from-secondary/20 to-muted/20",
  },
  {
    id: "3",
    name: "Analytics Dashboard",
    description: "Real-time data visualization",
    status: "Building",
    statusColor: "bg-primary",
    lastModified: "3 days ago",
    gradient: "from-accent/20 to-primary/20",
  },
];

export default function ProjectDashboard() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="dashboard-title">
            Project Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="dashboard-description">
            Manage all your projects in one place with version control and collaboration features.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-6 shadow-xl">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6" data-testid="dashboard-header">
              <h3 className="text-xl font-semibold text-foreground" data-testid="projects-title">Your Projects</h3>
              <Link href="/builder">
                <Button className="glow-effect" data-testid="button-new-project">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </Link>
            </div>
            
            {/* Project Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-card border border-border rounded-lg p-4 hover:bg-card/80 transition-colors cursor-pointer"
                  data-testid={`project-card-${project.id}`}
                >
                  <div className="aspect-video bg-muted rounded-lg mb-3 relative overflow-hidden">
                    {/* Mockup of website preview */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                      <Globe className="text-2xl text-muted-foreground" size={24} />
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 ${project.statusColor} text-white text-xs rounded-full`} data-testid={`project-status-${project.id}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-medium text-foreground mb-1" data-testid={`project-name-${project.id}`}>
                    {project.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3" data-testid={`project-description-${project.id}`}>
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span data-testid={`project-modified-${project.id}`}>{project.lastModified}</span>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors" data-testid={`project-view-${project.id}`} />
                      <Edit className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors" data-testid={`project-edit-${project.id}`} />
                      <Share className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors" data-testid={`project-share-${project.id}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
