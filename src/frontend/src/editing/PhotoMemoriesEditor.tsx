import { useState } from 'react';
import { Plus, Trash2, Edit3, Upload, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEditableContent } from './EditableContentProvider';
import { Photo } from '../content/valentineContent';
import { validateImageUrl, fileToDataUrl } from './imageSourceUtils';
import { toast } from 'sonner';

export default function PhotoMemoriesEditor() {
  const { content, addPhoto, updatePhoto, deletePhoto } = useEditableContent();
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ src: '', caption: '' });
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleOpenEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setFormData({ src: photo.src, caption: photo.caption });
    setUrlError(null);
  };

  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setFormData({ src: '', caption: '' });
    setUrlError(null);
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, src: url });
    if (url.trim()) {
      const validation = validateImageUrl(url);
      setUrlError(validation.valid ? null : validation.error || null);
    } else {
      setUrlError(null);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setFormData({ ...formData, src: dataUrl });
      setUrlError(null);
      toast.success('Image loaded successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load image';
      setUrlError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    const validation = validateImageUrl(formData.src);
    if (!validation.valid) {
      setUrlError(validation.error || 'Invalid image URL');
      return;
    }

    if (!formData.caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    if (editingPhoto) {
      updatePhoto(editingPhoto.id, formData);
      toast.success('Photo updated');
      setEditingPhoto(null);
    } else if (isAddingNew) {
      addPhoto(formData);
      toast.success('Photo added');
      setIsAddingNew(false);
    }
    setFormData({ src: '', caption: '' });
    setUrlError(null);
  };

  const handleCancel = () => {
    setEditingPhoto(null);
    setIsAddingNew(false);
    setFormData({ src: '', caption: '' });
    setUrlError(null);
  };

  const handleDelete = (photoId: string) => {
    deletePhoto(photoId);
    setDeleteConfirm(null);
    toast.success('Photo deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-valentine-text-dark dark:text-valentine-text-light">
          Manage Photos
        </h3>
        <Button onClick={handleOpenAdd} size="sm" className="bg-valentine-accent hover:bg-valentine-accent-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Photo
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {content.photos.photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group relative">
            <div className="aspect-square relative">
              <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleOpenEdit(photo)}
                  className="h-8 w-8"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setDeleteConfirm(photo.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-2">
              <p className="text-xs text-center truncate">{photo.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editingPhoto !== null || isAddingNew} onOpenChange={handleCancel}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPhoto ? 'Edit Photo' : 'Add New Photo'}</DialogTitle>
            <DialogDescription>
              {editingPhoto ? 'Update the photo source and caption.' : 'Add a new photo memory.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Image URL
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.src}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={urlError ? 'border-destructive' : ''}
                />
                {urlError && (
                  <Alert variant="destructive">
                    <AlertDescription>{urlError}</AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              <TabsContent value="upload" className="space-y-2">
                <Label htmlFor="imageFile">Select Image File</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 5MB. The image will be stored in your browser.
                </p>
                {isUploading && <p className="text-sm text-muted-foreground">Loading image...</p>}
              </TabsContent>
            </Tabs>

            {formData.src && !urlError && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="aspect-square max-w-xs mx-auto rounded-lg overflow-hidden border">
                  <img src={formData.src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="e.g., Our first date ✨"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.src.trim() || !formData.caption.trim() || !!urlError || isUploading}
              className="bg-valentine-accent hover:bg-valentine-accent-dark"
            >
              {editingPhoto ? 'Save Changes' : 'Add Photo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this photo. This action cannot be undone.
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
