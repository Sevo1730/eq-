const OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

interface LikertScaleProps {
  onSelect: (value: number) => void;
  selected?: number;
  disabled?: boolean;
}

export default function LikertScale({ onSelect, selected, disabled }: LikertScaleProps) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            onClick={() => !disabled && onSelect(option.value)}
            disabled={disabled}
            className={`
              w-full px-4 py-3.5 rounded-xl text-left text-sm font-medium
              flex items-center gap-3 transition-all duration-200 border
              ${isSelected
                ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200'
                : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50 active:scale-[0.99]'
              }
              ${disabled ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            <span
              className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
                ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}
              `}
            >
              {option.value}
            </span>
            <span>{option.label}</span>
            {isSelected && (
              <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
