import Link from "next/link";
import Image from "next/image";

const services = [
    {
        title: "Air Freight",
        description: "Fast and efficient air cargo services for time-sensitive shipments worldwide.",
        href: "/services#air-freight",
        image: "/assets/air-freight2.webp",
    },
    {
        title: "Ocean Freight",
        description: "Cost-effective sea shipping for large volume cargo and containers.",
        href: "/services#ocean-freight",
        image: "/assets/ocean-freight.avif",
    },
    {
        title: "Customs Clearance",
        description: "Expert handling of all customs documentation and regulatory compliance.",
        href: "/services#customs",
        image: "/assets/customs.jpg",
    },
    {
        title: "Procurement",
        description: "End-to-end procurement and sourcing services from trusted suppliers.",
        href: "/services#procurement",
        image: "/assets/procurement.jpg",
    },
    {
        title: "Warehousing",
        description: "Secure storage facilities with inventory management solutions.",
        href: "/services#warehousing",
        image: "/assets/warehousing.webp",
    },
    {
        title: "Door-to-Door",
        description: "Complete delivery service from pickup to final destination.",
        href: "/services#delivery",
        image: "/assets/Door-to-Door.jpg",
    },
];

export default function ServicesGrid() {
    return (
        <section className="py-20 bg-muted">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Our Services
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Comprehensive logistics solutions tailored to meet your shipping needs
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <Link
                            key={service.title}
                            href={service.href}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full overflow-hidden"
                        >
                            <div className="relative w-full h-48">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-[#039B81] transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
