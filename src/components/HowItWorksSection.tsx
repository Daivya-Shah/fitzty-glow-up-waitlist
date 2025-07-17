import fashionItems from '@/assets/fashion-items.jpg';

const HowItWorksSection = () => {
  const steps = [
    {
      title: "Upload your wardrobe or scan your closet",
      description: "AI-powered recognition catalogues your pieces instantly",
      image: fashionItems,
      gradient: "from-primary/20 to-transparent"
    },
    {
      title: "Post fits & tag your vibe",
      description: "Share your style and connect with your aesthetic tribe",
      image: fashionItems,
      gradient: "from-accent/20 to-transparent"
    },
    {
      title: "Earn clout & get AI style boosts",
      description: "Gain followers, unlock challenges, and level up your fashion game",
      image: fashionItems,
      gradient: "from-primary-glow/20 to-transparent"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 border-b border-border/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter mb-4">
            How <span className="text-primary">Fitzty</span> Works
          </h2>
          <p className="text-lg font-light text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your style into social currency
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group animate-fade-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="glass rounded-2xl p-8 h-full hover:shadow-glow transition-all duration-300 group-hover:scale-105">
                {/* Step number */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground font-medium mb-6">
                  {index + 1}
                </div>

                {/* Image */}
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${step.gradient}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-light tracking-tight text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-light">
                  {step.description}
                </p>

                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;