"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, CalendarCheck, TrendingUp, Zap, MessageSquare, ShieldCheck, Globe } from "lucide-react";

type FeedItem = {
    id: number;
    Icon: any;
    color: string;
    bg: string;
    text: string;
    agency: string;
    agencyColor: string;
};

const FEED_POOL: Omit<FeedItem, "id">[] = [
    {
        Icon: Bot,
        color: "text-cima-gold",
        bg: "bg-cima-gold/10",
        text: "Lead calificado automáticamente por IA",
        agency: "Real Estate Luxury MTY",
        agencyColor: "text-cima-gold"
    },
    {
        Icon: CalendarCheck,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        text: "Visita agendada para Penthouse Del Valle",
        agency: "Inmuebles Elite",
        agencyColor: "text-blue-400"
    },
    {
        Icon: TrendingUp,
        color: "text-green-400",
        bg: "bg-green-400/10",
        text: "Trato cerrado · ROI proyectado 4.2x",
        agency: "Capital Real Estate",
        agencyColor: "text-green-400"
    },
    {
        Icon: MessageSquare,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        text: "Nuevo lead ingresó vía WhatsApp Portal",
        agency: "Casas Monterrey",
        agencyColor: "text-yellow-400"
    },
    {
        Icon: ShieldCheck,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        text: "Documentación verificada por Smart-Contract",
        agency: "Notaría Digital Pro",
        agencyColor: "text-purple-400"
    },
    {
        Icon: Globe,
        color: "text-cima-gold",
        bg: "bg-cima-gold/10",
        text: "Propiedad sincronizada en 4 portales",
        agency: "Global Realty",
        agencyColor: "text-cima-gold"
    },
    {
        Icon: Zap,
        color: "text-cima-gold",
        bg: "bg-cima-gold/10",
        text: "Ficha técnica PDF generada dinámicamente",
        agency: "Inmobiliaria Vasconcelos",
        agencyColor: "text-cima-gold"
    },
];

let globalId = 0;

function makeItem(pool: typeof FEED_POOL[0]): FeedItem {
    return { ...pool, id: ++globalId };
}

export default function LiveActivityFeed() {
    const [deployments, setDeployments] = useState(128);
    const [leadsToday, setLeadsToday] = useState(452);
    const [feed, setFeed] = useState<FeedItem[]>(() =>
        FEED_POOL.slice(0, 4).map(makeItem)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setDeployments((v) => v + (Math.random() < 0.1 ? 1 : 0));
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkMobile = () => window.innerWidth < 768;
        const isMobile = checkMobile();

        let poolIndex = 4 % FEED_POOL.length;
        const interval = setInterval(() => {
            const newItem = makeItem(FEED_POOL[poolIndex % FEED_POOL.length]);
            poolIndex++;
            setLeadsToday((v) => v + Math.floor(Math.random() * 3));
            setFeed((prev) => [newItem, ...prev.slice(0, isMobile ? 2 : 3)]);
        }, isMobile ? 8000 : 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-[450px] mx-auto rounded-3xl border border-cima-border bg-cima-card/30 backdrop-blur-xl overflow-hidden shadow-[0_32px_120px_-20px_rgba(0,0,0,0.8)]">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cima-border bg-cima-bg/40">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cima-gold opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cima-gold" />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-cima-text font-bold uppercase">
                        Cima Infrastructure · Live Node
                    </span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-cima-gold/10 border border-cima-gold/20">
                    <span className="text-[9px] font-bold text-cima-gold tracking-widest uppercase">Encendido</span>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 divide-x divide-cima-border border-b border-cima-border bg-cima-card/10">
                <div className="px-6 py-5">
                    <p className="font-heading font-black text-3xl text-cima-text leading-none mb-1">
                        <motion.span
                            key={deployments}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {deployments}
                        </motion.span>
                    </p>
                    <p className="text-[10px] text-cima-text-muted font-bold tracking-widest uppercase leading-tight">Despliegues<br />Empresariales</p>
                </div>
                <div className="px-6 py-5">
                    <p className="font-heading font-black text-3xl text-cima-gold leading-none mb-1">
                        <motion.span
                            key={leadsToday}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {leadsToday}
                        </motion.span>
                    </p>
                    <p className="text-[10px] text-cima-text-muted font-bold tracking-widest uppercase leading-tight">Leads Calificados<br />Hoy Globalmente</p>
                </div>
            </div>

            {/* Activity feed */}
            <div className="px-6 py-5">
                <p className="font-mono text-[9px] tracking-[0.3em] text-cima-text-muted uppercase mb-4">
                    Protocolos en Ejecución
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
                                className="flex items-center gap-4 p-3 rounded-2xl bg-cima-bg/30 border border-cima-border/50 group hover:border-cima-gold/30 transition-colors"
                            >
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} group-hover:scale-110 transition-transform shadow-lg`}>
                                    <item.Icon className={`h-4 w-4 ${item.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-cima-text leading-tight truncate mb-0.5">{item.text}</p>
                                    <p className={`text-[9px] font-mono font-bold ${item.agencyColor} leading-tight opacity-70 tracking-tighter`}>
                                        {item.agency}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-mono text-[8px] text-cima-text-muted uppercase">Now</span>
                                    <div className="h-1 w-8 bg-cima-gold/20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="h-full w-full bg-cima-gold/50"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-cima-border bg-cima-bg/60 flex items-center justify-between">
                <p className="text-[9px] text-cima-text-muted font-mono tracking-widest uppercase">
                    Blockchain-Verified Activity
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-cima-gold font-bold font-mono">SECURE NODE</span>
                    <ShieldCheck className="h-3 w-3 text-cima-gold" />
                </div>
            </div>
        </div>
    );
}
