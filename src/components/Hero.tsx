import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const slides = [
  {
    src: "/images/ChatGPT Image Mar 29, 2026, 01_32_02 PM.png",
    label: 'Back to School',
    description: "I will find my desk and sit in my chair. It is okay to feel a little bit shy. I can hold my soft red sweater if I want a hug."
  },
  {
    src: "/images/ChatGPT Image Mar 29, 2026, 01_35_08 PM.png",
    label: 'Making Friends',
    description: "I can say hello or show my toy. I can ask my teacher for help. Playing with friends feels cozy."
  },
  {
    src: "/images/ExcitedBoy.png",
    label: 'Trying New Foods',
    description: "It is okay to feel a little nervous about a new taste. My tummy might feel wiggly. I am proud of myself."
  },
];

export default function Hero({ onStart }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % slides.length);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-transparent pt-36 pb-16">

      {/* Decorative background blobs */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-[#FAE470]/40 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 right-10 w-56 h-56 bg-[#6DA9F6]/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-[#81d570]/30 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24 grid lg:grid-cols-2 gap-2 lg:gap-4 items-center relative z-10">

        {/* Left column: Main headline */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center lg:text-left lg:-mt-36 -mt-10"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-bold leading-[1.05] tracking-tight text-[#1a1a1a]">
            Creating{' '}
            <span className="relative inline-block mt-2 mb-2 lg:mt-0 lg:mb-0">
              <span className="relative z-10 text-[#EF90B9]">Connections</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-[#FAE470] -z-10 rounded-full" />
            </span>
            <br className="hidden lg:block" />
            {' '}Through{' '}
            <span className="text-[#6DA9F6] block mt-2 lg:mt-0 lg:inline">Stories.</span>
          </h1>
          <p className="mt-8 text-xl sm:text-2xl text-gray-500 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
            Create your own personalized story today.
          </p>
        </motion.div>

        {/* Right column: Carousel + CTA */}
        <div className="flex flex-col items-center gap-12">

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl relative"
          >
            <div className="absolute -inset-3 bg-gradient-to-br from-[#EF90B9]/30 via-[#6DA9F6]/20 to-[#81d570]/30 rounded-[48px] blur-2xl -z-10" />

            <div
              className="relative rounded-[32px] overflow-hidden h-[540px] sm:h-[620px]"
              style={{ boxShadow: '0 0 0 4px #FAE470, 0 20px 60px rgba(0,0,0,0.15)' }}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={current}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full absolute inset-0 bg-[#f9f5f0] flex flex-col items-center p-4 sm:p-6"
                >
                  <div className="w-full flex-1 relative rounded-3xl overflow-hidden bg-transparent mb-2">
                    <img
                      src={slides[current].src}
                      alt={slides[current].label}
                      className="w-full h-full object-contain absolute inset-0 p-0 rounded-3xl"
                    />
                  </div>
                  <div className="w-full h-24 sm:h-28 flex items-center justify-center px-4 mb-6 sm:mb-8">
                    <p className="text-center font-serif text-[#1a1a1a] text-base sm:text-lg leading-relaxed">
                      {slides[current].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Story label */}
              <div className="absolute top-5 left-5 z-10 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-md border-2 border-[#81d570]">
                <div className="w-2 h-2 rounded-full bg-[#81d570] animate-pulse" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="text-xs font-bold tracking-widest uppercase text-[#1a1a1a]"
                  >
                    {slides[current].label}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Prev / Next buttons */}
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#FAE470] rounded-full flex items-center justify-center shadow-md hover:bg-[#f5d830] transition-all text-black font-bold"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#FAE470] rounded-full flex items-center justify-center shadow-md hover:bg-[#f5d830] transition-all text-black font-bold"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`transition-all duration-300 rounded-full ${i === current
                      ? 'w-6 h-3 bg-[#EF90B9]'
                      : 'w-3 h-3 bg-white/70 hover:bg-white'
                      }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={onStart}
              className="px-12 py-5 bg-[#81d570] text-black rounded-full font-black text-base uppercase tracking-[0.25em] transition-all hover:bg-[#6bc55e] active:scale-95 shadow-xl shadow-[#81d570]/40"
            >
              Start Creating Stories
            </button>
          </motion.div>

        </div>
      </div>

    </section>
  );
}