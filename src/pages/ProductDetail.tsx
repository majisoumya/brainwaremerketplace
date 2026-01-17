import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Phone, User, Tag, Package, Percent, MessageCircle, Share2, Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductDetail, useSimilarProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/cards/ProductCard";
import { formatDistanceToNow, format } from "date-fns";

const conditionLabels: Record<string, string> = {
  new: "Brand New",
  "like-new": "Like New",
  good: "Good Condition",
  fair: "Fair Condition",
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProductDetail(id!);
  const { data: similarProducts } = useSimilarProducts(product?.category_id || null, id!);

  const handleWhatsAppClick = () => {
    if (!product || !product.owner_whatsapp) return;
    
    const message = encodeURIComponent(
      `Hi! I'm interested in your product:\n\n*${product.title}*\nPrice: ₹${product.price.toLocaleString()}${product.original_price ? ` (Original: ₹${product.original_price.toLocaleString()})` : ''}\n\nIs this still available?`
    );
    const whatsappUrl = `https://wa.me/${product.owner_whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneClick = () => {
    if (!product || !product.owner_phone) return;
    window.location.href = `tel:${product.owner_phone}`;
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.title,
      text: `Check out this product: ${product.title} - ₹${product.price.toLocaleString()}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid lg:grid-cols-2 gap-8">
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
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header with Back & Share */}
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <Button variant="default" size="sm" className="gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Section */}
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
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.category_name && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {product.category_name.toUpperCase()}
                  </Badge>
                )}
                {product.condition && (
                  <Badge variant="outline" className="border-border">
                    {conditionLabels[product.condition] || product.condition}
                  </Badge>
                )}
                {discountPercent && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    {discountPercent}% OFF
                  </Badge>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-primary mb-3">
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

              {/* Description Card */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h2 className="font-semibold text-foreground mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || "No description provided."}
                </p>
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {product.condition && (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Condition</p>
                    <p className="font-semibold text-foreground">
                      {conditionLabels[product.condition] || product.condition}
                    </p>
                  </div>
                )}
                {product.location && (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">{product.location}</span>
                    </div>
                  </div>
                )}
                <div className="bg-card border border-border rounded-xl p-4 col-span-2 sm:col-span-1">
                  <p className="text-xs text-muted-foreground mb-1">Age</p>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      {formatDistanceToNow(new Date(product.created_at))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Info Card */}
              <div className="bg-card border border-border rounded-xl p-4 space-y-4">
                <h2 className="font-semibold text-foreground">Seller Information</h2>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
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
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      {product.owner_name || "Anonymous Seller"}
                      {product.owner_verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Listed on {format(new Date(product.created_at), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {product.owner_whatsapp && (
                    <Button
                      onClick={handleWhatsAppClick}
                      className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Seller
                    </Button>
                  )}
                  {product.owner_phone && (
                    <Button
                      variant="outline"
                      onClick={handlePhoneClick}
                      className="gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {product.owner_phone}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Similar Products Section */}
          {similarProducts && similarProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Similar Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard
                    key={similarProduct.id}
                    id={similarProduct.id}
                    title={similarProduct.title}
                    price={similarProduct.price}
                    originalPrice={similarProduct.original_price || undefined}
                    image={similarProduct.image_url || "/placeholder.svg"}
                    category={similarProduct.category_name || "Other"}
                    condition={similarProduct.condition || undefined}
                    location={similarProduct.location || undefined}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </Layout>
  );
}