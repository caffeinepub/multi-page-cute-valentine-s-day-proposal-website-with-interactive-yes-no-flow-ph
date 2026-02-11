import { useState } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useEditableContent } from './EditableContentProvider';
import { Letter } from '../content/valentineContent';

export default function LettersEditor() {
  const { content, addLetter, updateLetter, deleteLetter } = useEditableContent();
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ heading: '', body: '' });

  const handleOpenEdit = (letter: Letter) => {
    setEditingLetter(letter);
    setFormData({ heading: letter.heading, body: letter.body });
  };

  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setFormData({ heading: '', body: '' });
  };

  const handleSave = () => {
    if (editingLetter) {
      updateLetter(editingLetter.id, formData);
      setEditingLetter(null);
    } else if (isAddingNew) {
      addLetter(formData);
      setIsAddingNew(false);
    }
    setFormData({ heading: '', body: '' });
  };

  const handleCancel = () => {
    setEditingLetter(null);
    setIsAddingNew(false);
    setFormData({ heading: '', body: '' });
  };

  const handleDelete = (letterId: string) => {
    deleteLetter(letterId);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-valentine-text-dark dark:text-valentine-text-light">
          Manage Letters
        </h3>
        <Button onClick={handleOpenAdd} size="sm" className="bg-valentine-accent hover:bg-valentine-accent-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Letter
        </Button>
      </div>

      <div className="space-y-3">
        {content.loveNote.letters.map((letter) => (
          <Card key={letter.id} className="bg-white/50 dark:bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="truncate">{letter.heading}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(letter)}
                    className="h-8 w-8"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirm(letter.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{letter.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editingLetter !== null || isAddingNew} onOpenChange={handleCancel}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingLetter ? 'Edit Letter' : 'Add New Letter'}</DialogTitle>
            <DialogDescription>
              {editingLetter ? 'Update the letter heading and body.' : 'Create a new love letter.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Letter Heading</Label>
              <Input
                id="heading"
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                placeholder="e.g., To My Dearest"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Letter Body</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Write your heartfelt message here..."
                rows={10}
                className="font-handwriting"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.heading.trim() || !formData.body.trim()}
              className="bg-valentine-accent hover:bg-valentine-accent-dark"
            >
              {editingLetter ? 'Save Changes' : 'Add Letter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Letter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this letter. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
