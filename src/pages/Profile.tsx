import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Users, UserPlus, UserMinus, Settings } from 'lucide-react';
import WardrobeUpload from '@/components/WardrobeUpload';
import WardrobeGrid from '@/components/WardrobeGrid';

interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  follower_count: number;
  following_count: number;
  is_following: boolean;
}

const Profile = () => {
  const { user } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = !username || (profile && user?.id === profile.user_id);

  useEffect(() => {
    if (!user && !username) {
      navigate('/auth');
      return;
    }
    
    fetchProfile();
  }, [user, username]);

  const fetchProfile = async () => {
    try {
      let targetUserId = user?.id;
      
      if (username) {
        // Fetch profile by username
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        targetUserId = profileData.user_id;
      }

      if (!targetUserId) return;

      // Get basic profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      if (error) throw error;

      // Get follower count
      const { count: followerCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      // Get following count
      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', targetUserId);

      // Check if current user is following this profile
      let isFollowing = false;
      if (user && user.id !== targetUserId) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)
          .single();
        
        isFollowing = !!followData;
      }

      setProfile({
        ...profileData,
        follower_count: followerCount || 0,
        following_count: followingCount || 0,
        is_following: isFollowing
      });
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

  const handleFollow = async () => {
    if (!user || !profile) return;

    setFollowLoading(true);
    try {
      if (profile.is_following) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.user_id);
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: profile.user_id
          });
      }

      setProfile(prev => prev ? {
        ...prev,
        is_following: !prev.is_following,
        follower_count: prev.is_following 
          ? prev.follower_count - 1 
          : prev.follower_count + 1
      } : null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update follow status",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Wardrobe
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/search')}
            >
              <Users className="h-4 w-4 mr-2" />
              Discover
            </Button>
            {isOwnProfile && (
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-lg">
                  {profile.display_name?.charAt(0)?.toUpperCase() || profile.username?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-2xl font-bold">{profile.display_name || profile.username}</h2>
                  {!isOwnProfile && (
                    <Button
                      onClick={handleFollow}
                      disabled={followLoading}
                      variant={profile.is_following ? "outline" : "default"}
                      size="sm"
                    >
                      {profile.is_following ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">@{profile.username}</p>
                {profile.bio && <p className="mb-4">{profile.bio}</p>}
                <div className="flex gap-4">
                  <Badge variant="secondary">
                    {profile.follower_count} Followers
                  </Badge>
                  <Badge variant="secondary">
                    {profile.following_count} Following
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Wardrobe Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Wardrobe</CardTitle>
              {isOwnProfile && (
                <Button
                  onClick={() => setShowUpload(true)}
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <WardrobeGrid userId={profile.user_id} isOwnWardrobe={isOwnProfile} />
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <WardrobeUpload
          onClose={() => setShowUpload(false)}
          onUploadComplete={() => {
            setShowUpload(false);
            // Refresh wardrobe
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default Profile;