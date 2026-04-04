"use client";

import Button from "@/components/common/Button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AuthSlider from "@/components/common/AuthSlider";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login, user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user) {
            const role = user.role?.toLowerCase();
            if (role === 'admin') router.push('/dashboard/admin');
            else if (role === 'employee') router.push('/dashboard/employee');
            else router.push('/dashboard/customer');
        }
    }, [isAuthenticated, user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login({ email, password });
        } catch (error) {
            console.error("Login failed", error);
            alert("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="md:h-screen md:overflow-hidden flex flex-col md:flex-row bg-white">
            {/* Left Column: Form Section (Scrollable with hidden scrollbar) */}
            <div className="w-full md:w-1/2 flex flex-col px-8 md:px-16 lg:px-24 py-12 relative md:h-full md:overflow-y-auto hide-scrollbar">
                <div className="mb-12 flex justify-center md:justify-start">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-500 hover:text-[#039B81] transition-colors font-bold text-sm uppercase tracking-widest"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </Link>
                </div>

                <div className="flex-grow flex flex-col justify-center max-w-md w-full mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-gray-500 text-sm">Enter your details to access your account.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="text-left">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 py-3.5 text-sm bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 focus:bg-white focus:border-[#039B81]/30 transition-all text-gray-900"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-left">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                            </div>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-3.5 text-sm bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 focus:bg-white focus:border-[#039B81]/30 transition-all text-gray-900"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <Link href="#" className="text-xs font-bold text-[#039B81] hover:underline">Forgot Password?</Link>
                            </div>
                        </div>

                        <Button type="submit" isLoading={isLoading} className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-sm shadow-[#039B81]/20">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 text-sm font-medium">
                            Don't have an account? <Link href="/auth/register" className="text-[#039B81] font-bold hover:underline">Register now</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-12 pt-8 text-xs text-gray-400 font-medium tracking-tight text-center">
                    © 2026 I&C Shipping & Logistics. All rights reserved.
                </div>
            </div>

            {/* Right Column: Dynamic Slider Section (Stationed) */}
            <div className="hidden md:block md:w-1/2 relative bg-slate-900 overflow-hidden md:h-full">
                <AuthSlider />
                
                {/* Brand Logo Overlay */}
                <div className="absolute top-8 right-8 z-20 opacity-50">
                    <Image 
                        src="/assets/inc_logo.png" 
                        alt="I&C Logo" 
                        width={180} 
                        height={60} 
                        className="object-contain"
                    />
                </div>
            </div>
        </main>
    );
}
