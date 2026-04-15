import { motion } from 'framer-motion';
import SelectionCard from '../components/SelectionCard';
import { EXPERIENCE_LEVELS } from '../data/onboardingData';


const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function ExperiencePage({ selected, onSelect }) {
 
  return (
    <motion.div initial="hidden" animate="show" variants={container}>
      <motion.h1 variants={item} className="font-head text-[clamp(22px,4vw,28px)] font-bold text-neutral-900  mb-2">
        Your experience level
      </motion.h1>
      <motion.p variants={item} className="text-[15px] text-neutral-500  mb-9">
        This helps calibrate task difficulty and starting point.
      </motion.p>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {EXPERIENCE_LEVELS.map(l => (
          <SelectionCard
            key={l.id}
            selected={selected === l.id}
            onClick={() => { onSelect(l.id); }}
            name={l.label}
            desc={l.desc}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}