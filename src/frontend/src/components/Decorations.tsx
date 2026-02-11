import { useReducedMotion } from '../hooks/useReducedMotion';
import { Heart, Sparkles } from 'lucide-react';

interface DecorationsProps {
  variant?: 'hearts' | 'sparkles' | 'corner';
  className?: string;
}

export default function Decorations({ variant = 'hearts', className = '' }: DecorationsProps) {
  const prefersReducedMotion = useReducedMotion();

  if (variant === 'corner') {
    return (
      <div className={`absolute pointer-events-none ${className}`}>
        <img
          src="/assets/generated/corner-decor.dim_1024x1024.png"
          alt=""
          className="w-full h-full object-contain opacity-60"
        />
      </div>
    );
  }

  if (variant === 'sparkles') {
    return (
      <div className={`absolute pointer-events-none ${className}`}>
        {[...Array(5)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute text-valentine-accent opacity-40 ${
              prefersReducedMotion ? '' : 'animate-pulse'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              width: `${16 + Math.random() * 16}px`,
              height: `${16 + Math.random() * 16}px`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {[...Array(8)].map((_, i) => (
        <Heart
          key={i}
          className={`absolute text-valentine-accent fill-valentine-accent/30 ${
            prefersReducedMotion ? '' : 'animate-float'
          }`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            width: `${12 + Math.random() * 20}px`,
            height: `${12 + Math.random() * 20}px`,
          }}
        />
      ))}
    </div>
  );
}
