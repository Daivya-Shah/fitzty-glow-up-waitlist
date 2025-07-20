import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Upload, Search, Grid3X3, List, Plus, Filter, Menu, Bell, MessageCircle, User } from 'lucide-react';
import WardrobeUpload from '@/components/WardrobeUpload';
import WardrobeGrid from '@/components/WardrobeGrid';

interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
}

const Closet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = ['Casual', 'Zara', 'Summer 2025', 'Formal', 'Vintage', 'Designer'];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user?.id) return;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(profileData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="blur-nav border-b border-border/40 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold tracking-tighter text-foreground"
            >
              Fitzty
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" className="text-foreground font-medium">
                Home
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Explore
              </Button>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/profile')}
                className="rounded-full"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-glow">
              <User className="h-12 w-12 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">{profile.display_name || profile.username}</h1>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span><strong className="text-foreground">342</strong> following</span>
                <span><strong className="text-foreground">1.2k</strong> followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Closet Section */}
        <div className="mb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">My Closet</h2>
              <p className="text-muted-foreground mt-1">Create and organize your digital wardrobe</p>
            </div>
            <Button 
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 text-primary border border-primary/20 rounded-full px-6 py-3 font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              Create New Outfit
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Gallery Grid */}
          <div className="bg-card rounded-2xl shadow-card border border-border/20 p-6">
            <WardrobeGrid userId={profile.user_id} isOwnWardrobe={true} />
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <WardrobeUpload
          onClose={() => setShowUpload(false)}
          onUploadComplete={() => {
            setShowUpload(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default Closet;