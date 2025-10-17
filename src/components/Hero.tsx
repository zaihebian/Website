import WaterButton from "./WaterButton";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
        LiqenTech
        <span className="block text-2xl md:text-3xl font-medium mt-3 text-slate-600">
          Flowing Innovation in Software & AI
        </span>
      </h1>
      <p className="mt-6 text-slate-700 max-w-2xl mx-auto">
        We blend AI, software craftsmanship, digital marketing, and international business consulting to deliver outcomes that move like water—smooth, fast, and reliable.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <WaterButton asLink="#consulting">Get Started</WaterButton>
        <a className="underline underline-offset-4" href="#services">Our Services</a>
      </div>
    </section>
  );
}
