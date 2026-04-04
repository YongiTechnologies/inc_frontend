import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import Image from "next/image";
import { Plane, Ship, FileCheck, ShoppingBag, Warehouse, Truck, ArrowRight, CheckCircle } from "lucide-react";

const services = [
    {
        id: "air-freight",
        icon: Plane,
        title: "Air Freight",
        shortDesc: "Fast and efficient air cargo services for time-sensitive shipments.",
        longDesc: "Our air freight services provide the fastest way to move your goods across the globe. We partner with major airlines to ensure reliable and timely delivery for your urgent shipments.",
        features: [
            "Express and standard air cargo options",
            "Door-to-door and airport-to-airport services",
            "Real-time tracking and notifications",
            "Customs clearance assistance",
            "Dangerous goods handling (certified)",
            "Temperature-controlled shipments",
        ],
        color: "from-blue-500 to-blue-600",
        image: "/assets/air-cargo.webp",
    },
    {
        id: "ocean-freight",
        icon: Ship,
        title: "Ocean Freight",
        shortDesc: "Cost-effective sea shipping for large volume cargo and containers.",
        longDesc: "Ocean freight is the most economical choice for transporting large quantities of goods. We offer both FCL (Full Container Load) and LCL (Less than Container Load) options to suit your needs.",
        features: [
            "FCL and LCL shipping options",
            "Flexible scheduling and routing",
            "Competitive rates for all routes",
            "Container tracking and monitoring",
            "Port-to-port and door-to-door delivery",
            "Specialized container types available",
        ],
        color: "from-cyan-500 to-cyan-600",
        image: "/assets/ocean-freight.avif",
    },
    {
        id: "customs",
        icon: FileCheck,
        title: "Customs Clearance",
        shortDesc: "Expert handling of all customs documentation and compliance.",
        longDesc: "Navigate the complexities of international trade with our expert customs clearance services. Our licensed brokers ensure your shipments comply with all regulations and clear customs smoothly.",
        features: [
            "Licensed customs brokerage",
            "Import and export documentation",
            "Tariff classification assistance",
            "Duty and tax consultation",
            "Compliance with trade regulations",
            "Quick clearance processing",
        ],
        color: "from-emerald-500 to-emerald-600",
        image: "/assets/customs.jpg",
    },
    {
        id: "procurement",
        icon: ShoppingBag,
        title: "Procurement & Sourcing",
        shortDesc: "End-to-end procurement services from trusted global suppliers.",
        longDesc: "Let us handle your sourcing needs. We connect you with verified suppliers worldwide and manage the entire procurement process from order placement to delivery.",
        features: [
            "Supplier verification and vetting",
            "Product sourcing from China and beyond",
            "Quality inspection services",
            "Negotiation and order management",
            "Consolidation and shipping",
            "Payment facilitation",
        ],
        color: "from-orange-500 to-orange-600",
        image: "/assets/procurement.jpg",
    },
    {
        id: "warehousing",
        icon: Warehouse,
        title: "Warehousing",
        shortDesc: "Secure storage facilities with inventory management solutions.",
        longDesc: "Our modern warehousing facilities provide safe and secure storage for your goods. With advanced inventory management systems, you can track your stock in real-time.",
        features: [
            "Climate-controlled storage",
            "24/7 security surveillance",
            "Inventory management system",
            "Pick and pack services",
            "Cross-docking capabilities",
            "Flexible storage terms",
        ],
        color: "from-purple-500 to-purple-600",
        image: "/assets/warehousing.jpg",
    },
    {
        id: "delivery",
        icon: Truck,
        title: "Door-to-Door Delivery",
        shortDesc: "Complete delivery service from pickup to final destination.",
        longDesc: "Experience hassle-free shipping with our comprehensive door-to-door delivery service. We handle everything from pickup at the origin to delivery at your doorstep.",
        features: [
            "Pickup from any location",
            "Complete end-to-end handling",
            "Last-mile delivery solutions",
            "Signature confirmation",
            "Delivery scheduling options",
            "White-glove service available",
        ],
        color: "from-red-500 to-red-600",
        image: "/assets/delivery.jpg",
    },
];

export default function ServicesPage() {
    return (
        <>
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-[#1d4ed8] to-[#1e40af] py-20">
                    <div className="container mx-auto px-4 text-center mt-20">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Our Services
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Comprehensive logistics solutions tailored to meet your shipping needs
                        </p>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="space-y-16">
                            {services.map((service, index) => (
                                <div
                                    key={service.id}
                                    id={service.id}
                                    className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                        }`}
                                >
                                    <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                                        {/* <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-4`}>
                                            <service.icon className="text-white" size={32} />
                                        </div> */}
                                        <h2 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h2>
                                        <p className="text-gray-600 mb-6 leading-relaxed">{service.longDesc}</p>
                                        <ul className="space-y-3 mb-6">
                                            {service.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3">
                                                    <CheckCircle className="text-[#10b981] flex-shrink-0 mt-0.5" size={20} />
                                                    <span className="text-gray-600">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/contact"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FC6100] hover:bg-[#E05500] text-white font-semibold rounded-lg transition-colors"
                                        >
                                            Get a Quote
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                    <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
                                            <Image
                                                src={service.image}
                                                alt={service.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Need a Custom Solution?</h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Every business is unique. Contact us today to discuss how we can tailor our services to meet your specific logistics requirements.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold rounded-lg transition-colors"
                        >
                            Contact Us Today
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
