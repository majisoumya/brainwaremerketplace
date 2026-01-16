import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  X, 
  ImagePlus, 
  ShoppingBag, 
  Briefcase,
  MessageSquare,
  Sparkles,
  Loader2
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import { useCreateService } from "@/hooks/useServices";
import { useCreateDemand } from "@/hooks/useDemands";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";

type ListingType = "product" | "service" | "demand";

const listingTypes = [
  { id: "product" as const, label: "Product", icon: ShoppingBag, description: "Sell an item" },
  { id: "service" as const, label: "Service", icon: Briefcase, description: "Offer a service" },
  { id: "demand" as const, label: "Request", icon: MessageSquare, description: "Post a request" },
];

const conditions = ["new", "like-new", "good", "fair"];

export default function CreateListing() {
  const [listingType, setListingType] = useState<ListingType>("product");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const { data: categories } = useCategories(listingType);
  const createProduct = useCreateProduct();
  const createService = useCreateService();
  const createDemand = useCreateDemand();
  const { uploadImage, uploading } = useImageUpload();
  
  const isSubmitting = createProduct.isPending || createService.isPending || createDemand.isPending || uploading;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImages([...images, ...newFiles].slice(0, 5));
      setImagePreviews([...imagePreviews, ...newPreviews].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to create a listing");
      navigate("/auth");
      return;
    }
    
    try {
      let imageUrl: string | undefined;
      
      // Upload first image if exists
      if (images.length > 0) {
        imageUrl = (await uploadImage(images[0])) ?? undefined;
      }
      
      if (listingType === "product") {
        await createProduct.mutateAsync({
          title,
          description,
          price: parseFloat(price) || 0,
          original_price: originalPrice ? parseFloat(originalPrice) : undefined,
          condition: condition as "new" | "like-new" | "good" | "fair",
          image_url: imageUrl,
          location,
          category_id: categoryId || undefined,
        });
      } else if (listingType === "service") {
        await createService.mutateAsync({
          title,
          description,
          price,
          image_url: imageUrl,
          location,
          category_id: categoryId || undefined,
        });
      } else {
        await createDemand.mutateAsync({
          title,
          description,
          budget: price,
          category_id: categoryId || undefined,
        });
      }
      
      toast.success("Listing created successfully!");
      navigate(listingType === "product" ? "/products" : listingType === "service" ? "/services" : "/demand");
    } catch (error) {
      toast.error("Failed to create listing. Please try again.");
      console.error(error);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-lg text-muted-foreground">Please login to create a listing</p>
          <Link to="/auth">
            <Button variant="hero">Login / Sign Up</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-3xl font-bold mb-2">Create Listing</h1>
              <p className="text-muted-foreground">
                Fill in the details below to post your listing
              </p>
            </motion.div>
          </div>

          {/* Listing Type Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Label className="text-base mb-4 block">What are you posting?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {listingTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setListingType(type.id);
                    setCategoryId("");
                  }}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
                    listingType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    listingType === type.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  )}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Images (for product/service) */}
            {listingType !== "demand" && (
              <div className="space-y-4">
                <Label className="text-base">Photos</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {imagePreviews.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <ImagePlus className="w-6 h-6" />
                      <span className="text-xs">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Add up to 5 photos. First photo will be the cover.
                </p>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">
                {listingType === "demand" ? "What are you looking for?" : "Title"}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  listingType === "product"
                    ? "e.g., MacBook Pro 2021 - Excellent Condition"
                    : listingType === "service"
                    ? "e.g., Python & Data Science Tutoring"
                    : "e.g., Looking for second-hand MacBook Air"
                }
                className="h-12"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-base">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition (product only) */}
            {listingType === "product" && (
              <div className="space-y-2">
                <Label className="text-base">Condition</Label>
                <Select value={condition} onValueChange={setCondition} required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((cond) => (
                      <SelectItem key={cond} value={cond}>
                        {cond.charAt(0).toUpperCase() + cond.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-4">
              <Label className="text-base">
                {listingType === "demand" ? "Budget" : "Pricing"}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm text-muted-foreground">
                    {listingType === "product" ? "Selling Price (₹) *" : listingType === "demand" ? "Budget (₹)" : "Price"}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="price"
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={listingType === "service" ? "500/hr or 5000+" : "e.g., 25000"}
                      className="pl-8 h-12"
                      required
                    />
                  </div>
                </div>
                {listingType === "product" && (
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice" className="text-sm text-muted-foreground">
                      Original Price (₹)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="originalPrice"
                        type="text"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="e.g., 70000"
                        className="pl-8 h-12"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">For discount calculation & buyer reference</p>
                  </div>
                )}
              </div>
              {listingType === "product" && price && originalPrice && parseFloat(originalPrice) > parseFloat(price) && (
                <div className="bg-success/10 text-success border border-success/20 rounded-lg p-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)}% discount will be shown to buyers
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your listing in detail..."
                rows={5}
                required
              />
            </div>

            {/* Location (for product/service) */}
            {listingType !== "demand" && (
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Block A, Hostel 3, Library"
                  className="h-12"
                />
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1" asChild>
                <Link to="/">Cancel</Link>
              </Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Listing"
                )}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </Layout>
  );
}
