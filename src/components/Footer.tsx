export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/70 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} LiqenTech. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="https://www.linkedin.com" target="_blank">LinkedIn</a>
          <a href="https://github.com" target="_blank">GitHub</a>
          <a href="mailto:contact@liqentech.com">contact@liqentech.com</a>
        </div>
      </div>
    </footer>
  );
}
