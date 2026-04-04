import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-20 bg-white">    
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-br from-[#039B81] via-[#027a65] to-[#039B81] rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Ready to Ship with Us?
                        </h2>
                        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                            Get a free quote today and experience the difference of working with a trusted logistics partner.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#FC6100] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Get Free Quote
                                <ArrowRight size={20} />
                            </Link>
                            <a
                                href="tel:+233000000000"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <Phone size={20} />
                                Call Us Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
