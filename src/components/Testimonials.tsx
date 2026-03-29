import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

const testimonials = [
  {
    quote: "I've found it helpful in 'rewriting the script' for certain neurodiverse kids.",
    author: "Talia Polak",
    role: "Primary School Teacher",
    initials: "TP",
    bg: "bg-[#EF90B9]",
    border: "border-[#EF90B9]",
  },
  {
    quote: "They help provide students with visualization. This is really useful when something is a totally new concept or experience, it’s also particularly useful for children who struggle with abstract or decontextualized language.",
    author: "Zoe Harush",
    role: "Parent",
    initials: "ZH",
    bg: "bg-[#6DA9F6]",
    border: "border-[#6DA9F6]",
  },
  {
    quote: "I tend to use these to teach things like road safety. E.g. explain the dangers of cars, and list each step to crossing a road like look both ways, hold a parents hand, wait for cars to go etc. It explicitly describes and gives examples for the social rules that are usually implied. ",
    author: "Rony Rodriguez",
    role: "Child Care Worker",
    initials: "RR",
    bg: "bg-[#81d570]",
    border: "border-[#81d570]",
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold mb-4 text-[#1a1a1a]">
            What others{' '}
            <span className="text-[#6DA9F6]">are saying</span>
          </h2>
          <p className="text-xl text-gray-500">Join thousands who trust our approach</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-[32px] p-8 border-4 ${t.border} flex flex-col justify-between shadow-lg`}
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FAE470] text-[#FAE470]" />
                  ))}
                </div>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${t.bg}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}