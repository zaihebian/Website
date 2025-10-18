import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaterButton from "@/components/WaterButton";

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="card">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
                Thank You!
              </h1>
              <p className="text-xl text-slate-700 mb-6">
                Your enquiry has been successfully submitted.
              </p>
              <p className="text-slate-600 mb-8">
                We have received your message and will get back to you within one business day. 
                We appreciate your interest in working with LiqenTech.
              </p>
            </div>
            
            <div className="space-y-4">
              <WaterButton asLink="/">
                Return to Home
              </WaterButton>
              <div>
                <a 
                  href="#services" 
                  className="text-blue-600 hover:text-blue-800 underline underline-offset-4"
                >
                  View Our Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
