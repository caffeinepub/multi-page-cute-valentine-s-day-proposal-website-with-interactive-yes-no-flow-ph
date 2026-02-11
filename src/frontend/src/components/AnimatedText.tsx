import { ReactNode, useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AnimatedTextProps {
  children: ReactNode;
  delay?: number;
}

export default function AnimatedText({ children, delay = 0 }: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}
