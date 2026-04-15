import { Check } from 'lucide-react';
import { STEPS } from '../data/onboardingData';

export default function StepIndicator({ currentStep, onGoTo }) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const isActive    = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isCompleted && onGoTo(step.id)}
              title={step.label}
              className={[
                'w-[30px] h-[30px] rounded-full flex items-center justify-center',
                'text-xs font-semibold border-[1.5px] transition-all duration-300',
                isActive
                  ? 'bg-accent border-accent text-white ring-4 ring-accent-light'
                  : isCompleted
                  ? 'bg-accent-light border-accent text-accent-text cursor-pointer'
                  : 'bg-white border-neutral-200 text-neutral-400 cursor-default',
              ].join(' ')}
            >
              {isCompleted ? <Check size={12} strokeWidth={2.5} /> : step.id}
            </button>

            {i < STEPS.length - 1 && (
              <div className={[
                'w-9 h-[1.5px] transition-all duration-300',
                step.id < currentStep ? 'bg-accent' : 'bg-neutral-200',
              ].join(' ')} />
            )}
          </div>
        );
      })}
    </div>
  );
}