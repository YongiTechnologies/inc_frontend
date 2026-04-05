"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { submitContact } from "@/services/contact";

const contactInfo = [
    {
        icon: Phone,
        title: "Phone",
        details: ["+233 XX XXX XXXX", "+233 XX XXX XXXX"],
        action: "tel:+233000000000",
    },
    {
        icon: Mail,
        title: "Email",
        details: ["info@incshipping.com", "support@incshipping.com"],
        action: "mailto:info@incshipping.com",
    },
    {
        icon: MapPin,
        title: "Address",
        details: ["123 Shipping Lane", "Accra, Ghana"],
        action: "#",
    },
    {
        icon: Clock,
        title: "Working Hours",
        details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 2:00 PM"],
        action: "#",
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMsg("");
        setErrorMsg("");
        try {
            const result = await submitContact({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || undefined,
                subject: formData.subject,
                message: formData.message,
            });
            setSuccessMsg(result.message || "Thank you for your message! We will get back to you soon.");
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-10 bg-white shadow-sm">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                            Contact Us
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Get in touch with our team.
                        </p>
                    </div>
                </section>

                {/* Contact Info Cards */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {contactInfo.map((info) => (
                                <a
                                    key={info.title}
                                    href={info.action}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
                                >
                                    <div className="w-14 h-14 bg-[#039B81]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <info.icon className="text-[#039B81]" size={28} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{info.title}</h3>
                                    {info.details.map((detail, idx) => (
                                        <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                                    ))}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form & Map */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Form */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent outline-none transition"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent outline-none transition"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent outline-none transition"
                                                placeholder="+233 XX XXX XXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent outline-none transition"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="quote">Get a Quote</option>
                                                <option value="tracking">Tracking Inquiry</option>
                                                <option value="support">Customer Support</option>
                                                <option value="partnership">Business Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent outline-none transition resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>
                                    {successMsg && <div className="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg">{successMsg}</div>}
                                    {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg">{errorMsg}</div>}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FC6100] hover:bg-[#E05500] disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Send size={20} />
                                        )}
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="h-full min-h-[400px] bg-gray-200 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <MapPin className="text-[#1d4ed8] mx-auto mb-4" size={48} />
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Location</h3>
                                        <p className="text-gray-600 mb-4">123 Shipping Lane, Accra, Ghana</p>
                                        <a
                                            href="https://maps.google.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[#1d4ed8] hover:underline"
                                        >
                                            View on Google Maps
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
