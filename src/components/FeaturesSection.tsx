import { Sparkle, MapPin, User, TrendUp } from 'phosphor-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Sparkle,
      title: "AI Outfit Tagging",
      description: "Smart recognition categorizes your pieces and suggests perfect combinations",
      gradient: "from-primary/10 to-primary/5"
    },
    {
      icon: MapPin,
      title: "StyleMap Geo-Tagged Inspiration",
      description: "Discover trending styles in your area and connect with local fashion communities",
      gradient: "from-accent/10 to-accent/5"
    },
    {
      icon: User,
      title: "Avatar Dressing",
      description: "Visualize outfits on your digital twin before committing to the look",
      gradient: "from-primary-glow/10 to-primary-glow/5"
    },
    {
      icon: TrendUp,
      title: "Viral Challenges & Brand Drops",
      description: "Participate in exclusive challenges and get early access to limited releases",
      gradient: "from-purple-500/10 to-purple-500/5"
    }
  ];

  return (
    <section id="features" className="py-20 border-b border-border/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter mb-4">
            Standout <span className="text-primary">Features</span>
          </h2>
          <p className="text-lg font-light text-muted-foreground max-w-2xl mx-auto">
            Revolutionary tools that put you at the center of fashion culture
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass rounded-2xl p-8 group hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon with gradient background */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon 
                  size={32} 
                  weight="light" 
                  className="text-primary group-hover:text-primary-glow transition-colors"
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-light tracking-tight text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect decoration */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;