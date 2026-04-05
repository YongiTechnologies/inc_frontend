"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const images = [
    "/assets/Shipping-from-China-to-Ghana.webp",
];

const AuthSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 bg-slate-900 overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={image}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? "opacity-70" : "opacity-0"
                    }`}
                >
                    <Image
                        src={image}
                        alt={`Auth Slider Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="50vw"
                    />
                </div>
            ))}
            {/* Subtle Overlay to maintain brand look */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#000322]/60 to-transparent pointer-events-none" />
        </div>
    );
};

export default AuthSlider;
