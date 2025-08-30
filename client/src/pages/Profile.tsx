import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building, MapPin, Globe, Edit, Camera, LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { UpdateUserProfile } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Profile() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    company: '',
    location: '',
    website: '',
    profileImageUrl: ''
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        company: user.company || '',
        location: user.location || '',
        website: user.website || '',
        profileImageUrl: user.profileImageUrl || ''
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: UpdateUserProfile) => {
      await apiRequest("PUT", "/api/auth/profile", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "Redirecting to logout...",
    });
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  const getInitials = () => {
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground" data-testid="profile-title">
            User Profile
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="profile-description">
            Manage your account settings and personal information
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm" data-testid="profile-card">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/20" data-testid="profile-avatar">
                  <AvatarImage src={user.profileImageUrl || undefined} alt="Profile" />
                  <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8 bg-background border-2 border-primary/20"
                  data-testid="change-avatar-button"
                  onClick={() => toast({ title: "Coming Soon", description: "Image upload will be available soon!" })}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold" data-testid="profile-name">
              {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User'}
            </CardTitle>
            <CardDescription className="text-lg" data-testid="profile-email">
              {user.email}
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary" data-testid="user-status">
                <User className="w-3 h-3 mr-1" />
                Active User
              </Badge>
              <Badge variant="outline" data-testid="account-type">
                Personal Account
              </Badge>
            </div>
          </CardHeader>

          <Separator className="mx-6" />

          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold" data-testid="profile-info-title">Profile Information</h3>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      data-testid="cancel-edit-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={updateProfileMutation.isPending}
                      data-testid="save-profile-button"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    data-testid="edit-profile-button"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="profile-edit-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange('firstName')}
                      placeholder="Enter your first name"
                      data-testid="input-firstname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                      placeholder="Enter your last name"
                      data-testid="input-lastname"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="Enter your email"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={handleInputChange('bio')}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    data-testid="input-bio"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange('company')}
                      placeholder="Your company"
                      data-testid="input-company"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={handleInputChange('location')}
                      placeholder="City, Country"
                      data-testid="input-location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange('website')}
                    placeholder="https://yourwebsite.com"
                    data-testid="input-website"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6" data-testid="profile-display">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="text-foreground" data-testid="display-fullname">
                          {user.firstName || user.lastName 
                            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                            : 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-foreground" data-testid="display-email">{user.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Company</p>
                        <p className="text-foreground" data-testid="display-company">{user.company || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p className="text-foreground" data-testid="display-location">{user.location || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Website</p>
                        {user.website ? (
                          <a 
                            href={user.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                            data-testid="display-website"
                          >
                            {user.website}
                          </a>
                        ) : (
                          <p className="text-foreground" data-testid="display-website">Not provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {user.bio && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Bio</p>
                    <p className="text-foreground leading-relaxed" data-testid="display-bio">{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm" data-testid="account-actions-card">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}