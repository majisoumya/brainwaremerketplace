import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Phone, User, Tag, Star } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useServiceDetail } from "@/hooks/useServices";
import { formatDistanceToNow } from "date-fns";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: service, isLoading, error } = useServiceDetail(id!);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-video rounded-xl" />
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

  if (error || !service) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8 flex flex-col items-center justify-center">
          <p className="text-lg text-muted-foreground mb-4">Service not found</p>
          <Link to="/services">
            <Button variant="outline">Back to Services</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video rounded-xl overflow-hidden bg-muted"
            >
              <img
                src={service.image_url || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              {service.category_name && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {service.category_name}
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
                {service.category_name && (
                  <Badge variant="secondary" className="mb-2">
                    <Tag className="w-3 h-3 mr-1" />
                    {service.category_name}
                  </Badge>
                )}
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {service.title}
                </h1>
                <span className="text-2xl font-bold text-primary">₹{service.price}</span>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-semibold text-foreground mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description || "No description provided."}
                </p>
              </div>

              {/* Service Info */}
              <div className="flex flex-wrap gap-4">
                {service.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{service.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Posted {formatDistanceToNow(new Date(service.created_at))} ago</span>
                </div>
              </div>

              {/* Provider Info */}
              <div className="border-t border-border pt-6">
                <h2 className="font-semibold text-foreground mb-4">Service Provider</h2>
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {service.owner_avatar ? (
                        <img
                          src={service.owner_avatar}
                          alt={service.owner_name || "Provider"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {service.owner_name || "Anonymous Provider"}
                      </p>
                      <div className="flex items-center gap-2">
                        {service.owner_verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          <span>4.8 (12 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {service.owner_phone && (
                    <div className="flex items-center gap-2 text-foreground bg-secondary/50 rounded-lg p-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="font-medium">{service.owner_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Button */}
              {service.owner_phone && (
                <a href={`tel:${service.owner_phone}`} className="block">
                  <Button variant="hero" className="w-full gap-2" size="lg">
                    <Phone className="w-5 h-5" />
                    Contact Provider
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
