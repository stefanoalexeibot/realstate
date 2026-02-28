"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Gavel,
    FileText,
    ShieldCheck,
    Clock,
    Scale,
    CheckCircle2,
    Bell,
    Activity,
    MapPin
} from "lucide-react";

type FeedItem = {
    id: string;
    Icon: any;
    color: string;
    bg: string;
    text: string;
    firm: string;
    firmColor: string;
    urgency?: 'high' | 'medium' | 'low';
};

const LEGAL_FEED_POOL: Omit<FeedItem, "id">[] = [
    {
        Icon: Gavel,
        color: "text-red-400",
        bg: "bg-red-400/10",
        text: "Sentencia favorable publicada en juzgado",
        firm: "García & Asociados",
        firmColor: "text-red-400",
        urgency: 'high'
    },
    {
        Icon: FileText,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        text: "Borrador de contrato listo para revisión",
        firm: "Notaría 128 MTY",
        firmColor: "text-blue-400",
        urgency: 'medium'
    },
    {
        Icon: ShieldCheck,
        color: "text-green-400",
        bg: "bg-green-400/10",
        text: "Documentación certificada en blockchain",
        firm: "LegalTrust Pro",
        firmColor: "text-green-400",
        urgency: 'low'
    },
    {
        Icon: Clock,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        text: "Audiencia programada para 12 de Abril",
        firm: "Bufete Jurídico Integra",
        firmColor: "text-amber-400",
        urgency: 'high'
    },
    {
        Icon: Scale,
        color: "text-indigo-400",
        bg: "bg-indigo-400/10",
        text: "Recurso de apelación presentado exitosamente",
        firm: "Corporate Defense",
        firmColor: "text-indigo-400",
        urgency: 'medium'
    },
    {
        Icon: CheckCircle2,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        text: "Pago de impuestos notariales verificado",
        firm: "Notaría Pública 42",
        firmColor: "text-emerald-400",
        urgency: 'low'
    },
    {
        Icon: Bell,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        text: "Nuevo aviso en boletín judicial detectado",
        firm: "Cima Legal Monitor",
        firmColor: "text-blue-500",
        urgency: 'high'
    },
];

function makeItem(pool: Omit<FeedItem, "id">, index: number): FeedItem {
    return { ...pool, id: `${Date.now()}-${index}` };
}

export default function LegalActivityFeed() {
    const [activeCases, setActiveCases] = useState(142);
    const [notificationsToday, setNotificationsToday] = useState(892);
    const [feed, setFeed] = useState<FeedItem[]>(() =>
        LEGAL_FEED_POOL.slice(0, 3).map((item, idx) => makeItem(item, idx))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCases((v) => v + (Math.random() < 0.1 ? 1 : 0));
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkMobile = () => window.innerWidth < 768;
        const isMobile = checkMobile();

        let poolIndex = 4 % LEGAL_FEED_POOL.length;
        const interval = setInterval(() => {
            const newItem = { ...LEGAL_FEED_POOL[poolIndex % LEGAL_FEED_POOL.length], id: `${Date.now()}-${poolIndex}` }; // Ensure unique ID
            poolIndex++;
            setNotificationsToday((v) => v + Math.floor(Math.random() * 2));
            setFeed((prev) => [newItem, ...prev.slice(0, isMobile ? 2 : 3)]);
        }, isMobile ? 9000 : 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-[450px] mx-auto rounded-3xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-[0_32px_120px_-20px_rgba(0,0,0,0.8)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-800/40">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-slate-300 font-bold uppercase">
                        Cima Legal · Protocol Node
                    </span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <span className="text-[9px] font-bold text-blue-400 tracking-widest uppercase">Activo</span>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 divide-x divide-slate-700/50 border-b border-slate-700/50 bg-slate-800/10">
                <div className="px-6 py-5">
                    <p className="font-heading font-black text-3xl text-white leading-none mb-1">
                        <motion.span
                            key={activeCases}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {activeCases}
                        </motion.span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase leading-tight">Casos en<br />Seguimiento</p>
                </div>
                <div className="px-6 py-5">
                    <p className="font-heading font-black text-3xl text-blue-400 leading-none mb-1">
                        <motion.span
                            key={notificationsToday}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {notificationsToday}
                        </motion.span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase leading-tight">Notificaciones<br />Procesadas</p>
                </div>
            </div>

            {/* Activity feed */}
            <div className="px-6 py-5">
                <p className="font-mono text-[9px] tracking-[0.3em] text-slate-500 uppercase mb-4">
                    Monitor de Expedientes
                </p>
                <div className="space-y-3 overflow-hidden" style={{ height: "220px" }}>
                    <AnimatePresence initial={false} mode="popLayout">
                        {feed.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                                className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-slate-700/30 group hover:border-blue-500/30 transition-colors"
                            >
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} group-hover:scale-110 transition-transform shadow-lg`}>
                                    <item.Icon className={`h-4 w-4 ${item.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-white leading-tight truncate mb-0.5">{item.text}</p>
                                    <p className={`text-[9px] font-mono font-bold ${item.firmColor} leading-tight opacity-70 tracking-tighter uppercase`}>
                                        {item.firm}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-mono text-[8px] text-slate-500 uppercase">Just Now</span>
                                    <div className="h-0.5 w-6 bg-blue-500/20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="h-full w-full bg-blue-500/50"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/60 flex items-center justify-between">
                <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
                    Blockchain-Verified Records
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-blue-400 font-bold font-mono uppercase tracking-tighter">Secure Legal Node</span>
                    <ShieldCheck className="h-3 w-3 text-blue-400" />
                </div>
            </div>
        </div>
    );
}
