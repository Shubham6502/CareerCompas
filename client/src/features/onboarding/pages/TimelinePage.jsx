import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { TIMELINES } from '../data/onboardingData';




const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function TimelinePage({ selected, onSelect }) {
 
 const [promptText, setPromptText] = useState('');


  const activeHrs =
    TIMELINES.find(t => t.id === selected?.timeline)?.hrs ?? '2–3';

  const handleTimelineClick = (t) => {
    onSelect({
      timeline: t.id,
      hours: t.hrs,
      prompt: '' // reset prompt
    });
  };

  
  const handleSubmit = () => {
    onSelect({
      ...selected,
      prompt: promptText
    });
  };

  return (
    <motion.div initial="hidden" animate="show" variants={container}>
      <motion.h1 variants={item} className="font-head text-[clamp(22px,4vw,28px)] font-bold text-neutral-900  mb-2">
        Set your timeline
      </motion.h1>
      <motion.p variants={item} className="text-[15px] text-neutral-500  mb-9">
        Shorter timelines mean more daily commitment.
      </motion.p>

      {/* Timeline cards */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {TIMELINES.map(t => (
          <motion.button
            key={t.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleTimelineClick(t)}
            className={[
              'rounded-[14px] py-5 px-3 text-center border-[1.5px] transition-all duration-200 cursor-pointer',
              selected.timeline === t.id
                ? 'bg-accent-light  border-accent '
                : 'bg-white  border-neutral-200  shadow-card  hover:border-accent/40 ',
            ].join(' ')}
          >
            <div className="font-head text-[28px] font-bold text-neutral-900  leading-none mb-1">
              {t.days}
            </div>
            <div className="text-[13px] text-neutral-500 ">days</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Estimated hours */}
      <motion.p variants={item} className="text-center text-sm text-neutral-500  mb-8">
        Estimated:{' '}
        <strong className="text-neutral-800  font-semibold">
          {activeHrs} hrs/day
        </strong>
      </motion.p>

      {/* Divider */}
      <motion.div variants={item} className="flex items-center gap-3.5 mb-5">
        <span className="flex-1 h-px bg-neutral-200 " />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 ">
          or try AI-powered generation
        </span>
        <span className="flex-1 h-px bg-neutral-200 " />
      </motion.div>

      {/* AI prompt */}
      <motion.div
        variants={item}
        className="flex items-center gap-3 bg-white  border-[1.5px] border-neutral-200  rounded-[10px] px-4 py-2.5 shadow-card focus-within:border-accent/40  transition-colors"
      >
        <Sparkles size={20} className="text-accent  shrink-0" strokeWidth={1.75} />
        <input
          value={promptText}
          onChange={e => setPromptText(e.target.value)}
          placeholder="I want to become a backend engineer in 60 days..."
          className="flex-1 bg-transparent font-body text-sm text-neutral-900   outline-none"
        />
        <button
          onClick={handleSubmit}
          className="shrink-0 px-4 py-2 bg-accent  hover:bg-accent-hover  text-white font-body text-[13px] font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap">
          Try
        </button>
      </motion.div>
    </motion.div>
  );
}