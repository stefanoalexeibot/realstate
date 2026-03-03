"use client";

import React from "react";
import { motion } from "framer-motion";
import { Battery, Wifi, Signal } from "lucide-react";

interface MobileFrameProps {
    children: React.ReactNode;
    isDarkMode?: boolean;
}

export function MobileFrame({ children, isDarkMode = true }: MobileFrameProps) {
    const [time, setTime] = React.useState("9:41");

    React.useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false }));
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative mx-auto w-[320px] sm:w-[380px] h-[650px] sm:h-[780px] select-none">
            {/* Outer Case */}
            <div className="absolute inset-0 bg-[#0A0A0B] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),0_0_20px_rgba(200,169,110,0.1)] ring-8 ring-[#1A1A1C] border-2 border-white/5 overflow-hidden">

                {/* Status Bar */}
                <div className="absolute top-0 inset-x-0 h-11 z-[60] flex items-center justify-between px-8 bg-transparent">
                    <span className="text-[12px] font-bold tracking-tight text-white">{time}</span>
                    <div className="flex items-center gap-1.5 opacity-80">
                        <Signal className="h-3 w-3 text-white" />
                        <Wifi className="h-3 w-3 text-white" />
                        <Battery className="h-3.5 w-3.5 text-white" />
                    </div>
                </div>

                {/* Dynamic Island / Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-[70] shadow-inner" />

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full z-[60] backdrop-blur-md" />

                {/* Screen Content */}
                <div className="absolute inset-0 pt-11 pb-6 overflow-hidden bg-[#0A0A0B]">
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                </div>
            </div>

            {/* Physical Buttons (Visual Only) */}
            <div className="absolute -left-2.5 top-28 w-1 h-8 bg-[#2A2A2C] rounded-l-sm" />
            <div className="absolute -left-2.5 top-40 w-1 h-12 bg-[#2A2A2C] rounded-l-sm" />
            <div className="absolute -left-2.5 top-56 w-1 h-12 bg-[#2A2A2C] rounded-l-sm" />
            <div className="absolute -right-2.5 top-44 w-1 h-20 bg-[#2A2A2C] rounded-r-sm shadow-lg" />
        </div>
    );
}
