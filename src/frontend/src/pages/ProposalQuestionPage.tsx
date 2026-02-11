import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import RouteTransition from '../components/RouteTransition';
import Decorations from '../components/Decorations';
import EditableText from '../editing/EditableText';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useEditableContent } from '../editing/EditableContentProvider';

export default function ProposalQuestionPage() {
  const navigate = useNavigate();
  const { content, updateContent } = useEditableContent();
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [noClickCount, setNoClickCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleYesClick = () => {
    navigate({ to: '/final' });
  };

  const handleNoClick = () => {
    if (prefersReducedMotion) {
      setShowTryAgain(true);
      setTimeout(() => setShowTryAgain(false), 2000);
      return;
    }

    setNoClickCount((prev) => prev + 1);
    setShowTryAgain(true);
    setTimeout(() => setShowTryAgain(false), 1500);

    // Move button to random position within safe bounds
    const maxX = window.innerWidth > 768 ? 300 : 150;
    const maxY = window.innerHeight > 768 ? 200 : 100;
    const newX = (Math.random() - 0.5) * maxX;
    const newY = (Math.random() - 0.5) * maxY;
    setNoButtonPosition({ x: newX, y: newY });
  };

  return (
    <RouteTransition>
      <div className="min-h-screen relative overflow-hidden">
        <Decorations variant="hearts" className="inset-0" />

        <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-2xl text-center space-y-12">
            <div className="space-y-6">
              <Heart className="w-24 h-24 mx-auto text-valentine-accent fill-valentine-accent animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-display font-bold text-valentine-text-dark dark:text-valentine-text-light leading-tight">
                <EditableText
                  value={content.proposal.question}
                  onChange={(value) => updateContent({ proposal: { ...content.proposal, question: value } })}
                  as="span"
                />
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative min-h-[120px]">
              <Button
                size="lg"
                onClick={handleYesClick}
                className="bg-valentine-accent hover:bg-valentine-accent-dark text-white font-bold text-xl px-16 py-8 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
              >
                <EditableText
                  value={content.proposal.yesButton}
                  onChange={(value) => updateContent({ proposal: { ...content.proposal, yesButton: value } })}
                  as="span"
                />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleNoClick}
                className="border-2 border-valentine-accent text-valentine-accent hover:bg-valentine-accent/10 font-bold text-xl px-16 py-8 rounded-full shadow-lg transition-all"
                style={{
                  transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                  transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease-out',
                }}
              >
                <EditableText
                  value={content.proposal.noButton}
                  onChange={(value) => updateContent({ proposal: { ...content.proposal, noButton: value } })}
                  as="span"
                />
              </Button>
            </div>

            {showTryAgain && (
              <div className="animate-bounce">
                <p className="text-2xl font-handwriting text-valentine-accent">
                  <EditableText
                    value={content.proposal.tryAgainMessage}
                    onChange={(value) =>
                      updateContent({ proposal: { ...content.proposal, tryAgainMessage: value } })
                    }
                    as="span"
                  />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RouteTransition>
  );
}
