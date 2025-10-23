import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CustomerReviews from "@/components/CustomerReviews";
import Consulting from "@/components/Consulting";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <CustomerReviews />
        <Consulting />
      </main>
      <Footer />
    </>
  );
}
