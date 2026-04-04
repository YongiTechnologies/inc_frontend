import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
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

export default function FAQPage() {
    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 bg-gray-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                        <p className="text-gray-600">Everything you need to know about our services.</p>
                    </div>
                    
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <HelpCircle className="text-[#039B81]" size={20} />
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
