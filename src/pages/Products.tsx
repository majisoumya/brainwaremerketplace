import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Grid, List, X, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/cards/ProductCard";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useProducts } from "@/hooks/useProducts";
import { formatDistanceToNow } from "date-fns";

const categories = ["All", "Electronics", "Books", "Furniture", "Clothing", "Sports"];
const conditions = ["new", "like-new", "good", "fair"];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: products, isLoading } = useProducts();

  const filteredProducts = (products ?? []).filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category_name === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCondition = selectedConditions.length === 0 || (product.condition && selectedConditions.includes(product.condition));
    return matchesSearch && matchesCategory && matchesPrice && matchesCondition;
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
                selectedCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <Slider value={priceRange} onValueChange={setPriceRange} max={100000} step={1000} className="mb-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Condition</h4>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label key={condition} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedConditions.includes(condition)}
                onCheckedChange={(checked) => {
                  if (checked) setSelectedConditions([...selectedConditions, condition]);
                  else setSelectedConditions(selectedConditions.filter((c) => c !== condition));
                }}
              />
              <span className="capitalize">{condition.replace("-", " ")}</span>
            </label>
          ))}
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={() => { setSelectedCategory("All"); setPriceRange([0, 100000]); setSelectedConditions([]); }}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Products</h1>
              <p className="text-muted-foreground mb-6">Discover amazing deals from verified sellers on campus</p>
              <div className="flex gap-3 max-w-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 bg-background" />
                </div>
                <Sheet>
                  <SheetTrigger asChild><Button variant="outline" size="lg" className="lg:hidden gap-2"><Filter className="w-4 h-4" />Filters</Button></SheetTrigger>
                  <SheetContent side="left"><SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader><div className="mt-6"><FilterContent /></div></SheetContent>
                </Sheet>
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
                <p className="text-muted-foreground">{filteredProducts.length} products found</p>
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-40"><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent><SelectItem value="newest">Newest First</SelectItem><SelectItem value="price-low">Price: Low to High</SelectItem><SelectItem value="price-high">Price: High to Low</SelectItem></SelectContent></Select>
                </div>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      image={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
                      category={product.category_name || "Other"}
                      condition={product.condition || "good"}
                      location={product.location || "Campus"}
                      postedAt={formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20"><p className="text-muted-foreground text-lg">No products found</p><p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
