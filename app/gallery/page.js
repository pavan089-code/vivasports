import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export default function GalleryPage() {
  return (
    <main className="bg-[#050B18] min-h-screen">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-black text-white mb-3">Gallery</h1>
        <p className="text-slate-400">
          Tournament photos and media will appear here.
        </p>
      </section>

      <Footer />
    </main>
  );
}
