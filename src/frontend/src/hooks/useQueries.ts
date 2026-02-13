import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ValentineContent } from '../content/valentineContent';

export function useGetPublishedContent() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<ValentineContent | null>({
    queryKey: ['publishedContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        const content = await actor.getPublishedContent();
        // Type guard: check if the content matches our expected structure
        if (content && typeof content === 'object' && 'recipientName' in content) {
          return content as unknown as ValentineContent;
        }
        // Backend data doesn't match expected structure
        return null;
      } catch (error) {
        console.error('Failed to fetch published content:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

export function useUpdatePublishedContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: ValentineContent) => {
      if (!actor) throw new Error('Actor not available');
      // Cast to any to bypass type mismatch until backend is fixed
      await actor.updatePublishedContent(content as any);
    },
    onSuccess: (_, variables) => {
      // Update the cached published content
      queryClient.setQueryData(['publishedContent'], variables);
    },
  });
}
