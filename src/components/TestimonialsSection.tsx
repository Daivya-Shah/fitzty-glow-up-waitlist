import { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Zara M.",
      handle: "@zara_styles",
      quote: "Boosted my style confidence!",
      result: "Got 50K+ likes on my first post",
      avatar: "🦄"
    },
    {
      name: "Marcus T.",
      handle: "@marcus_drip",
      quote: "Got featured in 3 viral challenges!",
      result: "Gained 25K followers in a week",
      avatar: "🔥"
    },
    {
      name: "Luna K.",
      handle: "@luna_aesthetic",
      quote: "AI suggestions are actually fire",
      result: "My style evolution is unreal",
      avatar: "✨"
    },
    {
      name: "Tyler R.",
      handle: "@tyler_threads",
      quote: "StyleMap helped me find my tribe",
      result: "Connected with local creators",
      avatar: "🚀"
    },
    {
      name: "Maya S.",
      handle: "@maya_minimal",
      quote: "From zero to style icon",
      result: "Brand partnerships rolling in",
      avatar: "💎"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-20 border-b border-border/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter mb-4">
            Early Access <span className="text-primary">Success Stories</span>
          </h2>
          <p className="text-lg font-light text-muted-foreground max-w-2xl mx-auto">
            See what beta users are saying about their Fitzty experience
          </p>
        </div>

        {/* Horizontal scroll testimonials */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{ 
              transform: `translateX(-${currentIndex * (320 + 24)}px)`,
              width: `${testimonials.length * (320 + 24)}px`
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="w-80 flex-shrink-0 glass rounded-2xl p-6 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
                  </div>
                </div>
                <blockquote className="text-lg font-light text-foreground mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-sm text-primary font-light">
                  {testimonial.result}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;