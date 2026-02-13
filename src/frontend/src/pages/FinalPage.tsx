import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Heart, Calendar, MapPin, Clock } from 'lucide-react';
import RouteTransition from '../components/RouteTransition';
import AnimatedText from '../components/AnimatedText';
import { useEditableContent } from '../editing/EditableContentProvider';
import EditableText from '../editing/EditableText';

export default function FinalPage() {
  const { content, updateContent } = useEditableContent();

  const handleMessageChange = (newMessage: string) => {
    updateContent({
      celebration: {
        ...content.celebration,
        message: newMessage,
      },
    });
  };

  const handleActivityTitleChange = (index: number, newTitle: string) => {
    const updatedActivities = content.celebration.datePlan.activities.map((activity, i) =>
      i === index ? { ...activity, title: newTitle } : activity
    );
    updateContent({
      celebration: {
        ...content.celebration,
        datePlan: {
          ...content.celebration.datePlan,
          activities: updatedActivities,
        },
      },
    });
  };

  const handleActivityDescriptionChange = (index: number, newDescription: string) => {
    const updatedActivities = content.celebration.datePlan.activities.map((activity, i) =>
      i === index ? { ...activity, description: newDescription } : activity
    );
    updateContent({
      celebration: {
        ...content.celebration,
        datePlan: {
          ...content.celebration.datePlan,
          activities: updatedActivities,
        },
      },
    });
  };

  return (
    <RouteTransition>
      <div className="min-h-screen relative">
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <AnimatedText delay={200}>
              <div className="space-y-6">
                <Heart className="w-32 h-32 mx-auto text-valentine-accent fill-valentine-accent animate-pulse" />
                <h1 className="text-5xl md:text-7xl font-display font-bold text-valentine-text-dark dark:text-valentine-text-light leading-tight">
                  <EditableText
                    value={content.celebration.message}
                    onChange={handleMessageChange}
                    placeholder="Celebration message"
                    as="span"
                  />
                </h1>
              </div>
            </AnimatedText>

            {content.celebration.datePlan.enabled && (
              <AnimatedText delay={800}>
                <Card className="p-8 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-valentine-border shadow-2xl">
                  <h2 className="text-3xl font-display font-bold text-valentine-text-dark dark:text-valentine-text-light mb-6">
                    Our Special Date 💕
                  </h2>

                  <Accordion type="single" collapsible className="w-full">
                    {content.celebration.datePlan.activities.map((activity, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-handwriting text-lg">
                          <div className="flex items-center gap-3">
                            {activity.icon === 'calendar' && <Calendar className="h-5 w-5 text-valentine-accent" />}
                            {activity.icon === 'map' && <MapPin className="h-5 w-5 text-valentine-accent" />}
                            {activity.icon === 'clock' && <Clock className="h-5 w-5 text-valentine-accent" />}
                            <EditableText
                              value={activity.title}
                              onChange={(newTitle) => handleActivityTitleChange(index, newTitle)}
                              placeholder="Activity title"
                              as="span"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-valentine-text-dark/80 dark:text-valentine-text-light/80 font-handwriting">
                          <EditableText
                            value={activity.description}
                            onChange={(newDescription) => handleActivityDescriptionChange(index, newDescription)}
                            multiline
                            placeholder="Activity description"
                            as="span"
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              </AnimatedText>
            )}

            <AnimatedText delay={1200}>
              <div className="pt-8">
                <p className="text-2xl font-handwriting text-valentine-text-dark/80 dark:text-valentine-text-light/80">
                  I can't wait to spend this special day with you! 💖
                </p>
              </div>
            </AnimatedText>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
}
