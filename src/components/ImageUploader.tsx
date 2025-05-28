import React, { useState, useEffect } from 'react';
import { uploadItemImages, deleteImageFromStorage } from '@/lib/uploadItemImages';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, Upload, X, ImagePlus, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

type ImageUploaderProps = {
  userId: string;
  itemId?: string; // Optional for new items
  onUploadComplete: (urls: string[]) => void;
  existingImages?: string[];
  onExistingImageDelete?: (url: string) => void;
};

const ImageUploader = ({
  userId,
  itemId = 'temp', // Use a temp ID for new items
  onUploadComplete,
  existingImages = [],
  onExistingImageDelete
}: ImageUploaderProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setAuthChecked(true);
    };
    
    checkAuth();
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const invalidFiles: { name: string; reason: string }[] = [];

    const validFiles = files.filter(file => {
      const isValidType = ALLOWED_TYPES.includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

      if (!isValidType) {
        invalidFiles.push({ name: file.name, reason: 'Invalid file type' });
        return false;
      }
      if (!isValidSize) {
        invalidFiles.push({ name: file.name, reason: `Exceeds ${MAX_FILE_SIZE_MB}MB` });
        return false;
      }

      return true;
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Some files couldn't be added",
        description: (
          <ul className="list-disc pl-4 mt-2 text-sm">
            {invalidFiles.map((file, i) => (
              <li key={i}>
                {file.name}: {file.reason}
              </li>
            ))}
          </ul>
        ),
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate initial progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      // Upload the files
      const urls = await uploadItemImages(selectedFiles, userId, itemId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (urls.length > 0) {
        onUploadComplete(urls);
        
        // Clean up preview URLs to avoid memory leaks
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        
        setPreviewUrls([]);
        setSelectedFiles([]);
        
        toast({
          title: "Upload complete",
          description: `Successfully uploaded ${urls.length} image${urls.length === 1 ? '' : 's'}`,
        });
      } else {
        throw new Error('No images were uploaded successfully');
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your images. Please try again.",
        variant: "destructive"
      });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemovePreview = (index: number) => {
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExisting = async (url: string) => {
    if (!onExistingImageDelete) return;
    
    try {
      await deleteImageFromStorage(url);
      onExistingImageDelete(url);
      
      toast({
        title: "Image deleted",
        description: "The image was successfully removed",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting the image. Please try again.",
        variant: "destructive"
      });
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Auth warning */}
      {authChecked && !isAuthenticated && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in to upload images. Please sign in first.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F7996E] transition-colors">
        <input
          type="file"
          id="images"
          accept="image/jpeg,image/jpg,image/png"
          multiple
          onChange={handleSelect}
          className="sr-only"
          disabled={!isAuthenticated || isUploading}
        />
        <label
          htmlFor="images"
          className={`flex flex-col items-center justify-center h-32 ${!isAuthenticated ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <ImagePlus className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500 font-medium font-poppins">
            Drag photos here or click to upload
          </span>
          <span className="text-xs text-gray-400 mt-1 font-poppins">
            JPG, JPEG, PNG (max {MAX_FILE_SIZE_MB}MB per image)
          </span>
        </label>
      </div>

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-poppins">
            {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
          </span>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !isAuthenticated}
            className="bg-[#F7996E] hover:bg-[#e8895f] text-white"
          >
            {isUploading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span> Uploading...
              </span>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      )}

      {/* Preview Area */}
      {(previewUrls.length > 0 || existingImages.length > 0) && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 font-poppins">
            {existingImages.length > 0 ? 'Existing & New Images' : 'Preview'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Show existing images first */}
            {existingImages.map((url, index) => (
              <div
                key={`existing-${index}`}
                className="relative group aspect-square rounded-md overflow-hidden border border-gray-200"
              >
                <img
                  src={url}
                  alt={`Existing image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f0f0f0/999999?text=Error';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-full p-2"
                    onClick={() => handleDeleteExisting(url)}
                    disabled={isUploading || !isAuthenticated}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Show preview images */}
            {previewUrls.map((url, index) => (
              <div
                key={`preview-${index}`}
                className="relative group aspect-square rounded-md overflow-hidden border border-gray-200"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-full p-2"
                    onClick={() => handleRemovePreview(index)}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 font-poppins">Uploading...</span>
            <span className="text-sm text-gray-500 font-poppins">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
