import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrendingAssets from "@/components/TrendingAssets";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrendingAssets />
      <Footer />
    </div>
  );
}
