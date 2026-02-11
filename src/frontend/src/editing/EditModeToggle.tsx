import { Edit3, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useEditableContent } from './EditableContentProvider';

export default function EditModeToggle() {
  const { isEditMode, setEditMode, resetContent } = useEditableContent();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleReset = () => {
    resetContent();
    setShowResetDialog(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isEditMode ? (
          <Button
            size="lg"
            onClick={() => setEditMode(true)}
            className="rounded-full shadow-2xl bg-valentine-accent hover:bg-valentine-accent-dark text-white font-semibold px-6 py-6"
            title="Enable Edit Mode"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Edit
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                className="rounded-full shadow-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-6"
                title="Edit Mode Active"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                Editing
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setEditMode(false)}>
                <X className="h-4 w-4 mr-2" />
                Exit Edit Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowResetDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Default Content?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your edits and restore the original content. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
