'use client';



import React, {useState, useEffect} from 'react';
import {ArrowUp} from 'lucide-react';


type ScrollToTopButtonProps = {
    className?: string;
}

const ScrollToTopButton = ({className}: ScrollToTopButtonProps) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;

            // Calculate scroll progress (0 to 100)
            const totalScrollableHeight = documentHeight - windowHeight;
            const progress = (scrollTop / totalScrollableHeight) * 100;

            setScrollProgress(Math.min(progress, 100));

            // Show button after scrolling 300px
            setIsVisible(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    // Calculate the stroke-dashoffset for the progress circle
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Scroll to top"
        >
            <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                width="56"
                height="56"
            >
                {/* Background circle */}
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                />
                {/* Progress circle */}
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-150"
                />
            </svg>
            <ArrowUp className="w-5 h-5 text-gray-700 relative z-10"/>
        </button>
    );
};

export default ScrollToTopButton;