import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Search, 
  Globe, 
  Eye, 
  Edit, 
  Share, 
  Trash2, 
  Download,
  ArrowLeft,
  Filter
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  // Mock user ID for demo - in a real app this would come from auth
  const userId = "demo-user-123";

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["/api/projects", { userId }],
    enabled: true,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await apiRequest("DELETE", `/api/projects/${projectId}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete project: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects?.filter((project: Project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-green-500";
      case "draft": return "bg-yellow-500";
      case "building": return "bg-primary";
      default: return "bg-gray-500";
    }
  };

  const getStatusGradient = (status: string, index: number) => {
    const gradients = [
      "from-primary/20 to-accent/20",
      "from-secondary/20 to-muted/20", 
      "from-accent/20 to-primary/20",
      "from-green-500/20 to-blue-500/20",
    ];
    return gradients[index % gradients.length];
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground gradient-bg">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back-home">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground" data-testid="dashboard-page-title">
                Dashboard
              </h1>
            </div>
            <Link href="/builder">
              <Button className="glow-effect" data-testid="button-create-new-project">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Dashboard Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-projects"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground"
              data-testid="select-filter-status"
            >
              <option value="all">All Projects</option>
              <option value="live">Live</option>
              <option value="draft">Draft</option>
              <option value="building">Building</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="glass-effect" data-testid={`project-skeleton-${index}`}>
                <CardContent className="p-4">
                  <Skeleton className="aspect-video rounded-lg mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="glass-effect max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-4xl text-muted-foreground mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="error-title">
                Failed to Load Projects
              </h3>
              <p className="text-sm text-muted-foreground mb-4" data-testid="error-message">
                {error.message || "There was an error loading your projects. Please try again."}
              </p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/projects"] })}
                data-testid="button-retry-projects"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : filteredProjects.length === 0 ? (
          <Card className="glass-effect max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              {searchQuery || filterStatus !== "all" ? (
                <>
                  <div className="text-4xl text-muted-foreground mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="no-results-title">
                    No Projects Found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4" data-testid="no-results-message">
                    No projects match your current search or filter criteria.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                    }}
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-4xl text-muted-foreground mb-4">🚀</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="empty-state-title">
                    No Projects Yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4" data-testid="empty-state-message">
                    Create your first project to get started with BuildDost.
                  </p>
                  <Link href="/builder">
                    <Button className="glow-effect" data-testid="button-create-first-project">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Project
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project: Project, index: number) => (
              <Card 
                key={project.id} 
                className="glass-effect hover:glow-effect transition-all duration-300 cursor-pointer group"
                data-testid={`project-card-${project.id}`}
              >
                <CardContent className="p-4">
                  {/* Project Preview */}
                  <div className="aspect-video bg-muted rounded-lg mb-3 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getStatusGradient(project.status || "draft", index)} flex items-center justify-center`}>
                      <Globe className="text-2xl text-muted-foreground" size={24} />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge 
                        className={`${getStatusColor(project.status || "draft")} text-white text-xs`}
                        data-testid={`project-status-${project.id}`}
                      >
                        {project.status || "draft"}
                      </Badge>
                    </div>
                    {project.deploymentUrl && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="h-2 w-2 mr-1" />
                          Live
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <h4 className="font-medium text-foreground mb-1 truncate" data-testid={`project-name-${project.id}`}>
                    {project.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`project-description-${project.id}`}>
                    {project.description || "No description"}
                  </p>

                  {/* Project Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span data-testid={`project-updated-${project.id}`}>
                      {formatTimeAgo(new Date(project.updatedAt || project.createdAt))}
                    </span>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.deploymentUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.deploymentUrl, "_blank");
                          }}
                          data-testid={`button-visit-${project.id}`}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <Link href={`/builder/${project.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`button-edit-${project.id}`}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement share functionality
                          toast({
                            title: "Share feature coming soon",
                            description: "Project sharing will be available in the next update.",
                          });
                        }}
                        data-testid={`button-share-${project.id}`}
                      >
                        <Share className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this project?")) {
                            deleteProjectMutation.mutate(project.id);
                          }
                        }}
                        data-testid={`button-delete-${project.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-3 pt-3 border-t border-border flex space-x-2">
                    <Link href={`/builder/${project.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full text-xs" data-testid={`button-open-${project.id}`}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement export functionality
                        toast({
                          title: "Export feature coming soon",
                          description: "Code export will be available in the next update.",
                        });
                      }}
                      data-testid={`button-export-${project.id}`}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        {!isLoading && projects && (
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <Card className="glass-effect">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1" data-testid="stat-total-projects">
                  {projects.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1" data-testid="stat-live-projects">
                  {projects.filter((p: Project) => p.status === "live").length}
                </div>
                <div className="text-sm text-muted-foreground">Live Projects</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500 mb-1" data-testid="stat-draft-projects">
                  {projects.filter((p: Project) => p.status === "draft").length}
                </div>
                <div className="text-sm text-muted-foreground">Draft Projects</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1" data-testid="stat-building-projects">
                  {projects.filter((p: Project) => p.status === "building").length}
                </div>
                <div className="text-sm text-muted-foreground">Building</div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
