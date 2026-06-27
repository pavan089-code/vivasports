import { Star } from "lucide-react";

const testimonials = [
  { name: "Rahul Sharma", role: "Captain, Warriors XI", quote: "Viva Sports makes community cricket feel organized, visible and genuinely competitive." },
  { name: "Imran Khan", role: "Team Manager", quote: "The fixtures, live scoring and communication helped our team follow the whole tournament smoothly." },
  { name: "Arjun Reddy", role: "All-rounder", quote: "The platform gives local players the stage and recognition they have been waiting for." },
];

export default function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-title" className="bg-[#07152e] py-16 md:py-24">
      <div className="mx-auto w-[calc(100%-1.5rem)] max-w-7xl md:w-[calc(100%-3rem)]">
        <p className="text-xs font-black tracking-[0.2em] text-[#d4af37] uppercase">Testimonials</p>
        <h2 className="mt-3 text-3xl font-black text-white uppercase md:text-5xl" id="testimonials-title">Trusted Across The Cricket Community</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote className="rounded-3xl border border-white/8 bg-[#101d35] p-7" key={item.name}>
              <div aria-label="5 out of 5 stars" className="flex gap-1 text-[#d4af37]">
                {Array.from({ length: 5 }, (_, index) => <Star aria-hidden="true" className="size-4 fill-current" key={index} />)}
              </div>
              <p className="mt-6 text-lg leading-8 text-slate-200">“{item.quote}”</p>
              <footer className="mt-7 border-t border-white/8 pt-5"><strong className="block text-white">{item.name}</strong><span className="mt-1 block text-sm text-slate-500">{item.role}</span></footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
