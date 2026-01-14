import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "@/components/cards/ServiceCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const allServices = [
  {
    id: "1",
    title: "Python & Data Science Tutoring",
    description: "Learn Python programming and data science from an experienced senior. Includes assignments and projects.",
    price: "₹500/hr",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
    category: "Tutoring",
    provider: {
      name: "Rahul K.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: 4.9,
      reviews: 23,
    },
  },
  {
    id: "2",
    title: "Graphic Design & Logo Creation",
    description: "Professional logo design, posters, and social media graphics for your events and startups.",
    price: "₹1000+",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
    category: "Design",
    provider: {
      name: "Priya S.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      rating: 4.8,
      reviews: 45,
    },
  },
  {
    id: "3",
    title: "Web Development Services",
    description: "Full-stack web development for portfolios, landing pages, and small business websites.",
    price: "₹5000+",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400",
    category: "Tech",
    provider: {
      name: "Amit R.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      rating: 5.0,
      reviews: 12,
    },
  },
  {
    id: "4",
    title: "Mathematics Tutoring (All Levels)",
    description: "Expert math tutoring for school, JEE, and university level. Focus on concepts and problem solving.",
    price: "₹400/hr",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    category: "Tutoring",
    provider: {
      name: "Neha M.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      rating: 4.7,
      reviews: 67,
    },
  },
  {
    id: "5",
    title: "Photography & Videography",
    description: "Professional event coverage, portraits, and video editing for college events and personal shoots.",
    price: "₹2000+",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    category: "Creative",
    provider: {
      name: "Vikram J.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      rating: 4.9,
      reviews: 34,
    },
  },
  {
    id: "6",
    title: "Resume & LinkedIn Optimization",
    description: "Get your resume and LinkedIn profile ready for placements. Includes review and suggestions.",
    price: "₹500",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400",
    category: "Career",
    provider: {
      name: "Shreya P.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      rating: 4.8,
      reviews: 89,
    },
  },
];

const categories = ["All", "Tutoring", "Tech", "Design", "Creative", "Career"];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const filteredServices = allServices.filter((service) => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setSelectedCategory("All")}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Services
              </h1>
              <p className="text-muted-foreground mb-6">
                Find talented students offering expert services
              </p>

              {/* Search Bar */}
              <div className="flex gap-3 max-w-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-background"
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="lg" className="lg:hidden gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h3>
                <FilterContent />
              </div>
            </aside>

            {/* Services Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {filteredServices.length} services available
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Services */}
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id} {...service} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No services found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
