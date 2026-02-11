import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import RouteTransition from '../components/RouteTransition';
import AnimatedText from '../components/AnimatedText';
import Decorations from '../components/Decorations';
import EditableText from '../editing/EditableText';
import LettersEditor from '../editing/LettersEditor';
import { useEditableContent } from '../editing/EditableContentProvider';

export default function LoveNotePage() {
  const navigate = useNavigate();
  const { content, updateContent, isEditMode } = useEditableContent();

  return (
    <RouteTransition>
      <div className="min-h-screen relative">
        <Decorations variant="hearts" className="inset-0 opacity-30" />

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <AnimatedText delay={200}>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-valentine-text-dark dark:text-valentine-text-light text-center mb-12">
                <EditableText
                  value={content.loveNote.heading}
                  onChange={(value) => updateContent({ loveNote: { ...content.loveNote, heading: value } })}
                  as="span"
                />
              </h1>
            </AnimatedText>

            {isEditMode && (
              <div className="mb-8">
                <LettersEditor />
              </div>
            )}

            <div className="space-y-8">
              {content.loveNote.letters.map((letter, index) => (
                <AnimatedText key={letter.id} delay={600 + index * 400}>
                  <Card className="p-8 md:p-12 bg-white/80 dark:bg-card/80 backdrop-blur-sm border-valentine-border shadow-2xl">
                    <h2 className="text-2xl font-display font-semibold text-valentine-text-dark dark:text-valentine-text-light mb-6 text-center">
                      {letter.heading}
                    </h2>
                    <div className="space-y-6 font-handwriting text-lg md:text-xl text-valentine-text-dark dark:text-valentine-text-light leading-relaxed">
                      {letter.body.split('\n\n').map((paragraph, pIndex) => (
                        <AnimatedText key={pIndex} delay={1000 + index * 400 + pIndex * 200}>
                          <p>{paragraph}</p>
                        </AnimatedText>
                      ))}
                    </div>
                  </Card>
                </AnimatedText>
              ))}
            </div>

            {content.loveNote.gifUrl && (
              <AnimatedText delay={2000}>
                <div className="mt-8 text-center">
                  <img
                    src={content.loveNote.gifUrl}
                    alt="Cute decoration"
                    className="inline-block max-w-xs rounded-lg shadow-lg"
                  />
                </div>
              </AnimatedText>
            )}

            <AnimatedText delay={2400}>
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/proposal' })}
                  className="bg-valentine-accent hover:bg-valentine-accent-dark text-white font-semibold px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </AnimatedText>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
}
