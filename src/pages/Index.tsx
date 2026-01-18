import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShoppingBag, 
  Briefcase, 
  MessageSquare, 
  Shield, 
  Zap, 
  Users,
  Laptop,
  BookOpen,
  Sofa,
  Shirt,
  Filter,
  Search
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/cards/ProductCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import heroBg from "@/assets/hero-bg.jpg";

const budgetFilters = [
  { label: "Free", value: 0, color: "bg-green-500" },
  { label: "<₹100", value: 100, color: "bg-blue-500" },
  { label: "<₹500", value: 500, color: "bg-purple-500" },
  { label: "<₹1000", value: 1000, color: "bg-orange-500" },
];

const featuredProducts = [
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
];

const featuredServices = [
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
];

const categories = [
  { name: "Electronics", icon: Laptop, count: 234 },
  { name: "Books", icon: BookOpen, count: 567 },
  { name: "Furniture", icon: Sofa, count: 123 },
  { name: "Clothing", icon: Shirt, count: 89 },
];

const stats = [
  { label: "Active Listings", value: "2,500+" },
  { label: "Happy Users", value: "5,000+" },
  { label: "Transactions", value: "10,000+" },
  { label: "5-Star Reviews", value: "1,200+" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/40" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium mb-6">
                🎓 Trusted by 5,000+ students
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight">
                Your Campus{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-info">
                  Marketplace
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-background/80 leading-relaxed"
            >
              Buy, sell, and discover everything you need on campus. From textbooks to electronics, services to tutoring — all in one place.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-3"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for products, services, or requests..."
                  className="pl-12 h-14 bg-background/95 border-0 text-base rounded-xl shadow-lg"
                />
              </div>
              <Button variant="hero" size="lg" className="h-14 px-8">
                Search
              </Button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/products">
                <Button variant="glass" size="sm" className="gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Browse Products
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="glass" size="sm" className="gap-2">
                  <Briefcase className="w-4 h-4" />
                  Find Services
                </Button>
              </Link>
              <Link to="/demand">
                <Button variant="glass" size="sm" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Demand Board
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/50 text-right"
            >
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Shop by Budget Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-primary text-2xl">↘</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Shop by Budget</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {budgetFilters.map((budget, index) => (
              <motion.div
                key={budget.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/products?maxPrice=${budget.value}`}>
                  <div className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg text-center card-hover">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${budget.color} flex items-center justify-center`}>
                      <Filter className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{budget.label}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Popular Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the most popular categories on our marketplace
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={`/products?category=${category.name.toLowerCase()}`}>
                  <div className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg text-center card-hover">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <category.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} items</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Hand-picked items from verified sellers
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Top Services
              </h2>
              <p className="text-muted-foreground">
                Expert services from talented students
              </p>
            </div>
            <Link to="/services">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose Brainware?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built by students, for students. We understand your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Users",
                description: "All users are verified campus members, ensuring safe and trusted transactions.",
              },
              {
                icon: Zap,
                title: "Instant Connect",
                description: "Message sellers directly or share to WhatsApp for quick communication.",
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "A thriving marketplace built and moderated by your fellow students.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-lg">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-hero" />
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to Start Selling?
                </h2>
                <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                  List your items in minutes and reach thousands of potential buyers on campus.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/create">
                    <Button size="xl" variant="accent">
                      Post Your First Listing
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="xl" variant="glass">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
