type Service = { title: string; desc: string; bullets: string[]; };
const services: Service[] = [
  {
    title: "AI Integration",
    desc: "Deploy practical AI agents, LLMs, and automation into your stack.",
    bullets: ["Chatbots & copilots", "Process automation", "Model selection & eval"],
  },
  {
    title: "Software Development",
    desc: "Robust, maintainable web and platform engineering.",
    bullets: ["APIs & SaaS apps", "Architecture & QA", "DevOps-lite setup"],
  },
  {
    title: "Digital Marketing",
    desc: "Acquisition with data-backed execution.",
    bullets: ["SEO & content systems", "Analytics funnels", "Landing optimization"],
  },
  {
    title: "International Business Consulting",
    desc: "Market entry and ops across regions.",
    bullets: ["Go-to-market plans", "Ops setup", "Partnerships & compliance"],
  },
];

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">Services</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.title} className="card">
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-slate-700">{s.desc}</p>
            <ul className="mt-4 space-y-1 text-slate-700">
              {s.bullets.map((b) => <li key={b}>• {b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
