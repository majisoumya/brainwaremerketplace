import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  ImagePlus, 
  ShoppingBag, 
  Briefcase,
  MessageSquare,
  Sparkles
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

type ListingType = "product" | "service" | "demand";

const listingTypes = [
  { id: "product" as const, label: "Product", icon: ShoppingBag, description: "Sell an item" },
  { id: "service" as const, label: "Service", icon: Briefcase, description: "Offer a service" },
  { id: "demand" as const, label: "Request", icon: MessageSquare, description: "Post a request" },
];

const productCategories = ["Electronics", "Books", "Furniture", "Clothing", "Sports", "Other"];
const serviceCategories = ["Tutoring", "Tech", "Design", "Creative", "Career", "Other"];
const conditions = ["New", "Like New", "Good", "Fair"];

export default function CreateListing() {
  const [listingType, setListingType] = useState<ListingType>("product");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
  };

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
                  onClick={() => setListingType(type.id)}
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
                  {images.map((img, index) => (
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
                  {images.length < 5 && (
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
              <Select required>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {(listingType === "service" ? serviceCategories : productCategories).map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition (product only) */}
            {listingType === "product" && (
              <div className="space-y-2">
                <Label className="text-base">Condition</Label>
                <Select required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition.toLowerCase().replace(" ", "-")}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-base">
                {listingType === "demand" ? "Budget" : "Price"}
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="price"
                  type="text"
                  placeholder={listingType === "service" ? "500/hr or 5000+" : "e.g., 25000"}
                  className="pl-8 h-12"
                  required
                />
              </div>
              {listingType === "product" && (
                <Button type="button" variant="ghost" size="sm" className="gap-2 text-primary">
                  <Sparkles className="w-4 h-4" />
                  Suggest price with AI
                </Button>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your listing in detail..."
                rows={5}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Block A, Hostel 3, Library"
                className="h-12"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1" asChild>
                <Link to="/">Cancel</Link>
              </Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Listing"}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </Layout>
  );
}
