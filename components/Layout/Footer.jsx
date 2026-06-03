import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <Container>
        <div className="py-12 grid md:grid-cols-4 gap-10">
          
          <div>
            <h2 className="text-3xl font-black text-white">
              VIVA
            </h2>

            <p className="text-slate-400 mt-4 text-sm">
              A celebration of cricket,
              passion and competition.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>

            <div className="space-y-2 text-slate-400 text-sm">
              <p>Home</p>
              <p>Matches</p>
              <p>Teams</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              Follow Us
            </h3>

            <div className="space-y-2 text-slate-400 text-sm">
              <p>Instagram</p>
              <p>YouTube</p>
              <p>Facebook</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              Contact
            </h3>

            <div className="space-y-2 text-slate-400 text-sm">
              <p>info@viva.com</p>
              <p>+91 99999 99999</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}