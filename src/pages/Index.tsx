import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/profile');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Wardrobe
          </CardTitle>
          <CardDescription className="text-lg">
            Share your style, discover others, and connect through fashion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Build your digital wardrobe, follow friends, and explore fashion inspiration from around the world.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
            >
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
