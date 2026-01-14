import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemandCard } from "@/components/cards/DemandCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemands } from "@/hooks/useDemands";
import { formatDistanceToNow } from "date-fns";

const categories = ["All", "Electronics", "Books", "Furniture", "Services", "Clothing"];

export default function Demand() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const { data: demands, isLoading } = useDemands();

  const filteredPosts = (demands ?? []).filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || (post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "All" || post.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary/10 via-info/5 to-background py-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Demand Board</h1>
                  <p className="text-muted-foreground">Post what you need, let sellers come to you</p>
                </div>
                <Link to="/create?type=demand"><Button variant="hero" size="lg" className="gap-2"><Plus className="w-5 h-5" />Post a Request</Button></Link>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Search requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 bg-background" />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}><SelectTrigger className="w-full sm:w-44 h-12"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent>{categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select>
                <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-full sm:w-44 h-12"><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent><SelectItem value="newest">Newest First</SelectItem><SelectItem value="responses">Most Responses</SelectItem></SelectContent></Select>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6"><p className="text-muted-foreground">{filteredPosts.length} active requests</p></div>
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <DemandCard key={post.id} id={post.id} title={post.title} description={post.description || ""} budget={post.budget || "Flexible"} category={post.category_name || "Other"} urgency="medium" postedBy={{ name: post.owner_name || "User", avatar: post.owner_avatar || "" }} postedAt={formatDistanceToNow(new Date(post.created_at), { addSuffix: true })} responses={0} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20"><p className="text-muted-foreground text-lg">No requests found</p></div>
          )}
        </div>
      </div>
    </Layout>
  );
}
