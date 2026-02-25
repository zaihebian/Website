import Link from "next/link";

type FooterProps = {
  variant?: "default" | "dark";
};

export default function Footer({ variant = "default" }: FooterProps) {
  if (variant === "dark") {
    return (
      <footer className="mt-16 border-t border-white/5 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>© {new Date().getFullYear()} LiqenTech Ltd.</span>
              <span>·</span>
              <Link href="#" className="hover:text-cyan-400">Privacy</Link>
              <span>·</span>
              <Link href="#" className="hover:text-cyan-400">Terms</Link>
            </div>
            <div className="flex space-x-5 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-cyan-400 text-xl"><i className="fa-brands fa-x-twitter" /></a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 text-xl"><i className="fa-brands fa-linkedin-in" /></a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 text-xl"><i className="fa-brands fa-github" /></a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  return (
    <footer className="mt-16 border-t border-white/70 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} LiqenTech. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="mailto:contact@liqentech.com">contact@liqentech.com</a>
        </div>
      </div>
    </footer>
  );
}
