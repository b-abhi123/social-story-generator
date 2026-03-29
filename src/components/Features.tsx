import React from 'react';
import { motion } from 'motion/react';

const features = [
  {
    title: "Parents",
    image: "https://picsum.photos/seed/parents/400/400",
    description: "Empower your child with tools to navigate daily routines and social changes.",
    bg: "bg-[#EF90B9]",
  },
  {
    title: "Educators",
    image: "https://picsum.photos/seed/educators/400/400",
    description: "Create classroom-ready narratives that support diverse learning needs.",
    bg: "bg-[#6DA9F6]",
  },
  {
    title: "Caregivers",
    image: "https://picsum.photos/seed/caregivers/400/400",
    description: "Build stronger bonds through shared understanding and clear communication.",
    bg: "bg-[#81d570]",
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-[#1a1a1a]">
          Who is it <span className="text-[#EF90B9]">for?</span>
        </h2>
        <p className="text-xl text-gray-500 mb-16 max-w-3xl mx-auto">
          Trusted by professionals and families worldwide to create meaningful stories.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${feature.bg} rounded-[32px] p-8 text-left group cursor-pointer hover:scale-105 transition-transform duration-300`}
            >
              <div className="w-full aspect-square rounded-[20px] overflow-hidden mb-6 shadow-lg">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}