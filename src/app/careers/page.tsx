import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const roles = [
  {
    title: "Software Engineer (Frontend)",
    type: "Contract / Remote",
    location: "Remote",
    experience: "3+ years",
    description: "We're looking for a skilled Frontend Engineer to join our team and help build exceptional user experiences. You'll work with modern technologies to create responsive, performant web applications.",
    responsibilities: [
      "Develop and maintain React-based web applications",
      "Implement responsive designs using Tailwind CSS",
      "Optimize applications for maximum speed and scalability",
      "Collaborate with designers to implement pixel-perfect UIs",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and technical discussions",
      "Work with modern build tools and development workflows"
    ],
    requirements: [
      "3+ years of experience with React and modern JavaScript/TypeScript",
      "Strong proficiency in HTML5, CSS3, and responsive design",
      "Experience with Tailwind CSS or similar utility-first frameworks",
      "Knowledge of modern frontend build tools (Vite, Webpack, etc.)",
      "Experience with version control (Git) and collaborative development",
      "Understanding of web performance optimization techniques",
      "Bonus: Experience with animation libraries (Framer Motion, GSAP)",
      "Bonus: Knowledge of testing frameworks (Jest, React Testing Library)"
    ],
    benefits: [
      "Competitive contract rates",
      "Flexible working hours",
      "Remote-first culture",
      "Opportunity to work on diverse projects",
      "Professional development support"
    ]
  },
  {
    title: "AI Engineer",
    type: "Contract / Remote",
    location: "Remote",
    experience: "2+ years",
    description: "Join our AI team to build intelligent features and systems that enhance user experiences. You'll work with cutting-edge AI technologies to solve real-world problems for our clients.",
    responsibilities: [
      "Design and implement AI-powered features using LLMs and modern AI tools",
      "Develop and deploy AI agents and automation systems",
      "Integrate AI capabilities into existing web applications",
      "Evaluate and optimize AI model performance",
      "Research and prototype new AI solutions",
      "Collaborate with frontend teams to implement AI features",
      "Document AI systems and create technical specifications"
    ],
    requirements: [
      "2+ years of experience with AI/ML technologies",
      "Strong programming skills in Python and JavaScript/TypeScript",
      "Experience with Large Language Models (OpenAI, Anthropic, etc.)",
      "Knowledge of AI frameworks (LangChain, LlamaIndex, etc.)",
      "Understanding of prompt engineering and fine-tuning techniques",
      "Experience with API integration and web services",
      "Bonus: Experience with vector databases and embeddings",
      "Bonus: Knowledge of AI evaluation and testing methodologies"
    ],
    benefits: [
      "Work with cutting-edge AI technologies",
      "Competitive contract rates",
      "Remote work flexibility",
      "Access to latest AI tools and resources",
      "Opportunity to shape AI product strategy"
    ]
  },
  {
    title: "Digital Marketing Specialist",
    type: "Part-time / Remote",
    location: "Remote",
    experience: "2+ years",
    description: "We're seeking a Digital Marketing Specialist to drive our online presence and growth. You'll be responsible for SEO, analytics, content performance, and digital marketing strategies.",
    responsibilities: [
      "Develop and execute SEO strategies to improve organic visibility",
      "Manage and analyze website analytics and performance metrics",
      "Create and optimize content for better search rankings",
      "Monitor and report on digital marketing campaign performance",
      "Manage social media presence and engagement",
      "Conduct keyword research and competitive analysis",
      "Collaborate with development team on technical SEO improvements"
    ],
    requirements: [
      "2+ years of digital marketing experience",
      "Strong understanding of SEO best practices and tools",
      "Experience with Google Analytics, Search Console, and similar tools",
      "Knowledge of content marketing and social media strategies",
      "Proficiency in marketing analytics and reporting",
      "Experience with marketing automation tools",
      "Bonus: Experience with paid advertising (Google Ads, social media ads)",
      "Bonus: Basic understanding of web development and technical SEO"
    ],
    benefits: [
      "Flexible part-time schedule",
      "Remote work opportunity",
      "Competitive hourly rates",
      "Autonomy in marketing strategy development",
      "Opportunity to grow with the company"
    ]
  }
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Join LiqenTech</h1>
          <p className="mt-3 text-slate-700 max-w-2xl mx-auto">
            We hire thoughtfully and keep teams small. If you love deep work and clean execution, we&apos;d love to hear from you.
          </p>
        </div>

        <div className="space-y-8">
          {roles.map((role) => (
            <div key={role.title} className="card">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">{role.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {role.type}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {role.location}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {role.experience}
                    </span>
                  </div>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed mb-6">
                  {role.description}
                </p>
              </div>

              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {role.responsibilities.map((responsibility, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-slate-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {role.requirements.map((requirement, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-slate-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">What We Offer</h3>
                <ul className="grid md:grid-cols-2 gap-2">
                  {role.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Ready to Join Our Team?</h3>
            <p className="text-slate-600 mb-6">
              We&apos;re always looking for talented individuals who share our passion for quality and innovation. 
              Don&apos;t see a role that fits? We&apos;d still love to hear from you.
            </p>
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-slate-800 mb-2">How to Apply</h4>
              <p className="text-slate-600 mb-4">
                Send your CV and a brief cover letter to:
              </p>
              <a 
                href="mailto:careers@liqentech.com" 
                className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-4 text-lg"
              >
                careers@liqentech.com
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
