import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  provider: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
  };
}

export function ServiceCard({
  id,
  title,
  description,
  price,
  image,
  category,
  provider,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/services/${id}`}>
        <div className="group bg-card rounded-xl border border-border overflow-hidden card-hover">
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              {category}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>

            {/* Provider */}
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{provider.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span>{provider.rating}</span>
                  <span>({provider.reviews})</span>
                </div>
              </div>
              <p className="font-bold text-primary">{price}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
