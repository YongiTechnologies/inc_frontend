"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shipping Address", href: "/address" },
    { name: "Container Loadings", href: "/container-loadings" },
    { name: "Contact", href: "/contact" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed top-0 z-50 w-full transition-all duration-300">
            {/* Top Ticker Bar */}
            <div className={`bg-[#000322] text-white text-sm transition-all duration-150 overflow-hidden ${scrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-12 py-2 opacity-100'}`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>+233 XX XXX XXXX</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <Mail size={14} />
                            <span>info@incshipping.com</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <MapPin size={14} />
                        <span>Accra, Ghana</span>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className={`transition-all duration-300 border-1 border-white ${scrolled ? 'bg-white/95 backdrop-blur-md ' : 'bg-transparent backdrop-blur-md'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/assets/inc_logo.png"
                                alt="I&C Shipping and Logistics"
                                width={240}
                                height={80}
                                className="w-auto h-12 lg:h-20 object-contain"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[#000322] hover:text-[#027a65]  transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Link
                                href="/auth/login"
                                className="px-5 py-1.5 rounded-lg font-medium transition-colors border-1 border-[#039B81] text-[#039B81] hover:bg-[#039B81] hover:text-white"
                            >
                                Login
                            </Link>
                            <Link
                                href="/contact"
                                className="px-3 py-1.5 border-1 border-[#039B81] bg-[#039B81] text-white hover:bg-white hover:text-[#027a65] rounded-lg font-medium transition-colors"
                            >
                                Get Quote
                            </Link>
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-[#000322]"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden pb-4 border-t">
                            <div className="flex flex-col gap-2 pt-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="px-4 py-3 text-foreground hover:bg-muted rounded-lg font-medium transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="flex flex-col gap-2 mt-4 px-4">
                                    <Link
                                        href="/auth/login"
                                        className="w-full text-center px-5 py-3 bg-[#FC6100] text-white rounded-lg font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="w-full text-center px-5 py-3 border-2 border-primary text-primary rounded-lg font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Quote
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
