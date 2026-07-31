import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="my-12 p-6 bg-[#fafafa] border border-[#e5e5e5] rounded-2xl">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="text-[#171717]" size={20} />
        <h2 className="text-xl font-bold text-[#171717]">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left p-4 flex items-center justify-between font-semibold text-sm text-[#171717] hover:text-[#0066cc] focus:outline-none"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={16}
                  className={`text-[#777777] transition-transform duration-200 shrink-0 ml-2 ${
                    isOpen ? 'rotate-180 text-[#0066cc]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#555555] leading-relaxed border-t border-[#f5f5f7]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
