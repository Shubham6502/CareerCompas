import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function BottomBar({ currentStep, canContinue, onBack, onNext,onSubmit,isLast }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 px-6 py-3.5 flex items-center justify-between">
      <button
        onClick={onBack}
        className={[
          'flex items-center gap-1.5 text-sm font-medium',
          'text-neutral-400 px-3 py-2 rounded-lg',
          'transition-all duration-200',
          currentStep === 1
            ? 'invisible'
            : 'hover:bg-neutral-100 hover:text-neutral-700',
        ].join(' ')}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back
      </button>

      <button
        onClick={isLast? onSubmit : onNext}
        disabled={!canContinue}
        className={[
          'flex items-center gap-2 text-sm font-semibold',
          'text-white rounded-[10px] px-5 py-[11px] transition-all duration-200',
          canContinue
            ? 'bg-indigo-500 hover:bg-indigo-600 active:scale-95 cursor-pointer'
            : 'bg-neutral-300 cursor-default opacity-50',
        ].join(' ')}
      >
        {isLast ? (
          <><Sparkles size={15}  /> Generate Roadmap</>
        ) : (
          <>Continue <ArrowRight size={16} strokeWidth={2} /></>
        )}
      </button>
    </div>
  );
}