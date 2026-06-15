import ConsultationProvider from "@/components/ConsultationProvider";
import FluidScene from "@/components/FluidScene";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { VisitorTracker } from "@/components/VisitorTracker";

const roles = [
  {
    title: "Software Engineer (Frontend)",
    tags: ["Contract", "Remote", "3+ years"],
    description:
      "We're looking for a skilled Frontend Engineer to join our team and help build exceptional user experiences. You'll work with modern technologies to create responsive, performant web applications.",
    responsibilities: [
      "Develop and maintain React-based web applications",
      "Implement responsive designs using Tailwind CSS",
      "Optimize applications for maximum speed and scalability",
      "Collaborate with designers to implement pixel-perfect UIs",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and technical discussions",
      "Work with modern build tools and development workflows",
    ],
    requirements: [
      "3+ years of experience with React and modern JavaScript/TypeScript",
      "Strong proficiency in HTML5, CSS3, and responsive design",
      "Experience with Tailwind CSS or similar utility-first frameworks",
      "Knowledge of modern frontend build tools (Vite, Webpack, etc.)",
      "Experience with version control (Git) and collaborative development",
      "Understanding of web performance optimization techniques",
      "Bonus: Experience with animation libraries (Framer Motion, GSAP)",
      "Bonus: Knowledge of testing frameworks (Jest, React Testing Library)",
    ],
    benefits: [
      "Competitive contract rates",
      "Flexible working hours",
      "Remote-first culture",
      "Opportunity to work on diverse projects",
      "Professional development support",
    ],
  },
  {
    title: "AI Engineer",
    tags: ["Contract", "Remote", "2+ years"],
    description:
      "Join our AI team to build intelligent features and systems that enhance user experiences. You'll work with cutting-edge AI technologies to solve real-world problems for our clients.",
    responsibilities: [
      "Design and implement AI-powered features using LLMs and modern AI tools",
      "Develop and deploy AI agents and automation systems",
      "Integrate AI capabilities into existing web applications",
      "Evaluate and optimize AI model performance",
      "Research and prototype new AI solutions",
      "Collaborate with frontend teams to implement AI features",
      "Document AI systems and create technical specifications",
    ],
    requirements: [
      "2+ years of experience with AI/ML technologies",
      "Strong programming skills in Python and JavaScript/TypeScript",
      "Experience with Large Language Models (OpenAI, Anthropic, etc.)",
      "Knowledge of AI frameworks (LangChain, LlamaIndex, etc.)",
      "Understanding of prompt engineering and fine-tuning techniques",
      "Experience with API integration and web services",
      "Bonus: Experience with vector databases and embeddings",
      "Bonus: Knowledge of AI evaluation and testing methodologies",
    ],
    benefits: [
      "Work with cutting-edge AI technologies",
      "Competitive contract rates",
      "Remote work flexibility",
      "Access to latest AI tools and resources",
      "Opportunity to shape AI product strategy",
    ],
  },
  {
    title: "Digital Marketing Specialist",
    tags: ["Part-time", "Remote", "2+ years"],
    description:
      "We're seeking a Digital Marketing Specialist to drive our online presence and growth. You'll be responsible for SEO, analytics, content performance, and digital marketing strategies.",
    responsibilities: [
      "Develop and execute SEO strategies to improve organic visibility",
      "Manage and analyze website analytics and performance metrics",
      "Create and optimize content for better search rankings",
      "Monitor and report on digital marketing campaign performance",
      "Manage social media presence and engagement",
      "Conduct keyword research and competitive analysis",
      "Collaborate with development team on technical SEO improvements",
    ],
    requirements: [
      "2+ years of digital marketing experience",
      "Strong understanding of SEO best practices and tools",
      "Experience with Google Analytics, Search Console, and similar tools",
      "Knowledge of content marketing and social media strategies",
      "Proficiency in marketing analytics and reporting",
      "Experience with marketing automation tools",
      "Bonus: Experience with paid advertising (Google Ads, social media ads)",
      "Bonus: Basic understanding of web development and technical SEO",
    ],
    benefits: [
      "Flexible part-time schedule",
      "Remote work opportunity",
      "Competitive hourly rates",
      "Autonomy in marketing strategy development",
      "Opportunity to grow with the company",
    ],
  },
];

export default function CareersPage() {
  return (
    <ConsultationProvider>
      <VisitorTracker />
      <FluidScene />
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-36 sm:px-6" data-track-section="careers">
        <Reveal>
          <h1 className="text-4xl font-semibold tracking-tighter text-[var(--ink)] sm:text-5xl">Join LiqenTech</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--ink-dim)]">
            We hire thoughtfully and keep teams small. If you love deep work and clean execution, we&apos;d love to hear
            from you.
          </p>
        </Reveal>

        <div className="mt-16 space-y-6">
          {roles.map((role) => (
            <Reveal key={role.title}>
              <article className="glass rounded-3xl p-7 sm:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">{role.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {role.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--line)] bg-white/5 px-3 py-1 text-xs font-medium text-[var(--ink-dim)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--ink-dim)]">{role.description}</p>

                <div className="mt-8 grid gap-10 lg:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-[var(--ink)]">Key responsibilities</h3>
                    <ul className="mt-4 space-y-2.5">
                      {role.responsibilities.map((item) => (
                        <li key={item} className="text-[15px] leading-relaxed text-[var(--ink-faint)]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-[var(--ink)]">Requirements</h3>
                    <ul className="mt-4 space-y-2.5">
                      {role.requirements.map((item) => (
                        <li key={item} className="text-[15px] leading-relaxed text-[var(--ink-faint)]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-10 border-t border-[var(--line)] pt-8">
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--ink)]">What we offer</h3>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {role.benefits.map((item) => (
                      <li key={item} className="text-[15px] leading-relaxed text-[var(--ink-faint)]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <div className="glass mx-auto max-w-2xl rounded-3xl p-8 text-center sm:p-12">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">Don&apos;t see a role that fits?</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-dim)]">
              We&apos;re always looking for talented people who care about quality. Send your CV and a brief cover letter
              to:
            </p>
            <a
              href="mailto:careers@liqentech.com"
              className="mt-6 inline-block text-lg font-medium text-[var(--accent)] underline underline-offset-4 transition hover:opacity-80"
              data-track-click="careers-email"
            >
              careers@liqentech.com
            </a>
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </ConsultationProvider>
  );
}
