"use client";
import { useState } from "react";

interface Review {
  id: number;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "CTO",
    company: "Tech Startup",
    role: "Chief Technology Officer",
    content: "LiqenTech transformed our development workflow. Their AI integration reduced our deployment time by 60% and the code quality improvements are remarkable. Highly recommend their consulting services.",
    rating: 5,
  },
  {
    id: 2,
    name: "Product Manager",
    company: "SaaS Company",
    role: "Product Manager",
    content: "Working with LiqenTech was a game-changer. They delivered our MVP in record time with exceptional attention to detail. The team's expertise in modern web technologies is outstanding.",
    rating: 5,
  },
  {
    id: 3,
    name: "Founder",
    company: "E-commerce Platform",
    role: "Founder & CEO",
    content: "LiqenTech helped us build a scalable platform from scratch. Their strategic approach and technical excellence exceeded our expectations. The project was delivered on time and within budget.",
    rating: 5,
  },
  {
    id: 4,
    name: "Engineering Lead",
    company: "Data Analytics Firm",
    role: "Senior Engineering Lead",
    content: "The AI-powered features LiqenTech implemented have revolutionized our user experience. Their deep understanding of both frontend and backend technologies is impressive.",
    rating: 5,
  },
  {
    id: 5,
    name: "VP Engineering",
    company: "Cloud Services",
    role: "VP of Engineering",
    content: "LiqenTech's expertise in React and modern web development helped us modernize our entire frontend. The performance improvements and user experience enhancements are significant.",
    rating: 5,
  },
  {
    id: 6,
    name: "CEO",
    company: "Mobile App Company",
    role: "Chief Executive Officer",
    content: "Outstanding work! LiqenTech delivered a complex application with beautiful UI and robust functionality. Their communication throughout the project was excellent.",
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {review.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800">{review.name}</h4>
          <p className="text-sm text-slate-600">{review.role}</p>
          <p className="text-sm text-blue-600 font-medium">{review.company}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <StarRating rating={review.rating} />
      </div>
      
        <blockquote className="text-slate-700 italic leading-relaxed">
          &ldquo;{review.content}&rdquo;
        </blockquote>
    </div>
  );
};

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const nextReviews = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevReviews = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentReviews = reviews.slice(
    currentIndex * reviewsPerPage,
    (currentIndex + 1) * reviewsPerPage
  );

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What Our Clients Say
        </h2>
        <p className="text-xl text-slate-700 max-w-2xl mx-auto">
          Don&apos;t just take our word for it. Here&apos;s what our clients have to say about working with LiqenTech.
        </p>
      </div>

      <div className="relative">
        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={prevReviews}
            className="p-2 rounded-full bg-white/70 backdrop-blur border border-white/60 hover:bg-white/90 transition-all duration-200 hover:scale-105"
            aria-label="Previous reviews"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-blue-500 scale-125"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={nextReviews}
            className="p-2 rounded-full bg-white/70 backdrop-blur border border-white/60 hover:bg-white/90 transition-all duration-200 hover:scale-105"
            aria-label="Next reviews"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="card">
          <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
          <div className="text-slate-600">Projects Completed</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
          <div className="text-slate-600">Client Satisfaction</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
          <div className="text-slate-600">Support Available</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
          <div className="text-slate-600">Years Experience</div>
        </div>
      </div>
    </section>
  );
}
