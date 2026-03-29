import React, { useState } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Generator from './components/Generator';

export default function App() {
  const [showGenerator, setShowGenerator] = useState(false);

  const handleStart = () => {
    setShowGenerator(true);
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6DA9F6]/10 via-white to-[#EF90B9]/10">
      <Navbar />
      <main>
        <Hero onStart={handleStart} />

        {/* Philosophy Section */}
        <section className="py-32 bg-transparent overflow-hidden">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-6 block">
                  The Philosophy
                </span>
                <h2 className="text-5xl sm:text-6xl font-serif mb-10 leading-[1.1] text-[#1a1a1a]">
                  What are <br />
                  <span className="italic">Social Stories?</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed mb-12 font-light">
                  A Social Story is a resource to help improve the social skills of children and adults with Autism spectrum disorder (ASD). 
                  These Social Stories demonstrate appropriate social interaction, re-enacting different situations using social cues and recommended responses. 
                 They act as a guide to new environments, breaking down complex situations into simple, predictable steps, which lowers the risk of tantrums and builds confidence.
                </p>
                <div className="grid sm:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-[#1a1a1a]">Connection</h4>
                    <p className="text-gray-500 leading-relaxed">Building bridges between different ways of experiencing the world.</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-[#1a1a1a]">Clarity</h4>
                    <p className="text-gray-500 leading-relaxed"> They provide structured, visual narratives that explain what to expect, reducing anxiety about the unknown.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden">
                  <img
                    src="/images/ChatGPT Image Mar 29, 2026, 02_19_15 PM.png"
                    alt="Connection through stories"
                    className="w-full h-full object-cover grayscale-[30%]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-background rounded-full flex items-center justify-center p-8 text-center border border-black/5 shadow-xl">
                  <p className="text-sm font-serif italic text-primary">
                    "Stories are the shortest distance between two people."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Generator />
        <Testimonials />
      </main>

      <footer className="bg-white py-12 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-[#EF90B9]" />
              <div className="w-2 h-2 rounded-full bg-[#6DA9F6]" />
              <div className="w-2 h-2 rounded-full bg-[#81d570]" />
<div className="w-2 h-2 rounded-full bg-[#FAE470]" />
            </div>
            <span className="text-sm font-bold tracking-tight text-[#1a1a1a] uppercase">
              BloomBridge <span className="font-light"></span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">
         
          </p>
        </div>
      </footer>
    </div>
  );
}

