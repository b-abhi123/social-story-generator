import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';

const PROGRESS_STEPS = [
  { pct: 10, msg: 'Crafting the storyline…' },
  { pct: 25, msg: 'Writing panels with care…' },
  { pct: 40, msg: 'Story ready — generating illustrations…' },
  { pct: 55, msg: 'Drawing panel 1 & 2…' },
  { pct: 65, msg: 'Drawing panel 3 & 4…' },
  { pct: 78, msg: 'Drawing panel 5 & 6…' },
  { pct: 88, msg: 'Finishing touches…' },
];

interface StoryPanel {
  caption: string;
  image: string; // base64 string
}

interface SocialStory {
  title: string;
  panels: StoryPanel[];
}

interface ChildProfile {
  childName: string;
  age: string;
  gender: string;
  interests: string;
  skinTone: string;
  hair: string;
  outfit: string;
  situation: string;
  colorPalette: string;
}

// ── Backend API ─────────────────────────────────────────────────────────────
async function generateSocialStory(profile: ChildProfile): Promise<SocialStory> {
  const response = await fetch('http://localhost:5050/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'API request failed');
  }

  return response.json() as Promise<SocialStory>;
}

const DOT_COLORS = ['#EF90B9', '#6DA9F6', '#81d570', '#FAE470'];

// ── Reusable field ─────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-gray-500">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-[#1a1a1a] text-sm placeholder:text-gray-300 outline-none focus:border-[#6DA9F6] focus:ring-2 focus:ring-[#6DA9F6]/20 transition-all';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 pb-2 border-b border-gray-100 mb-4">
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Generator() {
  const [profile, setProfile] = useState<ChildProfile>({
    childName: '', age: '', gender: 'boy', interests: '',
    skinTone: '', hair: '', outfit: '', situation: '', colorPalette: 'pastel',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [story, setStory] = useState<SocialStory | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setProgressIdx(prev => Math.min(prev + 1, PROGRESS_STEPS.length - 1));
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const set = (key: keyof ChildProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setProfile(prev => ({ ...prev, [key]: e.target.value }));

  const handleGenerate = async () => {
    if (!profile.situation.trim()) {
      setError('Please describe the situation first.');
      return;
    }
    setError('');
    setProgressIdx(0);
    setIsGenerating(true);
    try {
      const result = await generateSocialStory(profile);
      setStory(result);
      setCurrentPage(0);
    } catch {
      setError('Something went wrong generating the story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => { setStory(null); setError(''); };

  const SECTION_NAMES = ['Introduction', 'Introduction', 'Body', 'Body', 'Conclusion', 'Conclusion'];

  const handleDownloadPdf = () => {
    if (!story) return;
    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        for (let i = 0; i < story.panels.length; i++) {
          if (i > 0) doc.addPage();
          const p = story.panels[i];
          
          const imgSize = 160;
          const imgX = (pageWidth - imgSize) / 2;
          const imgY = 25;
          doc.addImage(p.image, 'PNG', imgX, imgY, imgSize, imgSize);
          
          const textY = imgY + imgSize + 25;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(20);
          
          const maxTextWidth = pageWidth - 40; 
          const lines = doc.splitTextToSize(p.caption, maxTextWidth);
          doc.text(lines, pageWidth / 2, textY, { align: 'center' });
          
          doc.setFontSize(10);
          doc.setTextColor(160, 160, 160);
          doc.text(`${i + 1} of ${story.panels.length}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
          doc.setTextColor(0, 0, 0); 
        }
        
        const safeTitle = story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        doc.save(`${safeTitle}.pdf`);
      } catch (e) {
        console.error("PDF generation failed:", e);
        setError("Sorry, an error occurred while creating the PDF.");
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 50);
  };

  const panel = story?.panels[currentPage];

  return (
    <section id="generator" className="relative py-32 bg-transparent min-h-screen flex items-center px-4 sm:px-8">

      {/* Decorative blobs — matches Hero */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#FAE470]/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-64 h-64 bg-[#EF90B9]/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-[#6DA9F6]/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-[48px] p-8 sm:p-16 relative z-10">
        <div className="max-w-3xl w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#6DA9F6] mb-4 block">
            Create a Story
          </span>
          <h2 className="text-5xl sm:text-6xl font-bold mb-4 text-[#1a1a1a]">
            Story <span className="text-[#EF90B9]">Generator</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Create a personalized Social Story in seconds.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!story ? (
            /* ── FORM ─────────────────────────────────────────────────── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[32px] border border-black/5 shadow-sm p-8"
            >
              {/* Child's Profile */}
              <div className="mb-7">
                <SectionLabel>Child's profile</SectionLabel>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Name">
                    <input className={inputCls} placeholder="e.g. Ayushman" value={profile.childName} onChange={set('childName')} />
                  </Field>
                  <Field label="Age">
                    <input className={inputCls} type="number" placeholder="e.g. 9" min={2} max={18} value={profile.age} onChange={set('age')} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Gender">
                    <select className={inputCls} value={profile.gender} onChange={set('gender')}>
                      <option value="boy">Boy</option>
                      <option value="girl">Girl</option>
                      <option value="child">Prefer not to say</option>
                    </select>
                  </Field>
                  <Field label="Interests / comfort objects">
                    <input className={inputCls} placeholder="e.g. dinosaurs, Paw Patrol" value={profile.interests} onChange={set('interests')} />
                  </Field>
                </div>
              </div>

              {/* Appearance */}
              <div className="mb-7">
                <SectionLabel>Appearance</SectionLabel>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Skin tone">
                    <input className={inputCls} placeholder="e.g. warm medium-brown" value={profile.skinTone} onChange={set('skinTone')} />
                  </Field>
                  <Field label="Hair">
                    <input className={inputCls} placeholder="e.g. short black straight hair" value={profile.hair} onChange={set('hair')} />
                  </Field>
                </div>
                <Field label="Outfit">
                  <input className={inputCls} placeholder="e.g. red hoodie and grey pants" value={profile.outfit} onChange={set('outfit')} />
                </Field>
              </div>

              {/* Situation */}
              <div className="mb-7">
                <SectionLabel>Situation</SectionLabel>
                <Field label="Describe the situation">
                  <textarea
                    className={`${inputCls} h-28 resize-none`}
                    placeholder="e.g. Ayushman has a dentist appointment after school. He is nervous about the sounds."
                    value={profile.situation}
                    onChange={set('situation')}
                  />
                </Field>
              </div>

              {/* Error */}
              {error && (
                <p className="text-[#b03e78] bg-[#EF90B9]/10 border border-[#EF90B9]/30 rounded-2xl px-4 py-3 text-sm mb-4">
                  {error}
                </p>
              )}

              {/* Generate button — green like Hero CTA */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 rounded-full font-bold text-sm uppercase tracking-[0.25em] text-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#81d570]/30 hover:bg-[#6bc55e]"
                style={{ background: '#81d570' }}
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Generating Magic...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Generate Story</>
                )}
              </button>

              {/* Progress Bar shown during generation */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 text-center overflow-hidden"
                  >
                    <p className="text-sm text-gray-500 mb-3 font-medium">
                      {PROGRESS_STEPS[progressIdx].msg}
                    </p>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f59e0b] h-full transition-all duration-1000 ease-in-out" 
                        style={{ width: `${PROGRESS_STEPS[progressIdx].pct}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          ) : (
            /* ── STORY VIEWER ─────────────────────────────────────────── */
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col items-center">
                {/* Story header */}
                <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f59e0b] text-transparent bg-clip-text text-center mb-10 px-4 py-2 leading-normal break-words w-full" style={{ fontFamily: '"Caveat", cursive' }}>
                  {story.title}
                </h3>

                {/* Page card - Flipbook style */}
                <div className="w-full max-w-sm sm:max-w-md relative bg-[#fdf6ec] border border-[#e8dcc8] rounded-[24px] shadow-2xl overflow-hidden mb-8">
                  {/* Decorative badge top-left */}
                  <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                    {SECTION_NAMES[currentPage] || 'Story'}
                  </div>
                  {/* Decorative number top-right */}
                  <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-md rounded-full w-9 h-9 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                    {currentPage + 1}
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      className="w-full flex flex-col"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                    >
                      {/* Image Frame */}
                      <div className="w-full aspect-square bg-[#efe8da] relative">
                        {panel?.image && (
                          <img 
                            src={panel.image} 
                            alt="Story Panel Illustration" 
                            className="w-full h-full object-cover absolute inset-0"
                          />
                        )}
                      </div>
                      
                      {/* Caption Text Box */}
                      <div className="p-6 sm:p-10 text-center bg-[#fdf6ec] min-h-[140px] flex items-center justify-center">
                        <p className="font-medium text-[#3d3529] text-lg sm:text-lg leading-relaxed">
                          {panel?.caption}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-6 mb-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-gray-700"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {/* Dot indicators */}
                  <div className="flex items-center gap-2">
                    {story.panels.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`transition-all duration-300 rounded-full ${i === currentPage ? 'w-3 h-3 bg-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`}
                        aria-label={`Go to panel ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(story.panels.length - 1, p + 1))}
                    disabled={currentPage === story.panels.length - 1}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-gray-700"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-8">
                  Panel {currentPage + 1} of {story.panels.length}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4" /> Start Over
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-[0.1em] text-black transition-all active:scale-[0.98] shadow-xl shadow-[#81d570]/30 hover:bg-[#6bc55e] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#81d570' }}
                  >
                    {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : '📄'} 
                    {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
