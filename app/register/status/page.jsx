import dynamic from "next/dynamic";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export const metadata = {
  title: "Registration Status | Viva Sports",
  description: "Check the verification status of a Viva Sports tournament team registration.",
  alternates: { canonical: "/register/status" },
};

const StatusClient = dynamic(() => import("./status-client"), {
  loading: () => <div className="reg-loading">Loading status lookup...</div>,
});

export default function RegistrationStatusPage() {
  return (
    <main className="vs-page">
      <Navbar />
      <StatusClient />
      <Footer />
    </main>
  );
}
