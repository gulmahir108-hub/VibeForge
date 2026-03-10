"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  File, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  DollarSign,
  Package,
  Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";

// Generate unique file name
const generateUniqueFileName = (file: File) => {
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  return `${timestamp}_${file.name.replace(/\.[^/.]+$/, '')}.${fileExtension}`;
};

const categories = [
  "n8n Workflows",
  "AI Agents", 
  "Prompt Templates",
  "Game Scripts"
];

const supportedFileTypes = [".zip", ".json", ".js", ".py", ".txt", ".md"];
const maxFileSize = 50 * 1024 * 1024; // 50MB

export default function SellPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    tags: [] as string[]
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [insertedProduct, setInsertedProduct] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const { user } = useAuth();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newErrors: Record<string, string> = {};
    
    files.forEach(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!supportedFileTypes.includes(fileExtension)) {
        newErrors.file = `Unsupported file type: ${fileExtension}. Supported types: ${supportedFileTypes.join(', ')}`;
        return;
      }
      
      if (file.size > maxFileSize) {
        newErrors.file = `File ${file.name} is too large. Maximum size is 50MB.`;
        return;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setUploadedFiles(prev => [...prev, ...files]);
    setErrors({});
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (uploadedFiles.length === 0) {
      newErrors.file = "Please upload at least one file";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (uploadedFiles.length === 0) {
      setErrors({ ...errors, file: "Please upload at least one file" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let fileUrl = '';
      
      // Upload file to Supabase storage if present
      if (uploadedFiles.length > 0) {
        const file = uploadedFiles[0];
        const fileName = generateUniqueFileName(file);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assets')
          .upload(fileName, file);
        
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          alert('Error uploading file. Please try again.');
          return;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(fileName);
        
        fileUrl = publicUrl || '';
        console.log('File uploaded successfully:', fileName, 'Public URL:', publicUrl);
      }
      
      // Insert product data into Supabase products table
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          file_url: fileUrl,
          user_id: user?.id
        })
        .select();
      
      if (error) {
        console.error('Error uploading product:', error);
        alert('Error uploading product. Please try again.');
      } else {
        console.log('Product uploaded successfully:', data);
        setInsertedProduct(data?.[0]);
        setSubmitSuccess(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          setInsertedProduct(null);
          setFormData({
            title: "",
            description: "",
            price: "",
            category: "",
            tags: []
          });
          setUploadedFiles([]);
          setTagInput("");
        }, 3000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Product Listed Successfully!</h2>
            <p className="text-muted-foreground mb-4">
              Your digital asset "{formData.title}" has been listed for ${formData.price} USD and is now available on the marketplace.
            </p>
            {fileUrl && (
              <p className="text-sm text-muted-foreground mb-4">
                File URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">{fileUrl}</a>
              </p>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              Product ID: {insertedProduct?.id}
            </p>
            <Button 
              onClick={() => window.location.href = "/explore"}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              View Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-400 mr-2" />
              <h1 className="text-3xl font-bold text-foreground">Sell Your Digital Asset</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Share your creations with the vibe coder community and start earning today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-400" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a catchy title for your digital asset"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your digital asset in detail. What does it do? Who is it for? What problem does it solve?"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-muted-foreground">
                      Minimum 50 characters
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.description.length}/500
                    </p>
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      id="tags"
                      placeholder="Add tags (press Enter)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-purple-400" />
                  File Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? "border-purple-500 bg-purple-500/10" 
                      : "border-border hover:border-purple-500/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-2">
                      Drag and drop your files here
                    </p>
                    <p className="text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      accept={supportedFileTypes.join(',')}
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Supported formats: {supportedFileTypes.join(', ')} (Max 50MB)
                    </p>
                  </div>
                </div>

                {errors.file && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-500">{errors.file}</p>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-foreground mb-3">Uploaded Files</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-400" />
                  Preview Image (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors border-border hover:border-purple-500/50 cursor-pointer`}
                >
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mb-3">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-2">
                      Upload preview image
                    </p>
                    <p className="text-muted-foreground text-sm mb-3">
                      Recommended: 1200x800px, JPG or PNG
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Submit for Review
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
