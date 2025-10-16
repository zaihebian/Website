import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const roles = [
  {
    title: "Software Engineer (Frontend)",
    type: "Contract / Remote",
    copy: "Build high-quality UIs with React and Tailwind. Bonus: animation chops.",
    email: "jobs@liqentech.com"
  },
  {
    title: "AI Engineer",
    type: "Contract / Remote",
    copy: "Ship pragmatic AI features (LLMs, agents, evaluation).",
    email: "jobs@liqentech.com"
  },
  {
    title: "Digital Marketing Specialist",
    type: "Part-time / Remote",
    copy: "Own SEO, analytics, and content performance.",
    email: "jobs@liqentech.com"
  }
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold">Join LiqenTech</h1>
        <p className="mt-3 text-slate-700 max-w-2xl">
          We hire thoughtfully and keep teams small. If you love deep work and clean execution, reach out.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {roles.map((r) => (
            <div key={r.title} className="card">
              <h3 className="text-xl font-semibold">{r.title}</h3>
              <p className="text-slate-600 mt-1">{r.type}</p>
              <p className="mt-3 text-slate-700">{r.copy}</p>
              <a href={`mailto:${r.email}?subject=${encodeURIComponent(r.title)} — Application`} className="water-btn mt-4 w-fit">
                Apply via Email
              </a>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
