import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Group Details' },
    { number: 2, label: 'Itineraries' }
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* Step */}
          <div className="flex items-center gap-3">
            <div
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep > step.number
                  ? 'bg-[#ff6600] shadow-lg shadow-[#ff6600]/50'
                  : currentStep === step.number
                  ? 'bg-gradient-to-br from-[#ff6600] to-[#ff8533] shadow-lg shadow-[#ff6600]/50'
                  : 'bg-[#1a1b23] border border-gray-800'
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className={`${currentStep === step.number ? 'text-white' : 'text-[#9aa3b2]'}`}>
                  {step.number}
                </span>
              )}
            </div>
            <span
              className={`text-sm ${
                currentStep >= step.number ? 'text-[#e8eaee]' : 'text-[#9aa3b2]'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div className="w-16 h-px bg-gradient-to-r from-gray-800 to-gray-800 relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-[#ff6600] to-[#ff8533] transition-transform duration-500 ${
                  currentStep > step.number ? 'translate-x-0' : '-translate-x-full'
                }`}
              ></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
