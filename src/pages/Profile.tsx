import { useState } from "react";
import { motion } from "framer-motion";
import { User, Camera, Phone, MessageCircle, Mail, Loader2, Package, Briefcase } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUserProducts } from "@/hooks/useProducts";
import { useUserServices } from "@/hooks/useServices";
import { ProductCard } from "@/components/cards/ProductCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const { data: userProducts, isLoading: productsLoading } = useUserProducts(user?.id);
  const { data: userServices, isLoading: servicesLoading } = useUserServices(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Redirect if not logged in
  if (!loading && !user) {
    navigate("/auth");
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated successfully.",
      });

      // Refresh the page to show new avatar
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          whatsapp: whatsapp,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile?.full_name || "Anonymous User"}
                  </h1>
                  {profile?.is_verified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
                <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                {profile?.phone && (
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Phone className="w-4 h-4" />
                    {profile.phone}
                  </p>
                )}
              </div>

              {/* Edit Button */}
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 pt-6 border-t border-border space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      WhatsApp Number
                    </Label>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Listings Tabs */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products" className="gap-2">
                <Package className="w-4 h-4" />
                My Products ({userProducts?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Briefcase className="w-4 h-4" />
                My Services ({userServices?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : userProducts && userProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.original_price || undefined}
                      image={product.image_url || "/placeholder.svg"}
                      category={product.category_name || "Other"}
                      condition={product.condition || undefined}
                      location={product.location || undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You haven't listed any products yet.</p>
                  <Button className="mt-4" onClick={() => navigate("/create")}>
                    Create Listing
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              {servicesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : userServices && userServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      title={service.title}
                      description={service.description || undefined}
                      price={service.price}
                      image={service.image_url || "/placeholder.svg"}
                      category={service.category_name || "Other"}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You haven't listed any services yet.</p>
                  <Button className="mt-4" onClick={() => navigate("/create")}>
                    Create Listing
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}