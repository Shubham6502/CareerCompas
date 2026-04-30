import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const DIFFICULTY_CLASSES = {
  Hard:   'text-red-500 ',
  Medium: 'text-amber-600',
  Easy:   'text-green-600 ',
};

export default function SelectionCard({
  selected, onClick,
  icon: Icon, name, desc,
  difficulty, tags,
  className = '',
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={[
        'relative rounded-[14px] p-[22px_20px] cursor-pointer border-[1.5px]',
        'transition-all duration-200',
        selected
          ? 'bg-accent-light  border-accent  shadow-selected '
          : 'bg-white border-neutral-200  shadow-card  hover:border-accent/40 ',
        className,
      ].join(' ')}
    >
      {/* Check badge */}
      {selected && (
        <div className="absolute top-3 right-3 w-[22px] h-[22px] rounded-full bg-accent  flex items-center justify-center">
          <Check size={12} color="#fff" strokeWidth={2.5} />
        </div>
      )}

      {/* Icon */}
      {Icon && (
        <div className="w-11 h-11 rounded-[11px] bg-accent-light  flex items-center justify-center mb-3.5">
          <Icon size={22} className="text-accent " strokeWidth={1.75} />
        </div>
      )}

      {/* Name */}
      <p className="font-head text-[15px] font-semibold text-neutral-900  mb-1.5">
        {name}
      </p>

      {/* Description */}
      {desc && (
        <p className="text-[13px] text-neutral-500  leading-relaxed mb-3">
          {desc}
        </p>
      )}

      {/* Difficulty */}
      {difficulty && (
        <p className="text-xs font-medium mb-2.5">
          <span className="text-neutral-400  mr-1">Difficulty:</span>
          <span className={DIFFICULTY_CLASSES[difficulty]}>{difficulty}</span>
        </p>
      )}

      {/* Tags */}
      {tags && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2.5 py-[3px] rounded-full bg-neutral-100  text-neutral-500  border-neutral-200 "
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}