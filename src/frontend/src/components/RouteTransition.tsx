import { ReactNode, useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface RouteTransitionProps {
  children: ReactNode;
}

export default function RouteTransition({ children }: RouteTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [children]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}
