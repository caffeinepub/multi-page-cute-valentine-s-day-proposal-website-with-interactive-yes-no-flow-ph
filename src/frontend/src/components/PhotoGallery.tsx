import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Photo {
  src: string;
  caption: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`group cursor-pointer ${
              prefersReducedMotion ? '' : 'transition-transform hover:scale-105'
            }`}
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-valentine-darker">
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-3 text-center text-sm font-handwriting text-valentine-text-dark dark:text-valentine-text-light">
              {photo.caption}
            </p>
          </div>
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedIndex !== null && (
            <div className="relative">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-12 right-0 text-white hover:bg-white/20 rounded-full"
                >
                  <X className="h-6 w-6" />
                </Button>
              </DialogClose>

              <div className="relative">
                <img
                  src={photos[selectedIndex].src}
                  alt={photos[selectedIndex].caption}
                  className="w-full max-h-[80vh] object-contain rounded-lg"
                />
                <p className="mt-4 text-center text-white text-lg font-handwriting">
                  {photos[selectedIndex].caption}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
