import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Phone, User, Tag, Package, Percent } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductDetail } from "@/hooks/useProducts";
import { formatDistanceToNow } from "date-fns";

const conditionLabels: Record<string, string> = {
  new: "Brand New",
  "like-new": "Like New",
  good: "Good Condition",
  fair: "Fair Condition",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProductDetail(id!);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-square rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8 flex flex-col items-center justify-center">
          <p className="text-lg text-muted-foreground mb-4">Product not found</p>
          <Link to="/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted"
            >
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {discountPercent && (
                <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-lg px-3 py-1">
                  <Percent className="w-4 h-4 mr-1" />
                  {discountPercent}% OFF
                </Badge>
              )}
              {product.condition && (
                <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground">
                  {conditionLabels[product.condition] || product.condition}
                </Badge>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Title & Price */}
              <div>
                {product.category_name && (
                  <Badge variant="secondary" className="mb-2">
                    <Tag className="w-3 h-3 mr-1" />
                    {product.category_name}
                  </Badge>
                )}
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {product.title}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-semibold text-foreground mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || "No description provided."}
                </p>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4">
                {product.condition && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{conditionLabels[product.condition] || product.condition}</span>
                  </div>
                )}
                {product.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Posted {formatDistanceToNow(new Date(product.created_at))} ago</span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="border-t border-border pt-6">
                <h2 className="font-semibold text-foreground mb-4">Seller Information</h2>
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {product.owner_avatar ? (
                        <img
                          src={product.owner_avatar}
                          alt={product.owner_name || "Seller"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {product.owner_name || "Anonymous Seller"}
                      </p>
                      {product.owner_verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  {product.owner_phone && (
                    <div className="flex items-center gap-2 text-foreground bg-secondary/50 rounded-lg p-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="font-medium">{product.owner_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Button */}
              {product.owner_phone && (
                <a href={`tel:${product.owner_phone}`} className="block">
                  <Button variant="hero" className="w-full gap-2" size="lg">
                    <Phone className="w-5 h-5" />
                    Contact Seller
                  </Button>
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
