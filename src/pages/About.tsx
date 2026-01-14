import { motion } from "framer-motion";
import { Shield, Zap, Users, Heart, Target, Award } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "All users are verified campus members. We prioritize your safety in every transaction.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Built by students, for students. We understand your needs and challenges.",
  },
  {
    icon: Zap,
    title: "Simplicity",
    description: "List in minutes, connect instantly. No complicated processes or hidden fees.",
  },
  {
    icon: Heart,
    title: "Sustainability",
    description: "Give items a second life. Reduce waste and save money through reuse.",
  },
];

const stats = [
  { value: "5,000+", label: "Active Users" },
  { value: "10,000+", label: "Transactions" },
  { value: "2,500+", label: "Listings" },
  { value: "4.8★", label: "User Rating" },
];

const team = [
  {
    name: "Rohit Sharma",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
  },
  {
    name: "Priya Patel",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
  },
  {
    name: "Amit Kumar",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
  },
  {
    name: "Sneha Reddy",
    role: "Community Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Building the Future of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-info">
                Campus Commerce
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Brainware Marketplace is the trusted platform for campus communities to buy, sell, 
              and connect. We're on a mission to make student life easier and more sustainable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Brainware Marketplace was born from a simple observation: students constantly 
                  buy and sell items on campus, but the process was fragmented and often unsafe.
                </p>
                <p>
                  In 2023, a group of students at Brainware University decided to change that. 
                  We built a platform specifically designed for campus communities—verified users, 
                  easy listings, and safe transactions.
                </p>
                <p>
                  Today, we serve thousands of students across multiple campuses, helping them 
                  save money, reduce waste, and build connections within their community.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-info/20">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
                  alt="Team collaboration"
                  className="w-full h-full object-cover mix-blend-overlay"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-3xl -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-info/10 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Brainware Marketplace
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
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
                <Target className="w-12 h-12 mx-auto mb-6 text-primary-foreground" />
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                  To create a trusted, sustainable, and vibrant marketplace that empowers 
                  campus communities to connect, trade, and thrive together.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
