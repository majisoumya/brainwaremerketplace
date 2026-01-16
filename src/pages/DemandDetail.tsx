import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Phone, User, Tag, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemandDetail } from "@/hooks/useDemands";
import { formatDistanceToNow } from "date-fns";

export default function DemandDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: demand, isLoading, error } = useDemandDetail(id!);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 max-w-3xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !demand) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8 flex flex-col items-center justify-center">
          <p className="text-lg text-muted-foreground mb-4">Request not found</p>
          <Link to="/demand">
            <Button variant="outline">Back to Demand Board</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Button */}
          <Link
            to="/demand"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Demand Board
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {demand.category_name && (
                  <Badge variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {demand.category_name}
                  </Badge>
                )}
                <Badge className="bg-warning text-warning-foreground">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Open Request
                </Badge>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                {demand.title}
              </h1>
              {demand.budget && (
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="text-2xl font-bold text-primary">₹{demand.budget}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold text-foreground mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {demand.description || "No description provided."}
              </p>
            </div>

            {/* Request Info */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Posted {formatDistanceToNow(new Date(demand.created_at))} ago</span>
            </div>

            {/* Requester Info */}
            <div className="border-t border-border pt-6">
              <h2 className="font-semibold text-foreground mb-4">Posted By</h2>
              <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {demand.owner_avatar ? (
                      <img
                        src={demand.owner_avatar}
                        alt={demand.owner_name || "Requester"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {demand.owner_name || "Anonymous User"}
                    </p>
                    {demand.owner_verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                {demand.owner_phone && (
                  <div className="flex items-center gap-2 text-foreground bg-card rounded-lg p-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="font-medium">{demand.owner_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Button */}
            {demand.owner_phone && (
              <a href={`tel:${demand.owner_phone}`} className="block">
                <Button variant="hero" className="w-full gap-2" size="lg">
                  <Phone className="w-5 h-5" />
                  Contact Requester
                </Button>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
