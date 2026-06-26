import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Camera, CirclePlay, Mail, MapPin, MessageCircle, Phone, Radio, Send } from "lucide-react";

export const metadata = {
  title: "Contact | Viva Sports",
  description: "Contact Viva Sports by phone, WhatsApp, email, office address, social channels or general enquiry form.",
  alternates: { canonical: "/contact" },
};

const contactItems = [
  ["Phone", "+91 90000 00000", "tel:+919000000000", Phone],
  ["WhatsApp", "+91 90000 00000", "https://wa.me/919000000000", MessageCircle],
  ["Email", "hello@vivasports.in", "mailto:hello@vivasports.in", Mail],
  ["Office Address", "Hyderabad, Telangana, India", "https://maps.google.com/?q=Hyderabad%20Telangana%20India", MapPin],
];

const socials = [
  ["Instagram", "#", Camera],
  ["Facebook", "#", Radio],
  ["YouTube", "#", CirclePlay],
];

export default function ContactPage() {
  return (
    <main className="vs-page">
      <Navbar />
      <section className="contact-page">
        <div className="reg-container contact-grid">
          <div>
            <p className="reg-kicker">Contact Viva Sports</p>
            <h1>Talk to the tournament team</h1>
            <p>For general enquiries, partnerships, venues, media or support, reach Viva Sports through the official channels below.</p>

            <div className="contact-card-grid">
              {contactItems.map(([label, value, href, Icon]) => (
                <a className="contact-card" href={href} key={label}>
                  <Icon />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </a>
              ))}
            </div>

            <div className="contact-socials">
              {socials.map(([label, href, Icon]) => (
                <a href={href} key={label} aria-label={label}><Icon />{label}</a>
              ))}
            </div>
          </div>

          <form className="contact-form">
            <h2>General Contact Form</h2>
            <label><span>Name</span><input name="name" autoComplete="name" /></label>
            <label><span>Email</span><input name="email" type="email" autoComplete="email" /></label>
            <label><span>Phone</span><input name="phone" autoComplete="tel" /></label>
            <label><span>Subject</span><input name="subject" /></label>
            <label><span>Message</span><textarea name="message" rows={5} /></label>
            <button type="submit"><Send /> Send Message</button>
          </form>
        </div>

        <div className="reg-container contact-map">
          <iframe
            title="Viva Sports office location map"
            src="https://www.google.com/maps?q=Hyderabad%20Telangana%20India&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
