"use client";

import Image from "next/image";
import { useState } from "react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "ADP Softech helped us build a skilled engineering squad in record time. Highly professional, responsive, and reliable across our microservices roadmap.",
    name: "Rahul Mehta",
    role: "CTO, NexaTech",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    quote:
      "A dependable recruitment partner with deep industry understanding and quality talent. They made our contract staffing expansion seamless.",
    name: "Priya Sharma",
    role: "HR Head, Cloudvista",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80",
  },
  {
    quote:
      "Their offshore staffing team has exceeded our expectations in terms of velocity and code quality. A transparent and trusted partner.",
    name: "Anand Verma",
    role: "VP Engineering, Synapse Labs",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 2));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < testimonials.length - 2 ? prev + 1 : 0));
  };

  const currentPair = [
    testimonials[currentIndex % testimonials.length],
    testimonials[(currentIndex + 1) % testimonials.length],
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Left Column: Highlighted Deep Teal Panel with Static 3D Depth */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#07394B] via-[#102D42] to-[#17647B] p-8 text-white shadow-lg border border-[#07394B]">
            <div>
              {/* Decorative quotation mark */}
              <div className="text-6xl font-serif text-[#14B8C4] leading-none select-none">
                “
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl leading-snug">
                What Our <br />
                Partners Say
              </h2>

              <p className="mt-4 text-sm text-[#DCEFF5]/80 leading-relaxed">
                Discover how our specialized IT recruitment and offshore staffing
                solutions deliver measurable impact for growing tech teams.
              </p>
            </div>

            {/* Navigation Arrow Controls */}
            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-[#07394B]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-[#07394B]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Two White Testimonial Cards */}
          <div className="lg:col-span-8 grid gap-6 sm:grid-cols-2">
            {currentPair.map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="flex flex-col justify-between rounded-3xl border border-[#DCE8ED] bg-white p-7 sm:p-8 shadow-sm transition hover:shadow-md hover:border-[oklch(39.8%_0.07_227.392)]/40"
              >
                <div>
                  <p className="text-sm sm:text-base leading-relaxed text-[#152B38]">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#DCE8ED] flex items-center justify-between">
                  {/* Author avatar & info */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#DCE8ED]">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover object-center"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#152B38]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#607D8B]">{item.role}</p>
                    </div>
                  </div>

                  {/* 5 Cyan Stars */}
                  <div
                    className="flex text-[#14B8C4]"
                    aria-label="5 star rating"
                  >
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-center text-[10px] text-[#607D8B]">
          *Sample client feedback and illustrative partner endorsements.
        </p>
      </div>
    </section>
  );
}
