'use client';

import React from 'react';

interface StepProgressBarProps {
  currentStep: number; // 1=Shopping, 2=Cart, 3=Checkout, 4=Payment
}

const steps = [
  { num: 1, label: 'Shopping' },
  { num: 2, label: 'Cart' },
  { num: 3, label: 'Checkout' },
  { num: 4, label: 'Payment' },
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-4 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-5 left-[5%] right-[5%] h-1 bg-slate-200 rounded-full z-0" />
        {/* Active connector line */}
        <div
          className="absolute top-5 left-[5%] h-1 bg-emerald-500 rounded-full z-[1] transition-all duration-500"
          style={{
            width: `${Math.max(0, ((Math.min(currentStep, 4) - 1) / 3) * 90)}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.num;
          const isActive = currentStep === step.num;
          const isFuture = currentStep < step.num;

          return (
            <div key={step.num} className="flex flex-col items-center z-10 relative" style={{ width: '25%' }}>
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isActive
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                      : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              {/* Label */}
              <span
                className={`mt-1.5 text-[10px] sm:text-xs font-bold tracking-tight ${
                  isCompleted || isActive ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
