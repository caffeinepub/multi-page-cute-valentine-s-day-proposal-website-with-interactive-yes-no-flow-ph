import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { EditableContentProvider } from './editing/EditableContentProvider';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import PhotosMemoriesPage from './pages/PhotosMemoriesPage';
import LoveNotePage from './pages/LoveNotePage';
import ProposalQuestionPage from './pages/ProposalQuestionPage';
import FinalPage from './pages/FinalPage';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const photosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/photos',
  component: PhotosMemoriesPage,
});

const loveNoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/love-note',
  component: LoveNotePage,
});

const proposalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proposal',
  component: ProposalQuestionPage,
});

const finalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/final',
  component: FinalPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  photosRoute,
  loveNoteRoute,
  proposalRoute,
  finalRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <EditableContentProvider>
        <RouterProvider router={router} />
        <Toaster />
      </EditableContentProvider>
    </ThemeProvider>
  );
}
