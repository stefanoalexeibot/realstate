"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, ShieldCheck, Quote } from "lucide-react";

interface TestimonialCardProps {
    name: string;
    role: string;
    text: string;
    avatar: string;
    car: string;
    saved: string;
}

const TestimonialCard = ({ name, role, text, avatar, car, saved }: TestimonialCardProps) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full aspect-[4/5] sm:aspect-[4/3] rounded-[2.5rem] bg-white/5 border border-white/10 p-8 sm:p-10 backdrop-blur-xl group overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div style={{ transform: "translateZ(50px)" }} className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                        <Quote className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />)}
                    </div>
                </div>

                <p className="text-xl sm:text-2xl font-bold text-white mb-8 leading-tight italic">
                    "{text}"
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/20">
                            <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">{name}</h4>
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{car}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3" />
                            AHORRO: {saved}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function AutoTestimonials() {
    const testimonials = [
        {
            name: "Ricardo Salinas",
            car: "BMW M3 2022",
            saved: "$85,000 MXN",
            text: "La experiencia es de otro mundo. Vendí mi coche en 12 días y el proceso legal fue impecable.",
            avatar: "https://i.pravatar.cc/150?u=ricardo"
        },
        {
            name: "Elena Montemayor",
            car: "Audi Q5 2023",
            saved: "$110,000 MXN",
            text: "Cima Auto rompe con el esquema tradicional. Comodidad total y precio justo desde el día uno.",
            avatar: "https://i.pravatar.cc/150?u=elena"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent to-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-xl">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em] mb-4"
                        >
                            Comunidad Cima Elite
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-4xl sm:text-6xl font-black tracking-tight"
                        >
                            La satisfacción de un <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">trato inteligente.</span>
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-white/5 border border-white/10"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-white">+500 Clientes Satisfechos</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} {...t} role="Cliente Elite" />
                    ))}
                </div>
            </div>
        </section>
    );
}
