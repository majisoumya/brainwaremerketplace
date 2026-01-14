import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useServices } from "@/hooks/useServices";

const categories = ["All", "Tutoring", "Tech", "Design", "Creative", "Career"];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const { data: services, isLoading } = useServices();

  const filteredServices = (services ?? []).filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || (service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "All" || service.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{cat}</button>
          ))}
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={() => setSelectedCategory("All")}>Clear Filters</Button>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Services</h1>
              <p className="text-muted-foreground mb-6">Find talented students offering expert services</p>
              <div className="flex gap-3 max-w-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 bg-background" />
                </div>
                <Sheet><SheetTrigger asChild><Button variant="outline" size="lg" className="lg:hidden gap-2"><Filter className="w-4 h-4" />Filters</Button></SheetTrigger><SheetContent side="left"><SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader><div className="mt-6"><FilterContent /></div></SheetContent></Sheet>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2"><SlidersHorizontal className="w-5 h-5" />Filters</h3>
                <FilterContent />
              </div>
            </aside>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">{filteredServices.length} services available</p>
                <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-40"><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent><SelectItem value="rating">Top Rated</SelectItem><SelectItem value="newest">Newest First</SelectItem></SelectContent></Select>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id} id={service.id} title={service.title} description={service.description || ""} price={service.price} image={service.image_url || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400"} category={service.category_name || "Other"} provider={{ name: service.owner_name || "Provider", avatar: service.owner_avatar || "", rating: 4.8, reviews: 0 }} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20"><p className="text-muted-foreground text-lg">No services found</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
