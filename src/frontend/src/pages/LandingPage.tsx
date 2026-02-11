import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import RouteTransition from '../components/RouteTransition';
import Decorations from '../components/Decorations';
import EditableText from '../editing/EditableText';
import { useEditableContent } from '../editing/EditableContentProvider';

export default function LandingPage() {
  const navigate = useNavigate();
  const { content, updateContent } = useEditableContent();

  return (
    <RouteTransition>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: 'url(/assets/generated/valentine-bg.dim_1920x1080.png)' }}
        />

        {/* Corner Decorations */}
        <Decorations variant="corner" className="top-0 left-0 w-64 h-64 -translate-x-8 -translate-y-8" />
        <Decorations variant="corner" className="bottom-0 right-0 w-64 h-64 translate-x-8 translate-y-8 rotate-180" />

        {/* Floating Hearts */}
        <Decorations variant="hearts" className="inset-0" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen text-center">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <Heart className="w-20 h-20 mx-auto text-valentine-accent fill-valentine-accent animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-display font-bold text-valentine-text-dark dark:text-valentine-text-light leading-tight">
                <EditableText
                  value={content.landing.heading.replace('[Name]', content.recipientName)}
                  onChange={(value) => updateContent({ landing: { ...content.landing, heading: value } })}
                  as="span"
                />
              </h1>
              <p className="text-xl md:text-2xl font-handwriting text-valentine-text-dark/80 dark:text-valentine-text-light/80">
                <EditableText
                  value={content.landing.subheading}
                  onChange={(value) => updateContent({ landing: { ...content.landing, subheading: value } })}
                  as="span"
                />
              </p>
            </div>

            <div className="pt-8">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/photos' })}
                className="bg-valentine-accent hover:bg-valentine-accent-dark text-white font-semibold text-lg px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <EditableText
                  value={content.landing.buttonText}
                  onChange={(value) => updateContent({ landing: { ...content.landing, buttonText: value } })}
                  as="span"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
}
