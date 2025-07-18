import { useState } from 'react';

const TestimonialsSection = () => {
  // Remove all testimonial logic, just keep the navigation dots
  const testimonials = [1, 2, 3, 4, 5]; // Placeholder for 5 dots
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;