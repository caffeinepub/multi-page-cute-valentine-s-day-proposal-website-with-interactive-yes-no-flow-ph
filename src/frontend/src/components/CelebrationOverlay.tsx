import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function CelebrationOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src="/assets/generated/confetti-hearts.dim_1024x1024.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover animate-float"
      />
    </div>
  );
}
