"use client";

import React, { useState, useEffect } from 'react';
import { Container, Title } from '@/components/shared';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
    const [timeLeft, setTimeLeft] = useState(15 * 60);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Container className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <CheckCircle size={80} className="text-green-500 mb-6" />
            <Title text="Thanks for your order!" size="lg" className="font-extrabold mb-2" />
            <p className="text-gray-400 text-xl mb-8">
                It is on the way to you in <span className="text-orange-500 font-bold">15 mins</span>
            </p>

            <div className="bg-white p-10 rounded-[40px] shadow-lg border border-gray-100">
                <p className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">Delivery Countdown</p>
                <div className="text-8xl font-black text-neutral-800 tabular-nums leading-none">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <button
                onClick={() => window.location.href = '/'}
                className="mt-12 text-gray-400 hover:text-gray-600 transition-colors font-medium text-lg border-b border-gray-300"
            >
                Back to Home
            </button>
        </Container>
    );
}
