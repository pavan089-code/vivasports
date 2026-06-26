import dynamic from "next/dynamic";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export const metadata = {
  title: "Register Your Team | Viva Sports",
  description: "Premium tournament team registration portal for Viva Sports cricket competitions.",
  alternates: { canonical: "/register" },
};

const RegisterPortal = dynamic(() => import("@/components/register/RegisterPortal"), {
  loading: () => <div className="reg-loading">Preparing registration portal...</div>,
});

export default function RegisterPage() {
  return (
    <main className="vs-page">
      <Navbar />
      <RegisterPortal />
      <Footer />
    </main>
  );
}
