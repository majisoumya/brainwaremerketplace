import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DemandCardProps {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  urgency: "low" | "medium" | "high";
  postedBy: {
    name: string;
    avatar: string;
  };
  postedAt: string;
  responses: number;
}

const urgencyStyles = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

export function DemandCard({
  id,
  title,
  description,
  budget,
  category,
  urgency,
  postedBy,
  postedAt,
  responses,
}: DemandCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="group bg-card rounded-xl border border-border p-5 card-hover">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
              <Badge className={urgencyStyles[urgency]}>
                {urgency} priority
              </Badge>
            </div>
            <Link to={`/demand/${id}`}>
              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {title}
              </h3>
            </Link>
          </div>
          <p className="font-bold text-lg text-primary whitespace-nowrap">
            {budget}
          </p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-muted overflow-hidden">
              <img
                src={postedBy.avatar}
                alt={postedBy.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs">
              <p className="font-medium">{postedBy.name}</p>
              <p className="text-muted-foreground">{postedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="w-3 h-3" />
              {responses} offers
            </span>
            <Button size="sm" variant="hero">
              Respond
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
