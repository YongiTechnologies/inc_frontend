"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How can I track my shipment?",
        answer: "Enter your tracking number on the home page or tracking page to see real-time updates."
    },
    {
        question: "What are your shipping rates?",
        answer: "Shipping rates vary based on weight, destination, and mode of transport. Get a quote on the contact page."
    },
    {
        question: "What documents are required for international shipping?",
        answer: "Typically a commercial invoice, packing list, and bill of lading are required."
    }
];

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="bg-slate-50 py-24 border-t border-slate-100">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-slate-500 mb-12">Everything you need to know about our logistics and tracking.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl  border transition-all duration-300 overflow-hidden ${isActive ? "border-[#039B81]/30 shadow-[#039B81]/5" : "border-slate-100 hover:border-slate-200"
                                    }`}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-[#039B81] text-white shadow-md shadow-[#039B81]/20" : "bg-slate-50 text-slate-400"
                                            }`}>
                                            <HelpCircle size={20} />
                                        </div>
                                        <h3 className={`text-lg font-bold transition-colors ${isActive ? "text-[#039B81]" : "text-slate-800"
                                            }`}>
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <ChevronDown
                                        className={`text-slate-400 transition-transform duration-300 ${isActive ? "rotate-180 text-[#039B81]" : ""
                                            }`}
                                        size={20}
                                    />
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${isActive ? "max-h-40 opacity-100 pb-6 px-6" : "max-h-0 opacity-0 px-6"
                                        }`}
                                >
                                    <p className="text-slate-500 pl-[60px] leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
