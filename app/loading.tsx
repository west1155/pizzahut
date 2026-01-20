import React from 'react';
import Image from 'next/image';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            <div className="relative flex flex-col items-center">
                <div className="relative h-32 w-32 animate-pulse transition-all duration-1000">
                    <Image
                        src="/logo.png"
                        alt="Loading..."
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="mt-8 flex space-x-2">
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.3s]"></div>
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.15s]"></div>
                    <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-500"></div>
                </div>
            </div>
        </div>
    );
}
