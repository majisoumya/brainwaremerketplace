import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, Filter } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemandCard } from "@/components/cards/DemandCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const demandPosts = [
  {
    id: "1",
    title: "Looking for second-hand MacBook Air",
    description: "Need a MacBook Air M1 or later in good condition for coding and design work. Budget is flexible for good condition.",
    budget: "₹50,000-70,000",
    category: "Electronics",
    urgency: "medium" as const,
    postedBy: {
      name: "Arun S.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    postedAt: "2 hours ago",
    responses: 5,
  },
  {
    id: "2",
    title: "Need GATE CSE preparation books",
    description: "Looking for previous year papers and standard GATE preparation material. Prefer Made Easy or similar.",
    budget: "₹1,500-2,000",
    category: "Books",
    urgency: "high" as const,
    postedBy: {
      name: "Priya M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    postedAt: "5 hours ago",
    responses: 8,
  },
  {
    id: "3",
    title: "Seeking Python tutor for project help",
    description: "Working on a machine learning project and need guidance. Looking for 2-3 sessions per week for a month.",
    budget: "₹400-500/hr",
    category: "Services",
    urgency: "medium" as const,
    postedBy: {
      name: "Karthik R.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    },
    postedAt: "1 day ago",
    responses: 12,
  },
  {
    id: "4",
    title: "Study table and chair needed",
    description: "Moving to a new hostel room and need a decent study table with comfortable chair. Preferably wooden.",
    budget: "₹2,500-4,000",
    category: "Furniture",
    urgency: "low" as const,
    postedBy: {
      name: "Sneha K.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    postedAt: "2 days ago",
    responses: 3,
  },
  {
    id: "5",
    title: "Photographer needed for birthday event",
    description: "Planning a surprise birthday party next weekend. Need someone for 3-4 hours of photography and basic editing.",
    budget: "₹2,000-3,000",
    category: "Services",
    urgency: "high" as const,
    postedBy: {
      name: "Rahul J.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    },
    postedAt: "6 hours ago",
    responses: 7,
  },
  {
    id: "6",
    title: "Looking for gaming keyboard",
    description: "Need a mechanical gaming keyboard, preferably RGB with blue or brown switches. Brand new or gently used.",
    budget: "₹3,000-5,000",
    category: "Electronics",
    urgency: "low" as const,
    postedBy: {
      name: "Vikram P.",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100",
    },
    postedAt: "3 days ago",
    responses: 2,
  },
];

const categories = ["All", "Electronics", "Books", "Furniture", "Services", "Clothing"];

export default function Demand() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filteredPosts = demandPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-info/5 to-background py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                    Demand Board
                  </h1>
                  <p className="text-muted-foreground">
                    Post what you need, let sellers come to you
                  </p>
                </div>
                <Link to="/create?type=demand">
                  <Button variant="hero" size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Post a Request
                  </Button>
                </Link>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-background"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-44 h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-44 h-12">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="responses">Most Responses</SelectItem>
                    <SelectItem value="urgent">Most Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Demand Posts */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {filteredPosts.length} active requests
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <DemandCard key={post.id} {...post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No requests found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
