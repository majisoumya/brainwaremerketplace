import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  category: string;
  condition?: "new" | "like-new" | "good" | "fair";
  location?: string;
  postedAt?: string;
  isFavorite?: boolean;
}

const conditionColors = {
  new: "bg-success text-success-foreground",
  "like-new": "bg-info text-info-foreground",
  good: "bg-warning text-warning-foreground",
  fair: "bg-muted text-muted-foreground",
};

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  category,
  condition,
  location,
  postedAt,
  isFavorite = false,
}: ProductCardProps) {
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/products/${id}`}>
        <div className="group bg-card rounded-xl border border-border overflow-hidden card-hover">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Discount Badge */}
            {discountPercent && (
              <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground font-bold">
                <Percent className="w-3 h-3 mr-1" />
                {discountPercent}% OFF
              </Badge>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                // Toggle favorite
              }}
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-200 hover:scale-110",
                isFavorite ? "text-destructive" : "text-muted-foreground hover:text-destructive"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </button>
            {condition && (
              <Badge
                className={cn(
                  "absolute bottom-3 left-3 capitalize",
                  conditionColors[condition]
                )}
              >
                {condition.replace("-", " ")}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {category}
              </p>
              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {title}
              </h3>
            </div>

            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-primary">
                ₹{price.toLocaleString()}
              </p>
              {originalPrice && originalPrice > price && (
                <p className="text-sm text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {location}
                </div>
              )}
              {postedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {postedAt}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
