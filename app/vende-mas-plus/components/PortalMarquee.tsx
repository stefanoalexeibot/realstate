'use client';

import React from 'react';
import { motion } from 'framer-motion';

const portals = [
    { name: 'Inmuebles24', emoji: '🏘️' },
    { name: 'Lamudi', emoji: '🏗️' },
    { name: 'Vivanuncios', emoji: '🏡' },
    { name: 'Propiedades.com', emoji: '🔑' },
    { name: 'MercadoLibre', emoji: '📦' },
    { name: 'Metros Cúbicos', emoji: '📐' },
    { name: 'EasyBroker', emoji: '🤝' },
    { name: 'Point2Homes', emoji: '🌎' },
    { name: 'Inmuebles24', emoji: '🏘️' },
    { name: 'Lamudi', emoji: '🏗️' },
    { name: 'Vivanuncios', emoji: '🏡' },
    { name: 'Propiedades.com', emoji: '🔑' },
    { name: 'MercadoLibre', emoji: '📦' },
    { name: 'Metros Cúbicos', emoji: '📐' },
    { name: 'EasyBroker', emoji: '🤝' },
    { name: 'Point2Homes', emoji: '🌎' },
];

export const PortalMarquee = () => (
    <section className="py-16 bg-black border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
            <p className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.4em]">
                Tu propiedad publicada en los mejores portales del país
            </p>
        </div>
        <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex gap-8 w-max"
                animate={{ x: [0, -1440] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
                {portals.map((portal, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/5 shrink-0 hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-default"
                    >
                        <span className="text-2xl">{portal.emoji}</span>
                        <span className="text-sm font-bold text-white/40 tracking-tight whitespace-nowrap">{portal.name}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    </section>
);
