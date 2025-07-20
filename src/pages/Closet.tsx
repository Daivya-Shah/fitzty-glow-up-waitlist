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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Fitzy</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" className="text-blue-600 font-medium">
                Home
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Explore
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
                Notifications
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <MessageCircle className="h-5 w-5" />
                Messages
              </Button>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowUpload(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/profile')}
                className="rounded-full"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Closet</h1>
            <p className="text-gray-600 mt-1">Organize and style your wardrobe</p>
          </div>
          <Button 
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-medium"
          >
            Create New Outfit
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search outfits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Filter Tags */}
          <div className="flex items-center gap-3 flex-wrap">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant={selectedFilters.includes(filter) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
                  selectedFilters.includes(filter)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-lg"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-lg"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Wardrobe Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <WardrobeGrid userId={profile.user_id} isOwnWardrobe={true} />
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