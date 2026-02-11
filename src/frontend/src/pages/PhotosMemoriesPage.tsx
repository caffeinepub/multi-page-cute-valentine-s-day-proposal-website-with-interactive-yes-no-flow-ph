import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import RouteTransition from '../components/RouteTransition';
import PhotoGallery from '../components/PhotoGallery';
import Decorations from '../components/Decorations';
import EditableText from '../editing/EditableText';
import PhotoMemoriesEditor from '../editing/PhotoMemoriesEditor';
import { useEditableContent } from '../editing/EditableContentProvider';

export default function PhotosMemoriesPage() {
  const navigate = useNavigate();
  const { content, updateContent, isEditMode } = useEditableContent();

  return (
    <RouteTransition>
      <div className="min-h-screen relative">
        <Decorations variant="sparkles" className="inset-0" />

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-valentine-text-dark dark:text-valentine-text-light mb-4">
              <EditableText
                value={content.photos.heading}
                onChange={(value) => updateContent({ photos: { ...content.photos, heading: value } })}
                as="span"
              />
            </h1>
            <p className="text-lg md:text-xl font-handwriting text-valentine-text-dark/80 dark:text-valentine-text-light/80">
              <EditableText
                value={content.photos.subheading}
                onChange={(value) => updateContent({ photos: { ...content.photos, subheading: value } })}
                as="span"
              />
            </p>
          </div>

          {isEditMode && (
            <div className="mb-8 max-w-4xl mx-auto">
              <PhotoMemoriesEditor />
            </div>
          )}

          <PhotoGallery photos={content.photos.photos} />

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/love-note' })}
              className="bg-valentine-accent hover:bg-valentine-accent-dark text-white font-semibold px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
}
