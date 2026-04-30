import { motion } from 'framer-motion';
import SelectionCard from '../components/SelectionCard.jsx';
import { TARGETS } from '../data/onboardingData.js';


const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function TargetPage({ selected, onSelect }) {
 

  return (
    <motion.div initial="hidden" animate="show" variants={container}>
      <motion.h1 variants={item} className="font-head text-[clamp(22px,4vw,28px)] font-bold text-neutral-900  mb-2">
        What's your target?
      </motion.h1>
      <motion.p variants={item} className="text-[15px] text-neutral-500  mb-9">
        Each goal shapes different skill priorities and preparation intensity.
      </motion.p>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {TARGETS.map(t => (
          <SelectionCard
            key={t.id}
            selected={selected === t.id}
            onClick={() => { onSelect(t.id); }}
            icon={t.icon}
            name={t.label}
            difficulty={t.difficulty}
            tags={t.tags}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}