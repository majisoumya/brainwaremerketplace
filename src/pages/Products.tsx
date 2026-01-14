import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Grid, List, X } from "lucide-react";
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

const allProducts = [
  {
    id: "1",
    title: "MacBook Pro 2021 - Excellent Condition",
    price: 85000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    category: "Electronics",
    condition: "like-new" as const,
    location: "Block A",
    postedAt: "2h ago",
  },
  {
    id: "2",
    title: "Engineering Mathematics Books Bundle",
    price: 1500,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    category: "Books",
    condition: "good" as const,
    location: "Library",
    postedAt: "5h ago",
  },
  {
    id: "3",
    title: "Study Table with Chair - Sturdy",
    price: 3500,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400",
    category: "Furniture",
    condition: "good" as const,
    location: "Hostel 3",
    postedAt: "1d ago",
  },
  {
    id: "4",
    title: "Sony WH-1000XM4 Headphones",
    price: 18000,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    category: "Electronics",
    condition: "new" as const,
    location: "Campus",
    postedAt: "3h ago",
  },
  {
    id: "5",
    title: "iPhone 13 Pro - 256GB",
    price: 65000,
    image: "https://images.unsplash.com/photo-1632661674596-df8be59a3b64?w=400",
    category: "Electronics",
    condition: "like-new" as const,
    location: "Block B",
    postedAt: "6h ago",
  },
  {
    id: "6",
    title: "GATE Preparation Books Set",
    price: 2500,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
    category: "Books",
    condition: "good" as const,
    location: "Hostel 1",
    postedAt: "2d ago",
  },
  {
    id: "7",
    title: "Gaming Chair - Ergonomic",
    price: 12000,
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400",
    category: "Furniture",
    condition: "new" as const,
    location: "Block C",
    postedAt: "4h ago",
  },
  {
    id: "8",
    title: "Dell XPS 15 Laptop",
    price: 95000,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
    category: "Electronics",
    condition: "like-new" as const,
    location: "Campus",
    postedAt: "1d ago",
  },
];

const categories = ["All", "Electronics", "Books", "Furniture", "Clothing", "Sports"];
const conditions = ["new", "like-new", "good", "fair"];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition);
    return matchesSearch && matchesCategory && matchesPrice && matchesCondition;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
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

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={100000}
          step={1000}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Condition */}
      <div>
        <h4 className="font-semibold mb-3">Condition</h4>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label
              key={condition}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedConditions.includes(condition)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedConditions([...selectedConditions, condition]);
                  } else {
                    setSelectedConditions(selectedConditions.filter((c) => c !== condition));
                  }
                }}
              />
              <span className="capitalize">{condition.replace("-", " ")}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategory("All");
          setPriceRange([0, 100000]);
          setSelectedConditions([]);
        }}
      >
        Clear All Filters
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
                Products
              </h1>
              <p className="text-muted-foreground mb-6">
                Discover amazing deals from verified sellers on campus
              </p>

              {/* Search Bar */}
              <div className="flex gap-3 max-w-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
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

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory !== "All" || selectedConditions.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategory !== "All" && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedCategory}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedCategory("All")}
                      />
                    </Badge>
                  )}
                  {selectedConditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="gap-1 capitalize">
                      {condition.replace("-", " ")}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() =>
                          setSelectedConditions(selectedConditions.filter((c) => c !== condition))
                        }
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Products */}
              {filteredProducts.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">No products found</p>
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
